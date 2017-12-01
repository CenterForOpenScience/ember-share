import Controller from '@ember/controller';
import { computed } from '@ember/object';

import DetailMixin from '../mixins/detail';


const SECTIONS = [
    { title: 'Profiles', value: 'links', component: 'section-links' },
    { title: 'Events', value: 'model.relatedWorks', component: 'section-related-works' },
    { title: 'Affiliations', value: 'outgoingAffiliations', component: 'section-related-agents' },
    { title: 'Collected From', value: 'model.sources', component: 'section-sources' },
];

export default Controller.extend(DetailMixin, {
    sections: SECTIONS,
    avatar: computed('model.identifiers.[]', function() {
        return this.get('model.identifiers').find(identifier => identifier.host.endsWith('gravatar.com') || /\.(png|jpe?g|gif)/i.test(identifier.uri));
    }),
    issns: computed('model.identifiers.[]', function() {
        return this.get('model.identifiers')
            .filter(identifier => identifier.scheme === 'urn' && identifier.host === 'issn')
            .map(identifier => identifier.uri.split('/').slice(-1)[0])
            .join(', ');
    }),

    incomingAffiliations: computed('model.incomingAgentRelations', function() {
        return this.get('model.incomingAgentRelations').map(relation => relation.subject);
    }),

    outgoingAffiliations: computed('model.outgoingAgentRelations', function() {
        return this.get('model.outgoingAgentRelations').map(relation => relation.related);
    }),
});
