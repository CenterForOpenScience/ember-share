import Component from '@ember/component';

import { task } from 'ember-concurrency';

import ENV from '../../config/environment';


export default Component.extend({
    showFields: false,

    didReceiveAttrs() {
        this.get('getMappings').perform();
    },

    actions: {
        toggleFields() {
            this.toggleProperty('showFields');
        },
    },

    getMappings: task(function* () {
        const response = yield $.ajax({
            url: `${ENV.apiUrl}/search/_mappings/creativeworks`,
            contentType: 'application/json',
        });

        const properties = response.share.mappings.creativeworks.properties;
        const fields = [];
        for (const name of Object.keys(properties)) {
            const type = properties[name].type;
            if (type) {
                fields.pushObject({ name, type: properties[name].type });
            }
        }
        this.set('fields', fields.sortBy('name'));
    }),
});
