import DS from 'ember-data';

const{
	attr,
	belongsTo,
	hasMany
}=DS;

export default DS.Model.extend({
	harvester: hasMany('harvest-log'),

	label: attr('string'),
	version: attr('number')
});
