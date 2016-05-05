import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

FlowRouter.route('/', {
  action (params) {
    BlazeLayout.render('partyLayout', {main: 'start'});
  }
});

FlowRouter.route('/party/:_id', {
  action (params) {
    BlazeLayout.render('partyLayout', {main: 'party'});
  }
});