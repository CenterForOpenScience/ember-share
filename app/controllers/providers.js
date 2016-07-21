import Ember from 'ember';
import ENV from '../config/environment';
import buildElasticCall from '../utils/build-elastic-call';

export default Ember.Controller.extend({
    numberOfProviders: 0,
    providers: [],

    init() {
        //TODO Sort initial results on date_modified
        this._super(...arguments);
        this.loadPage();
        // this.set('debouncedLoadPage', _.debounce(this.loadPage.bind(this), 250));
    },
    loadPage(url=null) {
        url = url || ENV.apiUrl + '/api/providers/';
        this.set('loading', true);
        return Ember.$.ajax({
            'url': url,
            'crossDomain': true,
            'type': 'GET',
            'contentType': 'application/json',
        }).then((json) => {
            this.set('numberOfProviders', json.count);

            this.get('providers').addObjects(json.results);

            if (json.next) {
                return this.loadPage(json.next);
            }
            Ember.run(() => {
                this.set('loading', false);
            });
        });
    },
});
