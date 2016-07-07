import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Mixin.create(DS.EmbeddedRecordsMixin, {
    attrs: {
        tags: { deserialize: 'records' },
        subject: { deserialize: 'records' },
        contributors: { deserialize: 'records' }
    }
});
