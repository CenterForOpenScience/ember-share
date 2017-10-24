import DS from 'ember-data';

export default DS.Model.extend({
	
	type: DS.attr('string'), 
	graph: DS.attr('string'),

});
