import './party_chat.html';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Parties, Summoners } from '../collections';

const getSummoner = () => {
  return Summoners.findOne({
    _name: localStorage.getItem('summoner').replace(/\s/g, '').toLowerCase()
  }, {fields: {_id: 0, id: 1, name: 1}});
}

Template.partyChat.helpers({
  messages () {
    const party = Parties.findOne({_id: FlowRouter.getParam('_id')}, {fields: {messages: 1}});
    return party && party.messages;
  },
  summoners () {
    const party = Parties.findOne({_id: FlowRouter.getParam('_id')}, {fields: {summoners: 1}});
    if (party) {
      const names = party.summoners.map(summoner => summoner.name);
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