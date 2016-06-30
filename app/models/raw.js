import DS from 'ember-data';
// import attr from 'ember-data/attr';
// import { belongsTo, hasMany } from 'ember-data/relationships';

export default DS.Model.extend({
    id: DS.attr('string'),
    source: DS.belongsTo('person'), // not sure what is here. ?
    data: DS.attr('string'), //zipfield?
    sha256: DS.attr('string'),
    dateSeen: DS.attr('date'), //
    dateHarvested: DS.attr('date'),
    objects: DS.attr('string') //RawDataManager??????
});
