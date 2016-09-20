import Ember from 'ember';

export default Ember.Controller.extend({

    metrics: Ember.inject.service(),
    store: Ember.inject.service(),

    actions: {
        submit() {
            this.send('saveFakeModel', this.get('model'));
        },

        validateField(field) {
            // on blur validate the current field
            return field;
        }
    }

});
