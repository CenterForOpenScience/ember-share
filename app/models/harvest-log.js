import DS from 'ember-data';
import Model from 'ember-data/model';

export default Model.extend({
	sourceConfig: DS.belongsTo('source-config', {async: true}),

	status: DS.attr('string'),
  	context: DS.attr('string'),
  	completions: DS.attr('string'),
	dateStarted: DS.attr('string'),
	endDate: DS.attr('string'),
  	startDate: DS.attr('string'),
  	harvesterVersion: DS.attr('string'),
});
