import Ember from 'ember';
import { inject as service } from '@ember/service';
import DS from 'ember-data';

import ENV from '../config/environment';

const { JSONAPIAdapter } = DS;


const ApplicationAdapter = JSONAPIAdapter.extend(DS.BuildURLMixin, {
    session: service(),
    namespace: 'api/v2',
    host: ENV.apiBaseUrl,
    headers: {
        Accept: 'application/vnd.api+json',
    },
    ajax(url, method, hash) {
        // add trailing slash
        const tmpUrl = url.replace(/([^/])(\?|$)/, '$1/$2');

        const tmpHash = hash || {};
        tmpHash.crossDomain = true;
        tmpHash.xhrFields = { withCredentials: true };
        tmpHash.headers = hash.headers || {};
        tmpHash.headers['X-CSRFTOKEN'] = this.get('session.data.authenticated.csrfToken');
        return this._super(tmpUrl, method, tmpHash);
    },
    pathForType(type) {
        const inflector = new Ember.Inflector(Ember.Inflector.defaultRules);
        return Ember.String.underscore(inflector.pluralize(type)).replace(/_/g, '');
    },
});

export default ApplicationAdapter;
