import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Mixin.create({
    title: DS.attr('string'),
    description: DS.attr('string'),
    contributors: DS.hasMany('contributor'),
    institutions: DS.hasMany('through-institution'),
    venues: DS.hasMany('through-venue'),
    funders: DS.hasMany('through-funder'),
    awards: DS.hasMany('through-award'),
    dataProviders: DS.hasMany('through-data-provider'),
    providerLink: DS.attr('string'),
    subject: DS.belongsTo('tag'),
    doi: DS.attr('string'),
    isbn: DS.attr('string'),
    tags: DS.hasMany('through-tag'),
    workType: DS.attr('string'),
    created: DS.attr('date'),
    published: DS.attr('date'),
    freeToReadType: DS.attr('string'),
    freeToReadDate: DS.attr('date'),
    license: DS.attr('string')
});
