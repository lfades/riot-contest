import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Parties } from 'meteor/app:collections';
/*
 * Client helpers to control the summoner connection
 * we use localStorage to save the summoner name, and connect to the server with
 * that name every time that the client refresh the page or reconnect to the server
 */
class summoner {
  constructor () {
    // we use a dependency to make reactive the localStorage item for summoner
    this.dep = new Tracker.Dependency;
  }
  get () {
    this.dep.depend();
    return localStorage.getItem('summoner');
  }
  set (name) {
    if (name !== localStorage.getItem('summoner')) {
      localStorage.setItem('summoner', name);
      this.dep.changed();
    }
  }
  unset () {
    if (localStorage.getItem('summoner')) {
      localStorage.removeItem('summoner');
      this.dep.changed();
      return true;
    }
  }
  // if we remove the summoner name from localStorage and then disconnect-reconnect to the server
  // the summoner can see the chat but can not participate until reselect his name
  close () {
    if (this.unset()) {
      Meteor.disconnect();
      Meteor.reconnect();
    }
  }
  join (summonerName) {
    const partyId = FlowRouter.getParam('_id');
    if (!partyId) return;

    Meteor.call('parties.join', {partyId, summonerName}, (error) => {
      if (error) {
        console.log(error);
        this.unset();
      } else {
        this.set(summonerName);
      }
    });
  }
  party (fields = {}) {
    const partyId = FlowRouter.getParam('_id');
    return Parties.findOne({_id: partyId}, {fields}) || {};
  }
}

export default new summoner();