import Ember from 'ember';
import ENV from '../../config/environment';

export default Ember.Component.extend({
    favicon: Ember.computed( function() {
        return ENV.apiUrl + '/static/' + this.get('provider').provider_name + '/img/favicon.ico';
    })
});
