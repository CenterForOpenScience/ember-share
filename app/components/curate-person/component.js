import Ember from 'ember';
import ENV from '../../config/environment';

export default Ember.Component.extend({
    // TODO: remove when curation is enabled on production
    curationEnabled: ENV.curationEnabled,

    session: Ember.inject.service(),
    classNames: ['curate-person'],

    init() {
        let ret = this._super(...arguments);
        this.set('changes', Ember.A());
        this.set('toMerge', Ember.A());
        this.set('relations', Ember.A());
        return ret;
    },

    toMerge: null,
    relations: null,
    changes: null,

    merges: function() {
        if (this.get('toMerge.length') < 1) { return []; }

        return [{
            '@id': `_:${Math.random().toString().substring(2)}`,
            '@type': 'MergeAction',
            into: { '@id': this.get('person.id'), '@type': 'person' },
            from: this.get('toMerge').map(obj => ({ '@id': obj.get('id'), '@type': 'person' })),
        }];
    }.property('toMerge.[]'),

    changed: function() {
        return this.get('relations.length') > 0 ||
            this.get('toMerge.length') > 0 ||
            Ember.isPresent(Object.keys(this.get('changes')).map(key => this.get(`changes.${key}`)).filter(Ember.isPresent));
    }.property('changes', 'relations.[]', 'toMerge.[]'),

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
                '@type': 'affiliation', //TODO change when other list fields can be modified
                [modelType]: { '@id': item['@id'], '@type': item['@type'] },
                person: { '@id': this.get('person.id'), '@type': 'person' },
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
                url: `${ENV.apiUrl}/normalizeddata/`,
            }).then(resp => console.log(resp));
        },
        curateToggle() {
            this.set('curate', !this.get('curate'));
        }
    }
});
