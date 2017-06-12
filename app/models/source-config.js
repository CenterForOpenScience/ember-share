import DS from 'ember-data';
import Model from 'ember-data/model';

const {
	attr,
} = DS;

export default Model.extend({
	label: attr('string'),
  base_Url: attr('string'),
  version: attr('string')
});
