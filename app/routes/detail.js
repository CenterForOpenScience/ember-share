import Ember from 'ember';
import { FRAGMENT_MAP, CONTROLLER_MAP } from '../utils/mappings';
import ENV from '../config/environment';

const NUM = 0xDEADBEEF;
const MOD = 10000000000;

export default Ember.Route.extend({
    getEncodedPk(pk, type) {
        const modelID = ENV.modelIDs[type] || ENV.modelIDs.creativework;
        const hexValue = ((pk * NUM) % MOD).toString(16);
        const encoded = `${String('000000000' + hexValue).slice(-9)}`;
        return `${modelID.toString(16)}${encoded.slice(0, 3)}-${encoded.slice(3, 6)}-${encoded.slice(6)}`;
    },
    model(params) {
        const pkRegex = /^[0-9]+$/;
        const pk = params.id.match(pkRegex);
        if (pk) {
            params.id = this.getEncodedPk(params.id, params.type);
            return this.transitionTo('detail', params.type, params.id);
        }
        let adapter = this.store.adapterFor('application');
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
            if (data.errors) { throw Error(data.errors[0].message); }
            return data.data.shareObject;
        });
    },
    actions: {
        error(error, transition) {
            console.error(error);
            return this.intermediateTransitionTo('notfound');
        }
    },
    setup(model, transition) {
        if (!model) { return this._super(model, transition); }  // If the model could not be loaded. Do nothing.

        // Find the most specific template available for the found type
        let view = null;
        for (let i = 0; i < model.types.length; i++) {
            if ((view = CONTROLLER_MAP[model.types[i]])) { break; }
        }

        this.set('templateName', view);
        this.set('controllerName', view);
        return this._super(model, transition);
    },
    afterModel(model, transition) {
        if (!model) { return; }  // If the model could not be loaded. Do nothing.

        // If the type slug /:SLUG/:SHARE-ID is not the type of the object
        // Correct the url
        let slug = model.type.classify().toLowerCase();
        if (slug !== transition.params.detail.type) {
            return this.transitionTo('detail', slug, model.id);
        }
    }
});
