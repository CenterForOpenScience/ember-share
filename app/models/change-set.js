import DS from 'ember-data';

export default DS.Model.extend({
    submittedAt: DS.attr('date'),
    // TODO: user model?  
    submittedBy: DS.belongsTo('user')
});
