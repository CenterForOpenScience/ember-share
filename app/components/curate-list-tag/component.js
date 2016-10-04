import Ember from 'ember';
import ENV from '../../config/environment';

export default Ember.Component.extend({
    // TODO: remove when curation is enabled on production
    curationEnabled: ENV.curationEnabled,

    classNames: ['btn-group', 'list-item'],

    actions: {
        remove(item) {
            this.sendAction('remove', item);
        }
    }
});
