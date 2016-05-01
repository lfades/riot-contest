import './party.html';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.party.onCreated(function () {
	this.subscribe('party', FlowRouter.getParam('_id'));
});

Template.party.helpers({

});