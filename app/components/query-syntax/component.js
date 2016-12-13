import Ember from 'ember';
import ENV from '../../config/environment';

export default Ember.Component.extend({
    init() {
        this._super(...arguments);
        Ember.$.ajax({
            url: ENV.apiUrl + '/search/_mappings/creativeworks',
            contentType: 'application/json',
        }).then((json) => {
            // TODO handle nested fields, like `lists`
            this.set('fields', Object.keys(json.share.mappings.creativeworks.properties).sort());
        });
    }
});
