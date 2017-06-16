import DS from 'ember-data';
const{
	attr,
	hasMany
}= DS

export default DS.Model.extend({
harvestLog: DS.hasMany('harvest-log', {async: true}),
});
