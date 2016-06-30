import DS from 'ember-data';
import ShareObjectMixin from '../mixins/share-object';

export default DS.Model.extend(ShareObjectMixin, {
    url: DS.attr('string'),
    baseUrl: DS.attr('string')
});
