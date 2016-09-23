import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        return this.store.createRecord('registration', { directSource: false });
    },
    actions: {
        saveRegistrationModel(model) {
            var registration = model;
            var _this = this;

            if (registration.validate()) {
                registration.save().then(
                    function() {
                        console.log('Registration saved.');
                        _this.transitionTo('registration.confirmation');
                    },
                    function(error) {
                        console.log('There was a problem saving the registration...');
                        console.log(error);
                    }
                );
            } else {
                registration.get('errors');
            }
        },
        checkRegistrations() {
            // use current user to get form count and then transition to different page if so
            return true;
        }
    }
});
