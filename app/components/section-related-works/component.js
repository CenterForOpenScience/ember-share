import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

import { task, timeout } from 'ember-concurrency';

import ENV from '../../config/environment';
import { PAGE_FRAGMENT_MAP } from '../../utils/mappings';


const DEBOUNCE_MS = 250;


export default Component.extend({
    store: service(),

    offset: 0,
    pageSize: 10,

    showPageControls: computed.gt('totalPages', 1),

    page: computed('offset', 'pageSize', function() {
        return 1 + Math.floor(this.get('offset') / this.get('pageSize'));
    }),

    totalPages: computed('pageSize', 'model.totalRelatedWorks', function() {
        const maxPages = 1000;
        return Math.min(maxPages, Math.ceil(this.get('model.totalRelatedWorks') / this.get('pageSize')));
    }),


    loadPage: task(function* (newPage) {
        yield timeout(DEBOUNCE_MS);
        const offset = (newPage - 1) * this.get('pageSize');
        const model = this.get('model');

        // TODO consolidate graphql queries in a util or service or something (SHARE-1031)
        try {
            const data = yield $.ajax({
                url: `${ENV.apiBaseUrl}/api/v2/graph/`,
                method: 'POST',
                crossDomain: true,
                xhrFields: { withCredentials: true },
                headers: {
                    'X-CSRFTOKEN': this.get('session.data.authenticated.csrfToken'),
                },
                data: {
                    variables: '',
                    query: `query {
                        shareObject(id: "${model.id}") {
                            ...on AbstractAgent {
                                ${PAGE_FRAGMENT_MAP.AbstractAgent.relatedWorks(offset)}
                            }
                        }
                    }`,
                },
            });

            this.setProperties({
                offset,
                loadingPage: false,
                'model.relatedWorks': data.data.shareObject.relatedWorks,
            });
        } catch (e) {
            throw Error(e);
        }
    }).restartable(),
});
