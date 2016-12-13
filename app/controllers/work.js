import Ember from 'ember';
import DetailMixin from '../mixins/detail';
import { RELATION_MAP } from '../utils/mappings';

const SECTIONS = [
    { title: 'Contributors', value: 'contributors', component: 'section-related-agents' },
    { title: 'Published By', value: 'publishers', component: 'section-related-agents' },
    { title: 'Tags', value: 'model.tags', component: 'section-tags' },
    { title: 'External Links', value: 'links', component: 'section-links' },
    { title: 'Related Works', value: 'relatedWorks', component: 'section-work-related-works' },
    { title: 'Collected From', value: 'model.sources', component: 'section-sources' },
];

export default Ember.Controller.extend(DetailMixin, {
    routeHistory: Ember.inject.service(),
    sections: SECTIONS,

    contributors: Ember.computed('model.relatedAgents', function() {
        return this.get('model.relatedAgents')
            .filter(relation => RELATION_MAP[relation.type] === 'contributor')
            .map(relation => relation.agent);
    }),

    publishers: Ember.computed('model.relatedAgents', function() {
        return this.get('model.relatedAgents')
            .filter(relation => RELATION_MAP[relation.type] === 'publisher')
            .map(relation => relation.agent);
    }),

    relatedWorks: Ember.computed('model.incomingWorkRelations', 'model.outgoingWorkRelations', function() {
        const incoming = this.get('model.incomingWorkRelations') || [];
        const outgoing = this.get('model.outgoingWorkRelations') || [];
        return incoming.concat(outgoing);
    }),

    retractions: Ember.computed.filterBy('model.incomingWorkRelations', 'type', 'Retracts'),

    actions: {
        goBack() {
            const previousRouteName = this.get('routeHistory.previous');
            if (previousRouteName === 'discover' || previousRouteName === 'detail') {
                history.back();
            } else {
                this.transitionToRoute('discover');
            }
        }
    }
});
