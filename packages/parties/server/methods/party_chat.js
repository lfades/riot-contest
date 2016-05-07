import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Parties } from 'meteor/app:collections';

Meteor.methods({
  /*
   * Allows to send a message to the chat
   */
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
      summoners: {$elemMatch: {id, name, connectionId: this.connection.id}}
    }, {
      $push: {messages: {id, name, text}}
    });
  }
});