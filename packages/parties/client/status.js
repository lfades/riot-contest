import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import Summoner from './summoner';
// connect the summoner to a party with his current summoner name when the page loads
// or after change the party id on the route
Tracker.autorun(function () {
  const status = Meteor.status();

  if (status.status !== 'connected') return;

  const summonerName = localStorage.getItem('summoner');
  
  if (summonerName)
    Summoner.join(summonerName)
});