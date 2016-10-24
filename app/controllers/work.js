import Ember from 'ember';

const RELATION_MAP = {
    Creator: 'contributor',
    Contributor: 'contributor',
    Publisher: 'publisher',
};

export default Ember.Controller.extend({
    contributors: Ember.computed('model.relatedAgents', function() {
        return this.get('model.relatedAgents').filter(relation => RELATION_MAP[relation.type] === 'contributor');
    }),

    publishers: Ember.computed('model.relatedAgents', function() {
        return this.get('model.relatedAgents').filter(relation => RELATION_MAP[relation.type] === 'publisher');
    }),
});
