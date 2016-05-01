import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import RiotApi from 'meteor/app:riot-api';
import { Parties, Summoners } from '../collection';

class Summoner {
  constructor () {
    // Fields stored in mongo for champion mastery
    this.championMasteryFields = [
      'championId', 'championLevel', 'championPoints', 'highestGrade'
    ];
  }
  // returns the basic summoner information
  profile (region, summonerName) {
    const summoner = RiotApi.get('/api/lol/{region}/v1.4/summoner/by-name/{summonerNames}', {
      region: RiotApi.getRegion(region),
      summonerNames: summonerName
    });

    if (!summoner)
      throw new Meteor.Error(403, 'No hay un invocador registrado con ese nombre');

    return summoner[summonerName.toLowerCase()];
  }
  // returns the mastery of all the champions of a summoner
  championMastery (platformId, playerId) {
    const championMastery = RiotApi.get('/championmastery/location/{platformId}/player/{playerId}/champions', {
      platformId, playerId
    });

    if (!championMastery)
      throw new Meteor.Error(403, 'No hemos encontrado ningun campeón con maestría');

    return championMastery;
  }
  getSummoner (region, summonerName) {
    // Summoners should have an index in region and name (the default index is in _id)
    // Summoners._ensureIndex({region: 1, name: 1});
    const summoner = Summoners.findOne({region, name: summonerName});

    if (!summoner) {
      const {id, name, profileIconId} = this.profile(region, summonerName);
      const championMastery = this.championMastery(region, id);

      return {
        id, name,
        update: (partyId) => {
          const doc = {id, region, name, profileIconId, 
            championMastery: championMastery.map(champion => {
              return _.pick(champion, this.championMasteryFields)
            })
          };

          if (partyId)
            doc.parties = [partyId];
          
          Summoners.insert(doc);
        }
      };
    }
    const now = new Date();

    if (summoner.lastUpdateAt < now.setDate(now.getDate - 1)) {
      const {id, name, profileIconId} = this.profile(region, summonerName);
      const championMastery = this.championMastery(region, id);

      return {
        id, name,
        update: (partyId) => {
          const operator = {
            $set: {name, profileIconId, 
              championMastery: championMastery.map(champion => {
                return _.pick(champion, this.championMasteryFields)
              })
            }
          };

          if (partyId)
            operator.$push = {parties: partyId};

          Summoners.update({region, id}, operator);
        }
      };
    }

    const {id, name} = summoner;
    return {
      id, name,
      update (partyId) {
        return partyId && Summoners.update({region, id}, {$push: {parties: partyId}});
      }
    };
  }
  // links Riot Api with Mongo
  update (connection, {region, summonerName, partyId, oldSummoner}) {
    const {id, name, update} = this.getSummoner(region, summonerName);
    // summoner contains the fields that are stored in the party
    // connections allows to link the user's browser to the application
    const summoner = {id, name, connectionId: connection.id};

    // If the party already exists we add the summoner or create a new party
    const updateParty = () => {
      if (partyId) {
        let operator = {$push: {summoners: summoner}};

        if (oldSummoner)
          operator.$pull = {summoners: oldSummoner};
        
        return Parties.update({_id: partyId}, operator);
      }

      partyId = Parties.insert({region, owner: id, summoners: [summoner]});
      return partyId;
    }
    if (!updateParty())
      throw new Meteor.Error(403, 'Ha ocurrido un error, intenta de nuevo');

    // This is very important, we want to clear the relationship between a
    // summoner with the party when he loses his connection to the server
    // e.g close the browser or run out of internet
    connection.onClose(() => {
      Parties.update({_id: partyId}, {$pull: {summoners: summoner}});
      Summoners.update({region, id},  {$pull: {parties: partyId}});
    });

    if (!update(partyId))
      throw new Meteor.Error(403, 'Ha ocurrido un error, intenta de nuevo');

    return partyId;
  }
}

export default new Summoner();