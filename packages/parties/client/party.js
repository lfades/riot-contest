import './party.html';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import Summoner from './summoner';

Template.party.onCreated(function () {
  this.subscribe('party', FlowRouter.getParam('_id'));
});

Template.party.helpers({
  summoners (side) {
    const party = Summoner.party({summoners: 1});
    side = Number(side);
    
    if (party.summoners) {
      const summoners = [];

      party.summoners.forEach(summoner => {
        if (summoner.side === side)
          summoners.push(side);
      });

      return summoners;
    }
  },
  loggedOut () {
    return !Summoner.get();
  }
});

Template.party.events({
  'submit #join' (e, instance) {
    e.preventDefault();

    Summoner.join(instance.find('#name').value);
  },
  'click #demacia' () {
    Meteor.call('parties.chooseSide', {
      partyId: FlowRouter.getParam('_id'),
      side: 1
    });
  },
  'click #noxus' () {
    Meteor.call('parties.chooseSide', {
      partyId: FlowRouter.getParam('_id'),
      side: 2
    });
  }
});