import Ember from 'ember';
import DS from 'ember-data';
import ENV from '../config/environment';

// matches query params or trailing slash
const TRAILING_SLASH_PATTERN = /(^.*?\?.*?|.*?[^\/]$)/;

export default DS.RESTAdapter.extend(DS.BuildURLMixin, {
    session: Ember.inject.service(),
    namespace: 'api/v2',
    host: ENV.apiBaseUrl,
    headers: {
        Accept: 'application/json'
    },
    ajax(url, method, hash) {
        // trailing slash required for POST requests
        if (method === 'POST') {
            let urlRegex = new RegExp(TRAILING_SLASH_PATTERN);
            if (url.match(urlRegex)) {
                url = url + '/';
            }
        }

        hash = hash || {};
        hash.crossDomain = true;
        hash.xhrFields = { withCredentials: true };
        hash.headers = { 'X-CSRFTOKEN': this.get('session.data.authenticated.csrfToken') };
        return this._super(url, method, hash);
    },
    pathForType(type) {
        var inflector = new Ember.Inflector(Ember.Inflector.defaultRules);
        return Ember.String.underscore(inflector.pluralize(type));
    }
});
