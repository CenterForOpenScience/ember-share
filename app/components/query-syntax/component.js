import Ember from 'ember';
import ENV from '../../config/environment';

export default Ember.Component.extend({
    showFields: false,

    init() {
        this._super(...arguments);
        Ember.$.ajax({
            url: ENV.apiUrl + '/search/_mappings/creativeworks',
            contentType: 'application/json',
        }).then((json) => {
            const properties = json.share.mappings.creativeworks.properties;
            const fields = [];
            for(const name in properties) {
                const type = properties[name].type;
                if (type) {
                    fields.pushObject({ name, type: properties[name].type});
                }
            }
            this.set('fields', fields.sortBy('name'));
        });
    },

    actions: {
        toggleFields() {
            this.toggleProperty('showFields');
        }
    }
});
