import Ember from 'ember';
import ENV from '../../config/environment';

export default Ember.Component.extend({
    // TODO: remove when login is enabled on production
    loginEnabled: ENV.loginEnabled,

    classNames: ['btn-group', 'list-item'],

    actions: {
        remove(item) {
            this.sendAction('remove', item);
        }
    }
});
