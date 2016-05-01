import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Parties, Summoners } from '../collection';
import Summoner from './summoner';

const summonerPattern = {
  id: String,
  name: String
};

Meteor.methods({
  'parties.insert' (data) {
    check(data, {
      region: String,
      summonerName: String
    });

    return Summoner.update(this.connection, data);
  },
  'parties.join' (data) {
    check(data, {
      partyId: String,
      summonerName: String
    });

    const party = Parties.findOne({_id: data.partyId, 'summoners.name': {$ne: data.summonerName}});
    
    if (!Party)
      throw new Meteor.Error(403, 'No existe la sala');

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