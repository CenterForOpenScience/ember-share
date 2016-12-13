import Ember from 'ember';
import { FRAGMENT_MAP, CONTROLLER_MAP } from '../utils/mappings';
import RouteHistoryMixin from 'ember-route-history/mixins/routes/route-history';

export default Ember.Route.extend(RouteHistoryMixin, {
    model(params) {
        let adapter = this.store.adapterFor('graph');
        return adapter.ajax('/api/v2/graph/', 'POST', {
            data: {
                variables: '',
                query: `query {
                    shareObject(id: "${params.id}") {
                      id,
                      type: __typename,
                      types,
                      extra,
                      sources { id, title, favicon },

                      ${Object.keys(FRAGMENT_MAP).map((type) => `...on ${type} ${FRAGMENT_MAP[type]}`).join('\n')}
                  }
              }`
            }
        }).then(data => {
            if (data.errors) {
                throw Error(data.errors[0].message);
            }
            return data.data.shareObject;
        });
    },
    actions: {
        error(error) {
            console.error(error);
            return this.intermediateTransitionTo('notfound');
        }
    },
    setup(model, transition) {
        if (!model) {
            // If the model could not be loaded. Do nothing.
            return this._super(model, transition);
        }

        // Find the most specific template available for the found type
        let view = null;
        for (let i = 0; i < model.types.length; i++) {
            if ((view = CONTROLLER_MAP[model.types[i]])) {
                break;
            }
        }

        this.set('templateName', view);
        this.set('controllerName', view);
        return this._super(model, transition);
    },
    afterModel(model, transition) {
        if (!model) {
            // If the model could not be loaded. Do nothing.
            return;
        }

        // If the type slug /:SLUG/:SHARE-ID is not the type of the object
        // Correct the url
        let slug = model.type.classify().toLowerCase();
        if (slug !== transition.params.detail.type) {
            return this.transitionTo('detail', slug, model.id);
        }
    }
});
