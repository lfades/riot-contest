import './start.html';
import { $ } from 'meteor/jquery';
import { Template } from 'meteor/templating';
import Summoner from '../summoner';

Template.start.helpers({
  errorMessage () {
    return Summoner.errors.get('creatingParty');
  }
});

Template.start.events({
  'submit' (e, instance) {
    e.preventDefault();

    const summoner = {
      region: instance.$('#server').val().toLowerCase(),
      summonerName: instance.$('#name').val()
    };

    Summoner.errors.delete('creatingParty');

    Meteor.call('parties.insert', summoner, (error, partyId) => {
      if (error) {
        console.log(error);
        Summoner.errors.set('creatingParty', error.reason.toUpperCase());
      } else {
        Summoner.errors.delete('creatingParty');
        Summoner._omitNextJoin = true;

        localStorage.setItem('summoner', summoner.summonerName);
        FlowRouter.go(`/party/${partyId}`);
      }
    });
  }
});