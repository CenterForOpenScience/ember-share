import DS from 'ember-data';

export default DS.Model.extend({
    // TODO add source model
    source: DS.attr(),
    appLabel: DS.attr('string'),
    providerDocId: DS.attr('string'),
    datum: DS.attr('string'),
    sha256: DS.attr('string'),
    dateSeen: DS.attr('date'),
    dateHarvested: DS.attr('date'),
});
