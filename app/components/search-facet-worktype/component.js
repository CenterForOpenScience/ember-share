import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        change(type) {
            let key = this.get('key');
            let filter = null;
            if (type) {
                filter = {
                    term: {}
                };
                filter.term['@type'] = type;
            }
            this.sendAction('onChange', key, filter);
        }
    }
});
