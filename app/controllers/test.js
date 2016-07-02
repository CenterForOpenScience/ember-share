import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        search(query) {
            console.log(query)
            this.store.query('elastic-search-result', {}).then(responses => {
                this.set('searchData', responses);
            });
        },
    }
});
