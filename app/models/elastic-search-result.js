import DS from 'ember-data';
// import attr from 'ember-data/attr';
// import { belongsTo, hasMany } from 'ember-data/relationships';

export default DS.Model.extend({
    title: DS.attr('string'),
    description: DS.attr('string'),
    contributors: DS.attr(),
    tags: DS.attr()

});
