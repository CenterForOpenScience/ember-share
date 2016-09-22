import Ember from 'ember';

export default Ember.Controller.extend({

    metrics: Ember.inject.service(),
    store: Ember.inject.service(),

    actions: {
        submit() {
            this.send('saveRegistrationModel', this.get('model'));
        }
    }

});
