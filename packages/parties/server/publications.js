import { Meteor } from 'meteor/meteor';
import { Parties, Summoners } from '../collection';

Meteor.publish('party', function (partyId) {
	const party = Parties.find({_id: partyId});
	if (party.count()) {
		return [
			party,
			Summoners.find({parties: partyId})
		];
	}
	return this.ready();
});