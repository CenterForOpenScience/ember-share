import DS from 'ember-data';
import Model from 'ember-data/model';
import { belongsTo } from 'ember-data/relationships';


const {
	attr,
} = DS;

export default Model.extend({
	sourceConfig: DS.belongsTo('source-config', {async: true}),

	status: attr('string'),
  context: attr('string'),
  completions: attr('string'),
	dateStarted: attr('string'),
	endDate: attr('string'),
  startDate: attr('string'),
  harvesterVersion: attr('string'),
	
});
