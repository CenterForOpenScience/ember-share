import Ember from 'ember';
//import page_query from '../../utils/graphql';
import { PAGE_FRAGMENT_MAP } from '../../utils/mappings';

export default Ember.Component.extend({
    store: Ember.inject.service(),

    offset: 0,
    pageSize: 10,

    showPageControls: Ember.computed('model.totalRelatedWorks', 'pageSize', function() {
        return this.get('model.totalRelatedWorks') > this.get('pageSize');
    }),

    actions: {
        getPage: function(newOffset) {
            const model = this.get('model');
            const adapter = this.get('store').adapterFor('application');
            // TODO consolidate graphql queries in utils or a service or something
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
                if (data.errors) throw Error(data.errors[0].message);
                this.setProperties({
                    'model.relatedWorks': data.data.shareObject.relatedWorks,
                    'offset': newOffset
                });
            });
        }
    }
});
