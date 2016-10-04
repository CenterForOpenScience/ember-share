import Ember from 'ember';
import ENV from '../../config/environment';

export default Ember.Component.extend({
    // TODO: remove when curation is enabled on production
    curationEnabled: ENV.curationEnabled,

    classNames: ['curate-list'],

    init() {
        this._super(...arguments);
        this.set('added', Ember.A());
        this.set('removed', Ember.A());
    },

    added: null,
    removed: null,

    displayList: Ember.computed('list.[]', 'added.[]', 'removed.[]', function() {
        let display = Ember.A();
        display.addObjects(this.get('list'));
        display.addObjects(this.get('added'));
        display.removeObjects(this.get('removed'));
        return display;
    }),

    actions: {
        add(item) {
            let list = this.get('list');
            let added = this.get('added');
            let removed = this.get('removed');

            if (list.contains(item)) {
                removed.removeObject(item);
            } else {
                added.addObject(item);
            }

            this.sendAction(
                'onChange',
                this.get('itemType'),
                this.get('itemType') !== 'person' ? added : added.map(x => ({
                    '@type': 'person',
                    '@id': x.person['@id'],
                    given_name: x.person.givenName,
                    family_name: x.person.familyName,
                })),
                removed
            );
        },

        remove(item) {
            let list = this.get('list');
            let added = this.get('added');
            let removed = this.get('removed');

            if (list.contains(item)) {
                removed.addObject(item);
            } else {
                added.removeObject(item);   // TODO Make this not horrible
            }

            this.sendAction(
                'onChange',
                this.get('itemType'),
                this.get('itemType') === 'person' ? added : added.map(x => x.person),
                removed
            );
        },

        cancel() {
            this.set('edit', false);
            this.get('added').clear();
            this.get('removed').clear();
        },

        edit() {
            this.set('edit', true);
        },

        changeFilter(filter) {
            let item;

            // TODO: make these models
            if (this.get('itemType') === 'person') {
                var name = filter._source.text;
                item = {
                    person: {
                        '@type': 'person',
                        '@id': filter._source['@id'],
                        givenName: name.substr(0, name.indexOf(' ')),
                        familyName: name.substr(name.indexOf(' ') + 1),
                    }
                };
            } else {
                item = {
                    '@type': 'tag',
                    '@id': filter._source['@id'],
                    name: filter._source.text
                };
            }

            this.send('add', item);
        },

        elasticSearch(term) {
            if (Ember.isBlank(term)) { return []; }
            var type = this.get('itemType');
            var data = JSON.stringify({
                filter: { match: { '@type': type } },
                query: {
                    match: { text: term }
                }
            });

            const url = ENV.apiUrl + '/search/autocomplete/_search';
            return Ember.$.ajax({
                url: url,
                crossDomain: true,
                type: 'POST',
                contentType: 'application/json',
                data: data
            }).then(function(json) {
                return json.hits.hits;
            });
        }
    }
});
