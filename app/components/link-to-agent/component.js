import Component from '@ember/component';
import { computed } from '@ember/object';

const ICON_MAP = {
    Consortium: 'fa-users',
    Institution: 'fa-university',
    Organization: 'fa-building',
    Person: 'fa-user',
};

export default Component.extend({
    tagName: 'span',

    name: computed('agent.name', function() {
        return this.get('display') || this.get('agent.name');
    }),

    icon: computed('agent.type', function() {
        return ICON_MAP[this.get('agent.type')];
    }),

    gravatar: computed('agent.identifiers.[]', function() {
        return this.get('agent.identifiers').find(identifier => identifier.host === 'gravatar.com');
    }),

    slugType: computed('agent.type', function() {
        return this.get('agent.type').classify().toLowerCase();
    }),
});
