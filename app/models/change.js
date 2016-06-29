import DS from 'ember-data';

export default DS.Model.extend({
    change: DS.attr(),
    '@id': DS.attr(),
    type: DS.attr('number'), // 0:create, 1:merge, 2:update
    status: DS.attr('number'), // 0:pending, 1:accepted, 2:rejected

    // TODO Are these six just two attributes, `target` and `target_version`?
    //
    //target_id
    //target_type
    //target (target_id, target_type)
    //
    //target_version_id
    //target_version_type
    //target_version (target_version_id, target_version_type)

    changeSet: DS.belongsTo('change-set')
});
