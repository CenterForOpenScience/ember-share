import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        return this.store.createRecord('registration', { directSource: false });
    },
    actions: {
        saveFakeModel(registration) {
            var fakeModel = registration;

            if (fakeModel.validate()) {
                fakeModel.save().then(
                    // Success
                    function() {
                        // Alert success
                        console.log('ooooh yeah we just saved the FakeModel...');
                    },

                    // Error handling
                    function(error) {
                        // Alert failure
                        console.log('There was a problem saving the FakeModel...');
                        console.log(error);
                    }
                );
            } else {
                fakeModel.get('errors');
            }
        },
    }
});
