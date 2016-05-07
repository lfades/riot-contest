import './party_chat.html';
import { _ } from 'meteor/underscore';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Summoners } from 'meteor/app:collections';
import Summoner from '../../summoner';

Template.partyChat.helpers({
  messages () {
    return Summoner.party({messages: 1}).messages;
  },
  summoners () {
    const summoners = Summoner.party({summoners: 1}).summoners;
    if (summoners) {
      const names = summoners.map(summoner => summoner.name);
      return {
        names: names.join(', '),
        have: names.length > 1 ? 'have': 'has'
      }
    }
  }
});

Template.partyChat.events({
  'submit' (e, instance) {
    e.preventDefault();

    const data = {
      partyId: FlowRouter.getParam('_id'),
      text: instance.$('.input-chat').val()
    };
    const summoner = Summoner.me({_id: 0, id: 1, name: 1});

    Meteor.call('parties.sendMessage', data, summoner, (error) => {
      if (error)
        console.log(error)
      else
        instance.find('form').reset();
    });
  }
});