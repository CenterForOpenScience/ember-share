import DS from 'ember-data';

export default DS.Model.extend({
    status: DS.attr('number'),
    submittedAt: DS.attr('date'),
});
