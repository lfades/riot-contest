import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { _ } from 'meteor/underscore';
import { Parties, Summoners } from 'meteor/app:collections';

// return a random number between 0 and max less one
const randomNumber = (max) => (
  Math.floor(Math.random() * max)
);

const getBotMessage = (levels, denied) => {
  const masteryText = levels.length > 1 ? 'masteries': 'mastery';
  let message = `All Summoners have now a champion with the selected ${masteryText} :D`;
  
  if (denied.length)
    message += `, Except for ${denied.join(', ')}, because there were no champions available, so I choose a champion with a random mastery.`

  return message;
}

Meteor.methods({
  /*
   * Summoner choose whether to be in the team demacia (1) or Noxus (2)
   */
  'parties.chooseSide' (data) {
    check(data, {
      partyId: String,
      side: Match.OneOf(1, 2)
    });

    Parties.update({_id: data.partyId, 'summoners.connectionId': this.connection.id}, {
      $set: {'summoners.$.side': data.side}
    });
  },
  /*
   * Select a champion based on required masteries,
   * select a champion with random mastery if not find one
   */
  'parties.roll' (data) {
    check(data, {
      partyId: String,
      levels: [Match.OneOf(1, 2, 3, 4, 5)]
    });

    const {partyId, levels} = data;
    const connectionId = this.connection.id;
    const party = Parties.findOne({_id: partyId, 'summoners.connectionId': connectionId});

    if (!party)
      throw new Meteor.Error(403, 'There is no party');

    const summonerId = _.findWhere(party.summoners, {connectionId}).id;
    if (party.owner !== summonerId)
      throw new Meteor.Error(403, 'Only the owner can roll');
  
    const denied = [];
    const summoners = Summoners.find({parties: partyId}).map(({id, name, championMastery}) => {
      let champions = _.filter(championMastery,
        champion => _.contains(levels, champion.championLevel)
      );
      
      if (!champions.length) {
        denied.push(name);
        champions = championMastery;
      }
      
      return {
        id, champion: champions[randomNumber(champions.length)]
      };
    });

    if (!summoners.length)
      throw new Meteor.Error(403, 'the party has no summoners');

    Parties.update({_id: partyId}, {
      $set: {
        champions: summoners
      },
      $push: {
        messages: {
          bot: true,
          name: 'Bot Heimer',
          text: getBotMessage(levels, denied) 
        }
      }
    });
  }
});