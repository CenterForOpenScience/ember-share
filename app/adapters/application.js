import DS from 'ember-data';
import JSONAPIAdapter from 'ember-data/adapters/json-api';
import ENV from '../config/environment';

export default DS.RESTAdapter.extend(DS.BuildURLMixin, {
    namespace: 'api',
    host: ENV.apiUrl,
    accessToken: 'APAPPAPAPPAP',
    headers: {
        Accept: 'application/json'
    },
    ajax(url, method, hash) {
        hash = hash || {};
        hash.crossDomain = true;
        hash.xhrFields = {withCredentials: true};
        return this._super(url, method, hash);
    }
});
