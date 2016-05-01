import { Mongo } from 'meteor/mongo';

export const Parties = new Mongo.Collection('parties');
export const Summoners = new Mongo.Collection('summoners');