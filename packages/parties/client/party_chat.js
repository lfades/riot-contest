import './party_chat.html';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Summoners } from '../collections';
import Summoner from './summoner';

const getSummoner = () => {
  return Summoners.findOne({
    _name: localStorage.getItem('summoner').replace(/\s/g, '').toLowerCase()
  }, {fields: {_id: 0, id: 1, name: 1}});
}

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

    Meteor.call('parties.sendMessage', data, getSummoner(), (error) => {
      if (error)
        console.log(error)
      else
        instance.find('form').reset();
    });
  }
});