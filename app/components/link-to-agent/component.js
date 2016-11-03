import Ember from 'ember';

const ICON_MAP = {
    Consortium: 'fa-users',
    Institution: 'fa-university',
    Organization: 'fa-building',
    Person: 'fa-user',
};

export default Ember.Component.extend({
    tagName: 'span',

    name: Ember.computed('agent.name', function() {
        return this.get('display') || this.get('agent.name');
    }),

    icon: Ember.computed('agent.type', function() {
        return ICON_MAP[this.get('agent.type')];
    }),

    gravatar: Ember.computed('agent.identifiers.[]', function() {
        return this.get('agent.identifiers').find(identifier => identifier.host === 'gravatar.com');
    }),

    slugType: Ember.computed('agent.type', function() {
        return this.get('agent.type').classify().toLowerCase();
    })

});
