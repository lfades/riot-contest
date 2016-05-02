import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import Summoner from './summoner';

Tracker.autorun(function () {
  const status = Meteor.status();

  if (status.status !== 'connected') return;

  const summonerName = localStorage.getItem('summoner');
  
  if (summonerName)
    Summoner.join(summonerName)
});