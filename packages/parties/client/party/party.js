import './party.html';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Summoners } from 'meteor/app:collections';
import Summoner from '../summoner';

Template.party.onCreated(function () {
  this.subscribe('party', FlowRouter.getParam('_id'));
});

Template.party.helpers({
  partyId () {
    return FlowRouter.getParam('_id');
  },
  summoners (side) {
    const party = Summoner.party({summoners: 1});
    side = Number(side);

    return party.summoners && _.where(party.summoners, {side});
  },
  summoner () {
    return Summoners.findOne({id: this.id}) || this;
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