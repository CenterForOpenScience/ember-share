import Ember from 'ember';
import DetailMixin from '../mixins/detail';
import { RELATION_MAP } from '../utils/mappings';

const SECTIONS = [
    { title: 'Contributors', value: 'contributors', component: 'section-related-agents' },
    { title: 'Published By', value: 'publishers', component: 'section-related-agents' },
    { title: 'Tags', value: 'model.tags', component: 'section-tags' },
    { title: 'See Also', value: 'links', component: 'section-links' },
    { title: 'Collected From', value: 'model.sources', component: 'section-sources' },
];

export default Ember.Controller.extend(DetailMixin, {
    sections: SECTIONS,

    contributors: Ember.computed('model.relatedAgents', function() {
        return this.get('model.relatedAgents').filter(relation => RELATION_MAP[relation.type] === 'contributor');
    }),

    publishers: Ember.computed('model.relatedAgents', function() {
        return this.get('model.relatedAgents').filter(relation => RELATION_MAP[relation.type] === 'publisher');
    }),
});
