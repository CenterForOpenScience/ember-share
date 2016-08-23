import Ember from 'ember';
import DS from 'ember-data';
import ENV from '../config/environment';

export default DS.RESTAdapter.extend(DS.BuildURLMixin, {
    namespace: 'api',
    host: ENV.apiUrl,
    headers: {
        Accept: 'application/json'
    },
    ajax(url, method, hash) {
        hash = hash || {};
        hash.crossDomain = true;
        hash.xhrFields = { withCredentials: true };
        return this._super(url, method, hash);
    },
    pathForType(type) {
        var inflector = new Ember.Inflector(Ember.Inflector.defaultRules);
        return Ember.String.underscore(inflector.pluralize(type));
    }
});
