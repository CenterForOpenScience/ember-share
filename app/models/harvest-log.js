import DS from 'ember-data';
import Model from 'ember-data/model';

const {
	attr
} = DS;

export default Model.extend({
	status: attr('string'),
  context: attr('string'),
  completions: attr('string'),
	end_Date: attr('string'),
  start_Date: attr('string'),
  harvester_Version: attr('string')
});
