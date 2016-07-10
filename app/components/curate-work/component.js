import Ember from 'ember';

export default Ember.Component.extend({
    curate: false,
    store: Ember.inject.service(),
    session: Ember.inject.service(),
    classNames: ['curate-work'],

    throughMap: {
      tag: 'throughtag',
      person: 'contributor',
    },

    init() {
        this._super(...arguments);
        this.set('changes', {});
        this.set('relations', []);
    },

    changes: null,
    previousChanges: Ember.computed('work', function() {
        //let id_ = this.get('work.id');
        //let type = this.get('work.type');
        // return this.get('store').query('change', {objectChanged: {
        //     id: id_,
        //     type: type
        // }});
    }),
    actions: {
        fieldChanged(field, newValue) {
            return this.set(`changes.${field}`, newValue);
        },

        listChanged(field, modelType, addedItems, removedItems) {
          let throughModels = addedItems.map(item => ({
            '@id': `_:${Math.random().toString().substring(2)}`,
            '@type': this.get('throughMap')[modelType],
            [modelType]: {'@id': item['@id'], '@type': item['@type']},
            'creative_work': {'@id': this.get('work.id'), '@type': this.get('work.type')},
          }));

          this.get('relations').addObjects(addedItems.concat(throughModels));

          this.set(`changes.${field}`, throughModels.map(item => ({
            '@id': item['@id'],
            '@type': item['@type'],
          })));
        },

        submitChanges() {
            let changes = {
              '@graph': this.get('relations').concat(this.get('changes'))
            };
            console.log(changes);
            //TODO submit changes
        },

        curateToggle() {
            this.set('curate', !this.get('curate'));
        }
    }
});
