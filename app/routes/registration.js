import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        return this.store.createRecord('registration', { directSource: false });
    },
    actions: {
        saveRegistrationModel(model) {
            var registration = model;

            if (registration.validate()) {
                registration.save().then(
                    // Success
                    function() {
                        // Alert success
                        console.log('Registration saved.');
                    },

                    // Error handling
                    function(error) {
                        // Alert failure
                        console.log('There was a problem saving the registration...');
                        console.log(error);
                    }
                );
            } else {
                registration.get('errors');
            }
        },
    }
});
