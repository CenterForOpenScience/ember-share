import Ember from 'ember';
import ENV from '../../config/environment';

export default Ember.Component.extend({
    curate: false,
    store: Ember.inject.service(),
    session: Ember.inject.service(),
    classNames: ['curate-work'],
    changes: null,
    loadPlugin: function() {
    // Use run loop if you need to setup the DOM first
        Ember.run.scheduleOnce('afterRender', this, function() {
          Ember.$.getScript('https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML');
        });
    }.on('init'),
    throughMap: {
      tag: 'throughtags',
      person: 'contributor',
    },

    init() {
        this._super(...arguments);
        this.set('changes', {
          '@id': this.get('work.id'),
          '@type': this.get('work._internalModel.modelName'),
        });
        this.set('toMerge', []);
        this.set('relations', []);
    },

    changed: function() {
      return this.get('relations.length') > 0
        || this.get('toMerge.length') > 0
        || Ember.isPresent(Object.keys(this.get('changes')).map(key => this.get(`changes.${key}`)).filter(Ember.isPresent));
    }.property('changes', 'relations.[]', 'toMerge.[]'),

    merges: function() {
      if (this.get('toMerge.length') < 1) return [];

      return [{
        '@id': `_:${Math.random().toString().substring(2)}`,
        '@type': 'MergeAction',
        'into': {'@id': this.get('work.id'), '@type': this.get('work._internalModel.modelName')},
        'from': this.get('toMerge').map(obj => ({'@id': obj.get('id'), '@type': obj.get('_internalModel.modelName')})),
      }];
    }.property('toMerge.[]'),

    previousChanges: Ember.computed('work', function() {
        let id_ = this.get('work.id');
        let type = this.get('work.type') || this.get('work')._internalModel.modelName + 's';
        return this.get('store').query('change', {objectChanged: {
             id: id_,
             type: type
        }});
    }),
    actions: {
        merge(obj) {
            this.get('toMerge').addObject(obj);
        },

        fieldChanged(field, newValue) {
            this.propertyDidChange('changed');
            return this.set(`changes.${field}`, newValue);
        },

        listChanged(field, modelType, addedItems, removedItems) {
          let throughModels = addedItems.map(item => ({
            '@id': `_:${Math.random().toString().substring(2)}`,
            '@type': this.get('throughMap')[modelType],
            [modelType]: {'@id': item['@id'], '@type': item['@type']},
            'creative_work': {'@id': this.get('work.id'), '@type': this.get('work._internalModel.modelName')},
          }));

          this.get('relations').addObjects(addedItems.concat(throughModels));

          this.set(`changes.${field}`, throughModels.map(item => ({
            '@id': item['@id'],
            '@type': item['@type'],
          })));
        },

        submitChanges() {
            console.log(this.get('relations')
                  .concat(this.get('changes'))
                  .concat(this.get('merges')));
            let changes = {
              'normalized_data': {
                '@graph': this.get('relations')
                  .concat(this.get('changes'))
                  .concat(this.get('merges'))
                  .filter(obj => Object.keys(obj).length > 1)
              }
            };

            Ember.$.ajax({
              method: 'POST',
              headers: {
                'X-CSRFTOKEN': this.get('session.data.csrfToken')
              },
              xhrFields: {
                withCredentials: true,
              },
              data: JSON.stringify(changes),
              contentType: 'application/json',
              url: `${ENV.apiUrl}/api/normalizeddata/`,
            }).then(resp => console.log(resp));
        },

    }
});
