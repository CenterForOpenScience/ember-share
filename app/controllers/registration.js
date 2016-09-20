import Ember from 'ember';
import RegistrationValidations from '../validations/registration';

export default Ember.Controller.extend({

    metrics: Ember.inject.service(),
    store: Ember.inject.service(),
    RegistrationValidations,

    registration: Ember.computed(function() {
        return this.store.createRecord('registration', { directSource: false });
    }),

    actions: {
        submit() {
            this.get('registration').save();
        }
    }

});
