import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Mixin.create({
    title: DS.attr('string'),
    description: DS.attr('string'),
    contributors: DS.hasMany('contributors'),
    institutions: DS.hasMany('institutions'),
    venues: DS.hasMany('venues'),
    funders: DS.hasMany('funders'),
    awards: DS.hasMany('awards'),
    dataProviders: DS.hasMany('data-providers'),
    providerLink: DS.attr('string'),
    subject: DS.belongsTo('tag'),
    doi: DS.attr('string'),
    isbn: DS.attr('string'),
    tags: DS.hasMany('tags'),
    workType: DS.attr('string'),
    created: DS.attr('date'),
    published: DS.attr('date'),
    freeToReadType: DS.attr('string'),
    freeToReadDate: DS.attr('date'),
    license: DS.attr('string')
});
