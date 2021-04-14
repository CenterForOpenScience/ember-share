import { computed } from '@ember/object';
import DS from 'ember-data';
import formatXML from 'xml-formatter';

const { Model, attr, belongsTo } = DS;

export default Model.extend({
    recordFormat: attr('string'),
    dateModified: attr('string'),
    formattedMetadata: attr('string'),
    suid: belongsTo('suid'),

    hasXML: computed('formattedMetadata', function() {
        const formatted = this.get('formattedMetadata');
        return Boolean(formatted && formatted[0] === '<');
    }),

    formattedMetadataJSON: computed('formattedMetadata', function() {
        const formatted = this.get('formattedMetadata');
        return formatted ? JSON.parse(formatted) : '';
    }),

    formattedMetadataXML: computed('formattedMetadata', function() {
        const formatted = this.get('formattedMetadata');
        return formatted ? formatXML(formatted) : '';
    }),
});
