import DS from 'ember-data';
import JSONAPIAdapter from 'ember-data/adapters/json-api';
import ENV from '../config/environment';

export default JSONAPIAdapter.extend(DS.BuildURLMixin, {
    namespace: 'api',
    host: ENV.apiUrl,
    accessToken: 'APAPPAPAPPAP',
});
