import { Meteor } from 'meteor/meteor';
import { Parties, Summoners } from '../collections';

// This is the data we send to the client
Meteor.publish('party', function (partyId) {
  const party = Parties.find({_id: partyId}, {fields: {'summoners.connectionId': 0}});
  if (party.count()) {
    return [
      party,
      Summoners.find({parties: partyId}, {fields: {championMastery: 0}})
    ];
  }
  return this.ready();
});