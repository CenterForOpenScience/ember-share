import DS from 'ember-data';

const { Model, attr, belongsTo, hasMany } = DS;

export default Model.extend({
    identifier: attr('string'),

    sourceConfig: belongsTo('source-config'),
    formattedmetadatarecordSet: hasMany('formatted-metadata-record'),
});
