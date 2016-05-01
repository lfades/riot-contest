import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { FlowRouter } from 'meteor/kadira:flow-router';

Tracker.autorun(function () {
  const status = Meteor.status();

  if (status.status !== 'connected') return;

  const partyId = FlowRouter.getParam('_id');
  const summonerName = localStorage.getItem('summoner');
  
  if (summonerName) {
    Meteor.call('parties.join', {partyId, summonerName}, (error) => {
      if (error) {
        console.log(error);
        localStorage.removeItem('summoner');
      }
    });
  }
});