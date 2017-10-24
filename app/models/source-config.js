import DS from 'ember-data';
import Model from 'ember-data/model';


export default Model.extend({
	harvestLogs: DS.hasMany('harvest-log', {async: true}),

	label: DS.attr('string'),
	baseUrl: DS.attr('string'),
});
