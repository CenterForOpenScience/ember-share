import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        search() {
            this.store.findAll('elastic-search-result').then(responses => {
                this.set('searchData', responses);
            });
        },
    }
});
