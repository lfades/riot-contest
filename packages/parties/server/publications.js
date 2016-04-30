import { Meteor } from 'meteor/meteor';
import RiotApi from 'meteor/app:riot-api';
import Parties from '../collection';
/*
RiotApi.get('/championmastery/location/{platformId}/player/{playerId}/champions', {
	platformId: 'LA1',
	playerId: '29275'
})*/
Meteor.publish('party', function (partyId) {
	return Parties.findOne({_id: partyId});
});