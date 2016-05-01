import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import RiotApi from 'meteor/app:riot-api';
import { Parties, Summoners } from '../collection';

class Summoner {
  constructor () {
    this.championMasteryFields = [
      'championId', 'championLevel', 'championPoints', 'highestGrade'
    ];
  }
  profile (region, summonerName) {
    const summoner = RiotApi.get('/api/lol/{region}/v1.4/summoner/by-name/{summonerNames}', {
      region,
      summonerNames: summonerName
    });

    if (!summoner)
      throw new Meteor.Error(403, 'No hay un invocador registrado con ese nombre');

    return summoner;
  }
  championMastery (platformId, playerId) {
    const championMastery = RiotApi.get('/championmastery/location/{platformId}/player/{playerId}/champions', {
      platformId, playerId
    });

    if (!championMastery)
      throw new Meteor.Error(403, 'No hemos encontrado ningun campeón con maestría');

    return championMastery;
  }
  update (region, summonerName, partyId) {
    const summoner = this.profile(region, summonerName);
    const {id, name, profileIconId} = summoner;
    const championMastery = this.championmastery(region, id);

    if (!partyId) {
      partyId = Parties.insert({region, owner: id});
      if (!partyId)
        throw new Meteor.Error(403, 'Ha ocurrido un error, intenta de nuevo');
    }
    // No estoy utilizando index todavia, se puede crear uno haciendo lo siguiente
    // Summoners._ensureIndex({region: 1, id: 1})
    const updated = Summoners.update({region, id}, {
      $set: {id, name, profileIconId,
        championmastery: championMastery.map(champion => {
          return _.pick(champion, this.championMasteryFields)
        })
      },
      $push: {parties: partyId}
    }, {upsert: true}))
    
    if (!updated)
      throw new Meteor.Error(403, 'Ha ocurrido un error, intenta de nuevo');

    return partyId;
  }
}

export default new Summoner();