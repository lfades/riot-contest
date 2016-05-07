import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import RiotApi from 'meteor/app:riot-api';
import { Parties, Summoners } from 'meteor/app:collections';

class Summoner {
  constructor () {
    // Fields stored in mongo for champion mastery
    this.championMasteryFields = [
      'championId', 'championLevel', 'championPoints', 'highestGrade'
    ];
  }
  // returns the basic summoner information
  profile (region, summonerName) {
    region = RiotApi.getRegion(region);

    const summoner = RiotApi.get('https://{region}.api.pvp.net/api/lol/{region}/v1.4/summoner/by-name/{summonerNames}', {
      region,
      summonerNames: summonerName
    });

    if (!summoner)
      throw new Meteor.Error(403, 'There is no a summoner registered with that name');

    return summoner[summonerName];
  }
  // returns the mastery of all the champions of a summoner
  championMastery (platformId, playerId) {
    const championMastery = RiotApi.get('https://{server}.api.pvp.net/championmastery/location/{platformId}/player/{playerId}/champions', {
      server: RiotApi.getRegion(platformId),
      platformId,
      playerId
    });

    if (!championMastery)
      throw new Meteor.Error(403, 'We have not found the summoner');

    if (!championMastery.length)
      throw new Meteor.Error(403, "We have not found any champion with master's degree");

    return championMastery;
  }
  standardizedName (summonerName) {
    return summonerName.replace(/\s/g, '').toLowerCase();
  }
  getSummoner (region, _name) {
    // _name is the standardized summoner name, which is the summoner name in all lower case and with spaces removed
    // Summoners should have an index in region and _name (the default index is in _id)
    // Summoners._ensureIndex({region: 1, _name: 1});
    const summoner = Summoners.findOne({region, _name: _name});

    if (!summoner) {
      const {id, name, profileIconId} = this.profile(region, _name);
      const championMastery = this.championMastery(region, id);

      return {
        id, name, _name,
        update: (partyId) => {
          const doc = {id, region, name, _name, profileIconId,
            championMastery: championMastery.map(champion => {
              return _.pick(champion, this.championMasteryFields)
            }),
            lastUpdateAt: (new Date()).getTime()
          };

          if (partyId)
            doc.parties = [partyId];
          
          return Summoners.insert(doc);
        }
      };
    }
    const now = new Date();
    const khe = new Date(now.getTime());

    if (summoner.lastUpdateAt < now.setDate(now.getDate() - 1)) {
      const {id, name, profileIconId} = this.profile(region, _name);
      const championMastery = this.championMastery(region, id);

      return {
        id, name,
        update: (partyId) => {
          const operator = {
            $set: {id, name, _name, profileIconId, 
              championMastery: championMastery.map(champion => {
                return _.pick(champion, this.championMasteryFields)
              }),
              lastUpdateAt: (new Date()).getTime()
            }
          };

          if (partyId)
            operator.$push = {parties: partyId};

          return Summoners.update({region, _name}, operator);
        }
      };
    }
    const {id, name} = summoner;
    return {
      id, name,
      update (partyId) {
        return partyId && Summoners.update({region, _name}, {$push: {parties: partyId}});
      }
    };
  }
  // links Riot Api with Mongo
  update (connection, {party, region = party.region, summonerName, partyId, oldSummonerId}) {
    summonerName = this.standardizedName(summonerName);
    
    const {id, name, update} = this.getSummoner(region, summonerName);
    // summoner contains the fields that are stored in the party
    // connections allows to link the user's browser to the application
    const summoner = {id, name, connectionId: connection.id};
    // If the party already exists we add the summoner or create a new party
    const updateParty = () => {
      if (partyId) {
        // oldSummonerId is only existing when we want to replace a summoner
        // that is in the room but is not connected or is a bot
        if (oldSummonerId) {
          return Parties.update(
            {_id: partyId, 'summoners.id': oldSummonerId},
            this._setOwner({$set: {'summoners.$': summoner}}, id, party)
          );
        }
        return Parties.update({_id: partyId}, this._setOwner({
          $push: {summoners: summoner}
        }, id, party));
      }

      party = {region, owner: id, summoners: [summoner]};
      partyId = Parties.insert(party);
      return partyId;
    }
    if (!updateParty())
      throw new Meteor.Error(403, 'Ha ocurrido un error, intenta de nuevo');

    // This is very important, we want to clear the relationship between a
    // summoner with the party when he loses his connection to the server
    // e.g close the browser or run out of internet
    connection.onClose(() => {
      party = Parties.findOne({_id: partyId});

      Parties.update({_id: partyId},
        this._setOwner({$pull: {summoners: summoner}}, id, party, true)
      );
      Summoners.update({region, id},  {$pull: {parties: partyId}});
    });

    if (!update(partyId))
      throw new Meteor.Error(403, 'Ha ocurrido un error, intenta de nuevo');

    return partyId;
  }
  _setOwner (modifier, id, party, remove) {
    const {owner, summoners} = party;
    
    const set = (op, val) => {
      if (!modifier[op])
        modifier[op] = {};
      modifier[op].owner = val;
      return modifier;
    }
    
    if (!owner)
      return set('$set', id);

    if (remove && owner === id) {
      const newOwner = _.find(summoners, user => user.id !== id);
      
      if (newOwner)
        return set('$set', newOwner.id);
      
      return set('$unset', 1);
    }

    return modifier;
  }
}

export default new Summoner();