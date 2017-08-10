import DS from 'ember-data';
import Model from 'ember-data/model';

const{
	attr,
}= DS;

export default Model.extend({
	harvestLog: DS.hasMany('harvest-log', {async: true}),

	label: attr('string'),
	base_url: attr('string'),
});
