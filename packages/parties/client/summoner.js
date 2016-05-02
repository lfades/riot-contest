import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { FlowRouter } from 'meteor/kadira:flow-router';

class summoner {
  constructor () {
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
  close () {
    if (this.unset()) {
      Meteor.disconnect();
      Meteor.reconnect();
    }
  }
  join (summonerName) {
    const partyId = FlowRouter.getParam('_id');
    
    Meteor.call('parties.join', {partyId, summonerName}, (error) => {
      if (error) {
        console.log(error);
        this.unset();
      } else {
        this.set(summonerName);
      }
    });
  }
}

export default new summoner();