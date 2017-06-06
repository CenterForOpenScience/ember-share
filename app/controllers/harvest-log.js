import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Controller.extend({

    metrics: Ember.inject.service(),

    harvests: [],

    init() {
        this._super(...arguments);
        this.loadPage();
    },

    loadPage(url=null) {
        url = url || ENV.apiUrl + '/harvest/';
        this.set('loading', true);
        return Ember.$.ajax({
            url: url,
            crossDomain: true,
            type: 'GET',
            contentType: 'application/json',
        }).then((json) => {
            this.set('numberOfharvests', json.meta.pagination.count);
            this.get('harvests').addObjects(json.data);

            if (json.links.next) {
                return this.loadPage(json.links.next);
            }
            Ember.run(() => {
                this.set('loading', false);
            });
        });
    }
 });
