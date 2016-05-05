import './party_header.html';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.partyHeader.events({
  'click #start' (e, instance) {
    const data = {
      partyId: FlowRouter.getParam('_id'),
      levels: [Number(instance.find('.select-mastery').value)]
    };
  
    Meteor.call('parties.roll', data, error => {
      if (error)
        console.log(error);
    });
  }
});