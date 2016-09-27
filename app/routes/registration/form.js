import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        return this.store.createRecord('registration', { directSource: false });
    },
    resetController(controller, isExiting) {
        if (isExiting) {
            controller.set('submitAgain', false);
            controller.set('dbErrors', null);
        }
    },
    setupController(controller, model) {
        this._super(controller, model);
        controller.getRegistrations();
    },
    activate() {
        this._super();
        window.scrollTo(0, 0);
    },
    actions: {
        saveRegistrationModel(model) {
            let registration = model;

            if (registration.validate()) {
                registration.save().then(
                    () => {
                        this.transitionTo('registration.confirmation');
                    },
                    (error) => {
                        console.log('There was a problem saving the registration...');
                        console.log(error);
                        this.get('controller').set('dbErrors', error);
                    }
                );
            } else {
                registration.get('errors');
            }
        }
    }
});
