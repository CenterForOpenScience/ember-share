import Ember from 'ember';

export default Ember.Component.extend({
    init() {
        this._super(...arguments);
    },

    topChoices: Ember.computed('facet.choices.[]', function() {
        return this.get('facet.choices').slice(0, 5);
    }),

    moreChoices: Ember.computed.gt('facet.choices.length', 5),

    selected: Ember.computed('query', function() {
        let query = this.get('query');
        if (query) {
            return query.get(this.get('key')) || Ember.A();
        } else {
            return Ember.A();
        }
    }),

    actions: {
        changeChecked(choice, checked) {
            let selected = this.get('selected');
            if (checked) {
                selected.addObject(choice.get('elasticFilter'));
            } else {
                selected.removeObject(choice.get('elasticFilter'));
            }
            this.sendAction('onChange', this.get('key'),
                            selected.length ? selected : undefined);
        },

        toggleModal() {
            this.$('.modal').modal('toggle');
        }
    }
});
