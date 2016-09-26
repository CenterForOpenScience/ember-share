import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        return this.store.createRecord('registration', { directSource: false });
    },
    resetController(controller, isExiting) {
        if (isExiting) {
            controller.set('submitAgain', false);
        }
    },
    actions: {
        saveRegistrationModel(model) {
            var registration = model;

            if (registration.validate()) {
                registration.save().then(
                    () => {
                        this.transitionTo('registration.confirmation');
                    },
                    (error) => {
                        console.log('There was a problem saving the registration...');
                        console.log(error);
                    }
                );
            } else {
                registration.get('errors');
            }
        }
    }
});
