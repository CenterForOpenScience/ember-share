import Ember from 'ember';
import ENV from '../../config/environment';

export default Ember.Component.extend({
    curate: false,
    store: Ember.inject.service(),
    session: Ember.inject.service(),
    toast: Ember.inject.service(),
    classNames: ['curate-work'],
    changes: null,
    submitting: false,
    toastrOptions: {
        closeButton: false,
        debug: false,
        newestOnTop: false,
        progressBar: false,
        positionClass: 'toast-top-right',
        preventDuplicates: false,
        onclick: null,
        showDuration: '5000',
        hideDuration: '1000',
        timeOut: '5000',
        extendedTimeOut: '1000',
        showEasing: 'swing',
        hideEasing: 'linear',
        showMethod: 'fadeIn',
        hideMethod: 'fadeOut'
    },

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
        let _this = this;
        return this.get('relations.length') > 0 ||
            this.get('toMerge.length') > 0 ||
            Ember.isPresent(Object.keys(this.get('changes')).map(function(key) {
                if (key !== '@id' && key !== '@type') {
                    return _this.get(`changes.${key}`);
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

            let _this = this;

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
                _this.set('toMerge', []);
                _this.set('relations', []);
                _this.set('submitting', false);
                _this.set('changes', null);
                _this.set('changes', {
                    '@id': _this.get('work.id'),
                    '@type': _this.get('work._internalModel.modelName'),
                });
                _this.get('toast').success('View your submitted changes by clicking on "Changes" in the navbar.', 'Success', _this.get('toastrOptions'));
            }).fail(function() {
                _this.set('submitting', false);
                _this.get('toast').error('Changes not submitted.', 'Error', _this.get('toastrOptions'));
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
