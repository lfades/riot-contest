import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import RiotApi from 'meteor/app:riot-api';
import Parties from '../collection';

Meteor.methods({
	'parties.join' ({partyId, server, summonerName}) {
		check(partyId, String);
		check(region, String);
		check(summonerName, String);

		const summoner = RiotApi.get('/api/lol/{region}/v1.4/summoner/by-name/{summonerNames}', {
			region,
			summonerNames: summonerName
		});

		if (!summoner)
			throw new Meteor.Error(403, 'No hay un invocador registrado con ese nombre');
	
		//const {}
		const masteries = RiotApi.get('/championmastery/location/{platformId}/player/{playerId}/champions', {
			platformId: region,
			playerId: summoner.id
		});

		Parties.update({_id: partyId}, {$push: {summoners: summoner}});
	}
});