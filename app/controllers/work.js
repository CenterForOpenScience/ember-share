import Ember from 'ember';
import DetailMixin from '../mixins/detail';
import { RELATION_MAP } from '../utils/mappings';

const SECTIONS = [
    { title: 'Contributors', value: 'relatedAgents.contributor', component: 'section-related-agents' },
    { title: 'Published By', value: 'relatedAgents.publisher', component: 'section-related-agents' },
    { title: 'Funders', value: 'relatedAgents.funder', component: 'section-related-agents' },
    { title: 'Hosts', value: 'relatedAgents.host', component: 'section-related-agents' },
    { title: 'Tags', value: 'model.tags', component: 'section-tags' },
    { title: 'External Links', value: 'links', component: 'section-links' },
    { title: 'Related Works', value: 'relatedWorks', component: 'section-work-related-works' },
    { title: 'Collected From', value: 'model.sources', component: 'section-sources' },
];

export default Ember.Controller.extend(DetailMixin, {
    sections: SECTIONS,

    relatedAgents: Ember.computed('model.relatedAgents', function() {
        const byType = {};
        this.get('model.relatedAgents').forEach((relation) => {
            const type = RELATION_MAP[relation.type];
            if (!byType[type]) {
                byType[type] = [];
            }
            byType[type].pushObject(relation.agent);
        });
        return byType;
    }),

    relatedWorks: Ember.computed('model.incomingWorkRelations', 'model.outgoingWorkRelations', function() {
        const incoming = this.get('model.incomingWorkRelations') || [];
        const outgoing = this.get('model.outgoingWorkRelations') || [];
        return incoming.concat(outgoing);
    }),

    retractions: Ember.computed.filterBy('model.incomingWorkRelations', 'type', 'Retracts'),
});
