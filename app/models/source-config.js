import DS from 'ember-data';
import Model from 'ember-data/model';
import { hasMany } from 'ember-data/relationships';

const{
	attr,
}= DS

export default Model.extend({
	harvestLog: DS.hasMany('harvest-log', {async: true}),

	label: attr('string'),
	base_url: attr('string'),

	recentHarvests: Ember.computed('id', function(){
		return this.store.query('harvest-log', { source_config_id: this.get('id')} );
	}),

});
