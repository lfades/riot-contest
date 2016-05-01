import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Parties } from '../collection';

Meteor.methods({
  'parties.insert' ({region, summonerName}) {
    check(region, String);
    check(summonerName, String);

    return Summoner.update(region, summonerName);
  },
  'parties.join' ({partyId, summonerName}) {
    check(partyId, String);
    check(summonerName, String);

    const party = Parties.findOne({_id: partyId});
    
    if (!Party)
      throw new Meteor.Error(403, 'No existe la sala');

    Summoner.update(party.region, summonerName, partyId);
  }
});