import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { _ } from 'meteor/underscore';
import { Parties, Summoners } from '../collection';
import RiotApi from 'meteor/app:riot-api';
import Summoner from './summoner';

// Current connections that we have in the app
const sessions = Meteor.server.sessions;

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

    const party = Parties.findOne({_id: data.partyId});
    
    if (!party)
      throw new Meteor.Error(403, 'No existe la sala');

    const oldSummoner = _.findWhere(party.summoners, {name: data.summonerName})
    
    if (oldSummoner && sessions[oldSummoner.connectionId])
      throw new Meteor.Error(403, 'No puedes ingresar a la sala');

    Summoner.update(this.connection, data);
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