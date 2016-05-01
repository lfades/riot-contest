import './party.html';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.party.onCreated(function () {
  const partyId = FlowRouter.getParam('_id');
  const summonerName = localStorage.getItem('summoner');
  
  if (summonerName) {
    Meteor.call('parties.join', {partyId, summonerName}, (error) => {
      if (error) localStorage.removeItem('summoner');
    });
  }

  this.subscribe('party', partyId);
});

Template.party.helpers({

});