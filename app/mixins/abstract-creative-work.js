import Ember from 'ember';
import DS from 'ember-data';
import ShareObjectMixin from './share-object';

export default Ember.Mixin.create(ShareObjectMixin, {
    title: DS.attr('string'),
    description: DS.attr('string'),

    contributors: DS.hasMany('contributor'),

    awards: DS.hasMany('award'),
    venues: DS.hasMany('venue'),

    links: DS.hasMany('link'),

    funders: DS.hasMany('funder'),
    publishers: DS.hasMany('publisher'),
    institutions: DS.hasMany('institution'),

    subject: DS.belongsTo('tag'),
    tags: DS.hasMany('tags'),
    created: DS.attr('date'),
    published: DS.attr('date'),
    freeToReadType: DS.attr('string'),
    freeToReadDate: DS.attr('date'),

    rights: DS.attr('string'),
    language: DS.attr('string'),

    changes: DS.hasMany('change'),
    rawData: DS.hasMany('raw-datum'),
    //versions: DS.hasMany(),
});
