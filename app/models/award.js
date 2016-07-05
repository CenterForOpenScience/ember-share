import DS from 'ember-data';
import ShareObjectMixin from '../mixins/share-object';

export default DS.Model.extend(ShareObjectMixin, {
    award: DS.attr('string'),
    description: DS.attr('string'),
    url: DS.attr('string'),
});

