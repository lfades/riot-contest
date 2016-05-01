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
      region,
      summonerNames: summonerName
    });

    if (!summoner)
      throw new Meteor.Error(403, 'No hay un invocador registrado con ese nombre');

    return summoner;
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
  // links Riot Api with Mongo
  update (connection, {region, summonerName, partyId}) {
    const summoner = this.profile(region, summonerName);
    const {id, name, profileIconId} = summoner;
    const championMastery = this.championmastery(region, id);
    // _summoner contains the fields that are stored in the party
    // connectionId allows to link the user's browser to the application
    const _summoner = {id, name, connectionId: connection.id};

    // If the party already exists we add the summoner or create new party
    const updateParty = () => {
      if (partyId)
        return Parties.update({_id: partyId}, {$push: {summoners: _summoner}});

      partyId = Parties.insert({region, owner: id, summoners: [_summoner]});
      return partyId;
    }
    if (!updateParty())
      throw new Meteor.Error(403, 'Ha ocurrido un error, intenta de nuevo');

    // This is very important, we want to clear the relationship between a
    // summoner with the party when he loses his connection to the server
    // e.g close the browser or run out of internet
    connection.onClose(() => {
      Parties.update({_id: partyId}, {$pull: {summoners: _summoner}});
      Summoners.update({region, id},  {$pull: {parties: partyId}});
    });
    // Summoners should have an index in region and id (the default index is in _id)
    // Summoners._ensureIndex({region: 1, id: 1});
    const updated = Summoners.update({region, id}, {
      $set: {id, name, profileIconId,
        championmastery: championMastery.map(champion => {
          return _.pick(champion, this.championMasteryFields)
        })
      },
      $push: {parties: partyId}
    }, {upsert: true});
    
    if (!updated)
      throw new Meteor.Error(403, 'Ha ocurrido un error, intenta de nuevo');

    return partyId;
  }
}

export default new Summoner();