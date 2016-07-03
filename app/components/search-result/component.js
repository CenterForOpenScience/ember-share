import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
    layout,
    abbreviation: Ember.computed('params.[]', function(){
        let desc = this.get('obj.description');
        return desc && desc.length > 350 ? desc.substring(0, 350) + '...' : desc
    }),
    actions: {
        addFilter(filter) {
            this.sendAction('addFilter', filter);
        }
    }
});
