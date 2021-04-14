import DS from 'ember-data';

const { Model, attr, hasMany } = DS;

export default Model.extend({
    name: attr('string'),
    homePage: attr('string'),
    longTitle: attr('string'),
    icon: attr('string'),

    sourceConfigs: hasMany('source-config'),
});

