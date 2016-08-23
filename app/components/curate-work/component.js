import Ember from 'ember';
import ENV from '../../config/environment';

export default Ember.Component.extend({
    curate: false,
    store: Ember.inject.service(),
    session: Ember.inject.service(),
    classNames: ['curate-work'],
    changes: null,
    submitting: false,

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

    changed: Ember.computed('changes', 'relations.[]', 'toMerge.[]', function() {
        let self = this;
        return this.get('relations.length') > 0 ||
            this.get('toMerge.length') > 0 ||
            Ember.isPresent(Object.keys(this.get('changes')).map(function(key) {
                if (key !== '@id' && key !== '@type') {
                    return self.get(`changes.${key}`);
                } else {
                    return '';
                }
            }).filter(Ember.isPresent));
    }),

    merges: Ember.computed('toMerge.[]', function() {
        if (this.get('toMerge.length') < 1) { return []; }

        return [{
            '@id': `_:${Math.random().toString().substring(2)}`,
            '@type': 'MergeAction',
            into: { '@id': this.get('work.id'), '@type': this.get('work._internalModel.modelName') },
            from: this.get('toMerge').map(obj => ({ '@id': obj.get('id'), '@type': obj.get('_internalModel.modelName') })),
        }];
    }),

    disableSubmit: Ember.computed('submitting', 'changed', function() {
        return this.get('submitting') || !this.get('changed');
    }),

    actions: {
        merge(obj) {
            this.get('toMerge').addObject(obj);
        },

        fieldChanged(field, newValue) {
            this.propertyDidChange('changed');
            return this.set(`changes.${field}`, newValue);
        },

        listChanged(field, modelType, addedItems) {
            let throughModels = addedItems.map(item => ({
                '@id': `_:${Math.random().toString().substring(2)}`,
                '@type': this.get('throughMap')[modelType],
                [modelType]: { '@id': item['@id'], '@type': item['@type'] },
                creative_work: { '@id': this.get('work.id'), '@type': this.get('work._internalModel.modelName') },
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
            this.set('submitting', true);
            let changes = {
                normalized_data: {
                    '@graph': this.get('relations')
                        .concat(this.get('changes'))
                        .concat(this.get('merges'))
                        .filter(obj => Object.keys(obj).length > 1)
                }
            };

            Ember.$.ajax({
                method: 'POST',
                headers: {
                    'X-CSRFTOKEN': this.get('session.data.authenticated.csrfToken')
                },
                xhrFields: {
                    withCredentials: true,
                },
                data: JSON.stringify(changes),
                contentType: 'application/json',
                url: `${ENV.apiUrl}/api/normalizeddata/`,
            }).done(function(resp) {
                console.log(resp);
                this.set('toMerge', []);
                this.set('relations', []);
                this.set('submitting', false);
            }).fail(function(resp) {
                console.log(resp);
                this.set('submitting', false);
            });
        },

        toggleExtraData() {
            this.toggleProperty('showExtraData');
        },

        toggleChanges() {
            this.toggleProperty('showChanges');
        },

        toggleRawData() {
            this.toggleProperty('showRawData');
        },
    }
});
