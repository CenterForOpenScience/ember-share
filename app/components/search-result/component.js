import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
    layout,
    abbreviate: Ember.computed('params.[]', function(){
        let desc = this.get('obj.description');
        return desc.length > 350 ? desc.substring(0, 350) + '...' : desc
    }),
});
