import { _ } from 'meteor/underscore';
import { Parties, Summoners } from 'meteor/app:collections';
import PublishRelations from 'meteor/cottz:publish-relations';
import RiotApi from 'meteor/app:riot-api';
// We need the basic data of champions like the name and image
// Keep the data for use and publish later
const champions = {};
let request;

if (!RiotApi.apiKey) {
  console.log('We can not communicate with the riot games api :C. Add your key in the riot-api package (packages/riot-api/riot-api.js)');
} else {
  request = RiotApi.get('https://global.api.pvp.net/api/lol/static-data/{region}/v1.2/champion?champData=image', {
    region: 'na',
  });

  if (request) {
    _.each(request.data, champion => {
      champion.image = champion.image.full;
      champions[champion.id] = _.omit(champion, 'id', 'key', 'title');
    });
  }
}
// ----------------------------------------------------------------------------------------------------------------------
// publish to the client a party with his summoners
PublishRelations('party', function (partyId) {
  const party = Parties.find({_id: partyId}, {fields: {'summoners.connectionId': 0}});

  if (party.count()) {
    this.cursor(party, function (id, doc) {
      if (doc.champions) {
        doc.champions.forEach(({id, champion}) => {
          _.extend(champion, champions[champion.championId]);
        });
      }   
    });

    return Summoners.find({parties: partyId}, {fields: {id: 1, name: 1, _name: 1, profileIconId: 1}})
  }
  return this.ready();
});