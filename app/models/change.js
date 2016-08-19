import DS from 'ember-data';

export default DS.Model.extend({
    change: DS.attr(),

    type: DS.attr('number'), // 0:create, 1:merge, 2:update
    //status: DS.attr('number'), // 0:pending, 1:accepted, 2:rejected

    target: DS.attr(), // { @id, @type }
    targetVersion: DS.attr(), // { @id, @type }

    //changeSet: DS.belongsTo('change-set')
});
