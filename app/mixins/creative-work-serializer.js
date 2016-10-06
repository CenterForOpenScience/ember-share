import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Mixin.create(DS.EmbeddedRecordsMixin, {
    attrs: {
        tags: { deserialize: 'records' },
        subject: { deserialize: 'records' },
        contributors: { deserialize: 'records' },
        links: { deserialize: 'records' }
    },

    extractRelationships(modelClass, resourceHash) {
        let relationships = this._super(...arguments);
        let modelName = modelClass.modelName;
        let url = this.store.adapterFor(modelName).buildURL(modelName, resourceHash.id);
        // Ideally these links would be provided by the API in a 'links'
        // property, but there's already a 'links' property that means
        // something else and this is easier than rewriting JSONSerializer
        relationships.rawData = { links: { related: url + '/rawdata/' } };
        relationships.changes = { links: { related: url + '/changes/' } };
        relationships.versions = { links: { related: url + '/versions/' } };
        return relationships;
    }
});
