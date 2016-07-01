import DS from 'ember-data';
import JSONAPIAdapter from 'ember-data/adapters/json-api';

export default JSONAPIAdapter.extend(DS.BuildURLMixin, {
    namespace: 'api'
});
