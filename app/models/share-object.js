import Model from 'ember-data/model';
// import attr from 'ember-data/attr';
// import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
    id: DS.attr('string'),
    version: DS.attr('string'),
    objects: null //what is even this?
});
