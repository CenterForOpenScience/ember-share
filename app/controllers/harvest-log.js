import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Controller.extend({

    metrics: Ember.inject.service(),

    numberOfSources: 0,
    sources: [],
    numberOfEvents: 0,
    sourcesLastUpdated: Date().toString(),
    placeholder: 'Search aggregated sources',
    loading: true,
    source_selected: '',

    init() {
        this._super(...arguments);
        this.loadPage();
    },

    loadPage(url=null) {
        url = url || ENV.apiUrl + '/sources/?sort=long_title';
        this.set('loading', true);
        return Ember.$.ajax({
            url: url,
            crossDomain: true,
            type: 'GET',
            contentType: 'application/json',
        }).then((json) => {
            this.set('numberOfSources', json.meta.pagination.count);
            this.get('sources').addObjects(json.data);

            if (json.links.next) {
                return this.loadPage(json.links.next);
            }
            Ember.run(() => {
                this.set('loading', false);
            });
        });
    }
 });
