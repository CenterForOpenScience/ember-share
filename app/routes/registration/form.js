import Ember from 'ember';

const category = 'registration form';
const action = 'submit';

export default Ember.Route.extend({

    metrics: Ember.inject.service(),

    model() {
        return this.store.createRecord('registration', { directSource: false });
    },
    resetController(controller, isExiting) {
        if (isExiting) {
            controller.set('submitAgain', false);
            controller.set('dbErrors', null);
            controller.set('formErrors', null);
            controller.set('currentLocation', 0);
            this.model().rollbackAttributes();
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
                        const label = 'submit form successfully';
                        this.get('metrics').trackEvent({ category, action, label });

                        this.transitionTo('registration.confirmation');
                    },
                    (error) => {
                        this.get('controller').set('formErrors', null);

                        const label = 'submit form: db error';
                        this.get('metrics').trackEvent({ category, action, label });

                        console.log('There was a problem saving the registration...');
                        console.log(error);
                        this.get('controller').set('dbErrors', error);
                    }
                );
            } else {
                let formErrors = registration.get('errors.content');
                let humanFormErrors = formErrors.map(function(error) {
                    let spaceCamelCase = error.attribute.replace(/([A-Z])/g, ' $1');
                    return { attribute: spaceCamelCase.charAt(0).toUpperCase() + spaceCamelCase.slice(1), message: error.message };
                });

                const label = 'submit form: ' + formErrors.length + 'error(s)';
                this.get('metrics').trackEvent({ category, action, label });

                this.get('controller').set('formErrors', humanFormErrors);
            }
        }
    }
});
