import Ember from 'ember';
import DetailMixin from '../mixins/detail';

const SECTIONS = [
    { title: 'Profiles', value: 'links', component: 'section-links' },
    { title: 'Worked on', value: 'model.relatedWorks', component: 'section-related-works' },
    { title: 'Collected From', value: 'model.sources', component: 'section-sources' },
];

export default Ember.Controller.extend(DetailMixin, {
    sections: SECTIONS,
    avatar:  Ember.computed('model.identifiers.[]', function() {
        return this.get('model.identifiers').find(identifier => identifier.host.endsWith('gravatar.com') || /\.(png|jpe?g|gif)/i.test(identifier.uri));
    }),
    issns: Ember.computed('model.identifiers.[]', function() {
        return this.get('model.identifiers')
          .filter(identifier => identifier.scheme === 'urn' && identifier.host === 'issn')
          .map(identifier => identifier.uri.split('/').slice(-1)[0])
          .join(', ');
    })
});
