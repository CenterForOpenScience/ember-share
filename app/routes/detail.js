import Ember from 'ember';

const CONTROLLER_MAP = {
    Agent: 'agent',
    'Creative Work': 'work',
};

const FRAGMENTS = {
    AbstractCreativeWork: `{
      title,
      description,

      tags { name },
      identifiers { host, uri },

      relatedAgents {
        type: __typename,
        citedAs,
        agent { id, type: __typename, name }
      }
    }`
};

export default Ember.Route.extend({
    model(params) {
        let adapter = this.store.adapterFor('application');
        return adapter.ajax('/api/v2/graph/', 'POST', {
            data: {
                variables: '',
                query: `query {
                    shareObject(id: "${params.id}") {
                      id,
                      type: __typename,
                      types,
                      sources { id, title, favicon }

                      ${Object.keys(FRAGMENTS).map(key => `...on ${key} ${FRAGMENTS[key]}`).join('\n')}
                  }
              }`
            }
        }).then(data => {
            if (data.errors) throw Error(data.errors[0].message);
            return data.data.shareObject;
        });
    },
    actions: {
        error(error, transition) {
            return this.intermediateTransitionTo('notfound');
        }
    },
    setup(model, transition) {
        if (!model) return this._super(model, transition);  // If the model could not be loaded. Do nothing.

        let view = null;
        for (let i = model.types.length; i > -1; i--)
          if ((view = CONTROLLER_MAP[model.types[i]])) break;

        this.set('templateName', view);
        this.set('controllerName', view);
        return this._super(model, transition);
    },
    afterModel(model, transition) {
        if (!model) return;  // If the model could not be loaded. Do nothing.

        let slug = model.type.classify().toLowerCase();
        if (slug !== transition.params.detail.type)
            return this.transitionTo('detail', slug, model.id);
    }
});
