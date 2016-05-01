import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { _ } from 'meteor/underscore';
import { Parties, Summoners } from '../collections';
import RiotApi from 'meteor/app:riot-api';
import Summoner from './summoner';

// Current connections that we have in the app
const Sessions = Meteor.server.sessions;

const checkParty = ({partyId, summonerName}) => {
  const party = Parties.findOne({_id: partyId});

  if (!party)
    throw new Meteor.Error(403, 'No existe la sala');

  let oldSummoner;
  let count = 0;

  summonerName = Summoner.standardizedName(summonerName);

  _.each(party.summoners, ({id, name, connectionId}) => {
    if (Summoner.standardizedName(name) === summonerName)
      oldSummoner = {id, connectionId};
    else
      count ++;
  });
  //throw new Meteor.Error(403, 'No existe la sala');
  if (count >= 5)
    throw new Meteor.Error(403, 'La sala ya tiene el máximo de invocadores');

  return {
    region: party.region,
    oldSummoner
  };
}

Meteor.methods({
  'parties.insert' (data) {
    check(data, {
      region: Match.OneOf(...RiotApi.regions),
      summonerName: String
    });

    return Summoner.update(this.connection, data);
  },
  'parties.join' (data) {
    check(data, {
      partyId: String,
      summonerName: String
    });

    const {oldSummoner, region} = checkParty(data);

    if (oldSummoner) {
      let conId = oldSummoner.connectionId;
      if (conId && Sessions[conId])
        throw new Meteor.Error(403, 'No puedes ingresar a la sala');
      
      data.oldSummonerId = oldSummoner.id;
    }

    data.region = region;

    Summoner.update(this.connection, data);
  },
  'parties.joinBot' (data) {
    check(data, {
      partyId: String,
      summonerName: String
    });

    const {oldSummoner, region} = checkParty(data);
    if (oldSummoner)
      throw new Meteor.Error(403, 'Ya hay un invocador con ese nombre');
    
    const {id, name, update} = Summoner.getSummoner(region, data.summonerName);

    if (!Parties.update({_id: partyId}, {$push: {summoners: {id, name}}}))
      throw new Meteor.Error(403, 'Ha ocurrido un error, intenta de nuevo');

    update();
  },
  'parties.chooseSide' (data) {
    check(data, {
      partyId: String,
      side: Match.OneOf(1, 2)
    });

    Parties.update({_id: data.partyId, 'summoners.connectionId': this.connection.id}, {
      $set: {'summoners.$.side': data.side}
    });
  },
  'parties.sendMessage' (data, summoner) {
    check(data, {
      partyId: String,
      text: String
    });
    check(summoner, {
      id: Number,
      name: String
    });

    const {partyId, text} = data;
    const {id, name} = summoner;

    Parties.update({
      _id: partyId,
      // the order is important, needs to be exactly the same
      summoners: {id, name, connectionId: this.connection.id} 
    }, {
      $push: {messages: {id, name, text}}
    });
  }
});