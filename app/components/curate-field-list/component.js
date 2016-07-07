import Ember from 'ember';

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
        }
    }
});
