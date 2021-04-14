import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import RouteHistoryMixin from 'ember-route-history/mixins/routes/route-history';

import { FRAGMENT_MAP, CONTROLLER_MAP } from '../utils/mappings';
import ENV from '../config/environment';


export default Route.extend(RouteHistoryMixin, {
    session: service(),

    async model(params) {
        // the id might refer to a suid (which should be loaded via ember-data)
        // or to a ShareObject (until those are removed)
        try {
            const suid = await this.store.findRecord('suid', params.id, {
                include: 'sourceConfig,formattedmetadatarecordSet',
            });
            return suid;
        } catch (err) {
            // pass -- for now, assume it's a ShareObject id
        }

        const graphqlResult = await $.ajax({
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
                    shareObject(id: "${params.id}") {
                        id,
                        type: __typename,
                        types,
                        extra,
                        sources { id, title, icon },

                        ${Object.keys(FRAGMENT_MAP).map(type => `...on ${type} ${FRAGMENT_MAP[type]}`).join('\n')}
                    }
                }`,
            },
        });
        return this._handleErrors(graphqlResult);
    },

    afterModel(model, transition) {
        if (!model) {
            // If the model could not be loaded. Do nothing.
            return;
        }

        // If the type slug /:SLUG/:SHARE-ID is not the type of the object
        // Correct the url
        const slug = model.type ? model.type.classify().toLowerCase() : model.constructor.modelName;
        if (slug !== transition.params.detail.type) {
            return this.replaceWith('detail', slug, model.id);
        }
    },

    actions: {
        error() {
            return this.intermediateTransitionTo('notfound');
        },
    },

    setup(model, transition) {
        if (!model) {
            // If the model could not be loaded. Do nothing.
            return this._super(model, transition);
        }

        const types = model.types || [model.constructor.modelName];

        // Find the most specific template available for the found type
        let view = null;
        for (let i = 0; i < types.length; i++) {
            view = CONTROLLER_MAP[types[i]];
            if (view) {
                break;
            }
        }

        this.set('templateName', view);
        this.set('controllerName', view);
        return this._super(model, transition);
    },

    _handleErrors(data) {
        if (data.errors) {
            throw Error(data.errors[0].message);
        }
        return data.data.shareObject;
    },
});
