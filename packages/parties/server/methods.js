import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { _ } from 'meteor/underscore';
import { Parties, Summoners } from '../collection';
import RiotApi from 'meteor/app:riot-api';
import Summoner from './summoner';

// Current connections that we have in the app
const Sessions = Meteor.server.sessions;

const checkParty = ({partyId, summonerName}) => {
  const party = Parties.findOne({_id: partyId});

  if (!party)
    throw new Meteor.Error(403, 'No existe la sala');

  if (party.summoners.length >= 5)
    throw new Meteor.Error(403, 'La sala ya tiene el máximo de invocadores');

  return {
    region: party.region,
    oldSummoner: _.findWhere(party.summoners, {name: data.summonerName})
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

    const {oldSummoner} = checkParty(data)

    if (oldSummoner) {
      let conId = oldSummoner.connectionId;
      if (conId && Sessions[conId])
        throw new Meteor.Error(403, 'No puedes ingresar a la sala');
      // remove the bot
      if (!conId)
        data.oldSummoner = oldSummoner;
    }

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
      id: String,
      name: String
    });

    const {partyId, text} = data;
    const {id, name} = summoner;

    summoner.connectionId = this.connectionId;

    Parties.update({
      _id: partyId,
      summoners: {connectionId: this.connection.id, id, name} 
    }, {
      $push: {messages: {id, name, text}}
    });
  }
});