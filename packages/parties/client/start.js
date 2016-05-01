import './start.html';
import { $ } from 'meteor/jquery';
import { Template } from 'meteor/templating';

Template.start.events({
  'submit' (e, instance) {
    e.preventDefault();

    const summoner = {
      region: instance.$('#server').val().toLowerCase(),
      summonerName: instance.$('#name').val()
    };

    Meteor.call('parties.insert', summoner, (error, partyId) => {
      if (error) {
        return;
        // we should do something
      } else {
        FlowRouter.go(`/party/${partyId}`);
      }
    });
  }
});

Template.startSelect.onRendered(function (){

});