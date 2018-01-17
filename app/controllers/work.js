import Ember from 'ember';
import Controller from '@ember/controller';
import { computed } from '@ember/object';

import DetailMixin from '../mixins/detail';
import { RELATION_MAP } from '../utils/mappings';
import ENV from '../config/environment';

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

export default Controller.extend(DetailMixin, {
    sections: SECTIONS,

    retractions: computed.filterBy('model.incomingWorkRelations', 'type', 'Retracts'),

    workType: computed('model.type', function() {
        if (this.get('model.type') === 'CreativeWork') {
            return ENV.creativeworkName;
        }
        return this.get('model.type');
    }),

    relatedAgents: computed('model.relatedAgents', function() {
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

    relatedWorks: computed('model.{incomingWorkRelations,outgoingWorkRelations}', function() {
        const incoming = this.get('model.incomingWorkRelations') || [];
        const outgoing = this.get('model.outgoingWorkRelations') || [];
        return incoming.concat(outgoing);
    }),

    safeDescription: computed('model.description', function() {
        return Ember.String.htmlSafe(this.get('model.description')).string;
    }),

    safeTitle: computed('model.title', function() {
        return Ember.String.htmlSafe(this.get('model.title')).string;
    }),
});
