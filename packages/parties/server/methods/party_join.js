import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Parties } from 'meteor/app:collections';
import RiotApi from 'meteor/app:riot-api';
import Summoner from '../summoner';

// Current connections that we have in the app
const Sessions = Meteor.server.sessions;
// return a random number between 0 and max less one
const checkParty = ({partyId, summonerName}) => {
  const party = Parties.findOne({_id: partyId});

  if (!party)
    throw new Meteor.Error(403, 'No existe la sala');

  let oldSummoner;
  let count = 0;

  summonerName = Summoner.standardizedName(summonerName);

  party.summoners.forEach(({id, name, connectionId}) => {
    if (Summoner.standardizedName(name) === summonerName)
      oldSummoner = {id, connectionId};
    else
      count ++;
  });

  if (count >= 10)
    throw new Meteor.Error(403, 'La sala ya tiene el máximo de invocadores');


  return {oldSummoner, party};
}

Meteor.methods({
  /*
   * Creates a new party with a summoner
   */
  'parties.insert' (data) {
    check(data, {
      region: Match.OneOf(...RiotApi.regions),
      summonerName: String
    });

    return Summoner.update(this.connection, data);
  },
  /*
   * A new summoner join the party
   */
  'parties.join' (data) {
    check(data, {
      partyId: String,
      summonerName: String
    });

    const {oldSummoner, party} = checkParty(data);

    if (oldSummoner) {
      let conId = oldSummoner.connectionId;
      if (conId && Sessions[conId])
        throw new Meteor.Error(403, 'No puedes ingresar a la sala');
      
      data.oldSummonerId = oldSummoner.id;
    }

    data.party = party;

    Summoner.update(this.connection, data);
  },
  /*
   * Add a bot to the party, the only difference with a real summoner is that is not connected to the party
   */
  'parties.joinBot' (data) {
    check(data, {
      partyId: String,
      summonerName: String
    });

    const {oldSummoner, party} = checkParty(data);
    if (oldSummoner)
      throw new Meteor.Error(403, 'Ya hay un invocador con ese nombre');
    
    const {id, name, update} = Summoner.getSummoner(party.region, data.summonerName);

    if (!Parties.update({_id: partyId}, {$push: {summoners: {id, name}}}))
      throw new Meteor.Error(403, 'Ha ocurrido un error, intenta de nuevo');

    update();
  }
});