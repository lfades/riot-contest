import { Meteor } from 'meteor/meteor';
import { Parties } from 'meteor/app:collections';
// Latency compensation
Meteor.methods({
	'parties.chooseSide' (data) {
    const name = localStorage.getItem('summoner');
    
    Parties.update({_id: data.partyId, 'summoners.name': name}, {
      $set: {'summoners.$.side': data.side}
    });
  },
  'parties.sendMessage' (data, summoner) {
    const {partyId, text} = data;
    const {id, name} = summoner;

    Parties.update({_id: partyId}, {
      $push: {messages: {id, name, text}}
    });
  }
});