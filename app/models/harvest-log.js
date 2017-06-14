import DS from 'ember-data';
import Model from 'ember-data/model';
import { belongsTo } from 'ember-data/relationships';


const {
	attr,
} = DS;

export default Model.extend({
	source_Config: DS.belongsTo('source-config', {async: true}),

	status: attr('string'),
  context: attr('string'),
  completions: attr('string'),
	date_Started: attr('string'),
	end_Date: attr('string'),
  start_Date: attr('string'),
  harvester_Version: attr('string')
});
