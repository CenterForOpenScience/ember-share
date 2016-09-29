import Ember from 'ember';
import DS from 'ember-data';
import ENV from '../config/environment';

export default DS.RESTAdapter.extend(DS.BuildURLMixin, {
    session: Ember.inject.service(),
    namespace: 'api/v2',
    host: ENV.apiBaseUrl,
    headers: {
        Accept: 'application/json'
    },
    ajax(url, method, hash) {
        // add trailing slash
        url = url.replace(/([^\/])(\?|$)/, '$1/$2');

        hash = hash || {};
        hash.crossDomain = true;
        hash.xhrFields = { withCredentials: true };
        hash.headers = hash.headers || {};
        hash.headers['X-CSRFTOKEN'] = this.get('session.data.authenticated.csrfToken');
        return this._super(url, method, hash);
    },
    pathForType(type) {
        var inflector = new Ember.Inflector(Ember.Inflector.defaultRules);
        return Ember.String.underscore(inflector.pluralize(type));
    }
});
