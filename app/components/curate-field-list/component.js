import Ember from 'ember';
import ENV from '../../config/environment';

export default Ember.Component.extend({
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
            this.sendAction('onChange', added, removed);
        },

        remove(item) {
            let list = this.get('list');
            let added = this.get('added');
            let removed = this.get('removed');
            if (list.contains(item)) {
                removed.addObject(item);
            } else {
                added.removeObject(item);
            }
            this.sendAction('onChange', added, removed);
        },

        cancel() {
            this.get('added').clear();
            this.get('removed').clear();
            this.set('edit', false);
        },

        edit() {
            this.set('edit', true);
        },

        changeFilter(filter) {
            var type = this.get('itemType');
            var item = {};

            // TODO: make these models
            if (type === 'person') {
                var name = filter._source.text;
                item = {
                    'person': {
                        'givenName': name.substr(0, name.indexOf(' ')),
                        'familyName': name.substr(name.indexOf(' ') + 1)
                    }
                };
            } else {
                item = {
                    'name': filter._source.text
                };
            }


            this.send('add', item);
        },

        elasticSearch(term) {
            if (Ember.isBlank(term)) { return []; }
            var type = this.get('itemType');
            var data = JSON.stringify({
                'filter': {'match': {'@type': type}},
                'query': {
                    'match': {'text': term}
                }
            });

            const url = ENV.apiUrl + '/api/search/autocomplete/_search';
            return Ember.$.ajax({
                'url': url,
                'crossDomain': true,
                'type': 'POST',
                'contentType': 'application/json',
                'data': data
            }).then(function(json) {
                return json.hits.hits;
            });
        }
    }
});
