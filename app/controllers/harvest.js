import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Controller.extend({

    metrics: Ember.inject.service(),

    init() {
        this._super(...arguments);
        this.loadPage();
    },

    loadPage(url=null) {
        url = url || ENV.apiUrl + '/harvest';
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

    //  actions: {
    //     changeFilter(selected) {
    //         const category = 'sources';
    //         const action = 'filter';
    //         const label = selected;
     //
    //         this.get('metrics').trackEvent({ category, action, label });
     //
    //         this.transitionToRoute('discover', { queryParams: { sources: encodeParams(selected) } });
    //     },
     //
    //     elasticSearch(term) {
    //         if (Ember.isBlank(term)) { return []; }
     //
    //         const category = 'sources';
    //         const action = 'search';
    //         const label = term;
     //
    //         this.get('metrics').trackEvent({ category, action, label });
     //
    //         var data = JSON.stringify(this.buildTypeaheadQuery(term));
     //
    //         return Ember.$.ajax({
    //             url: this.typeaheadQueryUrl(),
    //             crossDomain: true,
    //             type: 'POST',
    //             contentType: 'application/json',
    //             data: data
    //         }).then(json =>
    //             this.handleTypeaheadResponse(json)
    //         );
        // }
    // }
});
