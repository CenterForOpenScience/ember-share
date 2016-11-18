import Ember from 'ember';
import { PAGE_FRAGMENT_MAP } from '../../utils/mappings';

export default Ember.Component.extend({
    store: Ember.inject.service(),

    offset: 0,
    pageSize: 10,

    page: Ember.computed('offset', 'pageSize', function() {
        return 1 + Math.floor(this.get('offset') / this.get('pageSize'));
    }),

    totalPages: Ember.computed('pageSize', 'model.totalRelatedWorks', function() {
        return Math.ceil(this.get('model.totalRelatedWorks') / this.get('pageSize'));
    }),

    showPageControls: Ember.computed.gt('totalPages', 1),

    actions: {
        nextPage: function() {
            const nextOffset = this.get('page') * this.get('pageSize');
            this.send('getPage', nextOffset);
        },

        prevPage: function() {
            const prevOffset = (this.get('page') - 2) * this.get('pageSize');
            this.send('getPage', prevOffset);
        },

        getPage: function(newOffset) {
            if (this.get('loadingPage')) {return;}
            this.set('loadingPage', true);

            const model = this.get('model');
            const adapter = this.get('store').adapterFor('application');
            // TODO consolidate graphql queries in a util or service or something
            adapter.ajax('/api/v2/graph/', 'POST', {
                data: {
                    variables: '',
                    query: `query {
                        shareObject(id: "${model.id}") {
                            ${Object.entries(PAGE_FRAGMENT_MAP).map(([type, fragments]) => `...on ${type} { ${fragments.relatedWorks(newOffset)} }`).join('\n')}
                        }
                    }`
                }
            }).then(data => {
                if (data.errors) {throw Error(data.errors[0].message);}
                this.setProperties({
                    loadingPage: false,
                    'model.relatedWorks': data.data.shareObject.relatedWorks,
                    offset: newOffset
                });
            });
        },
    }
});
