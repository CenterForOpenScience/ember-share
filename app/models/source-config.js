import DS from 'ember-data';
import Model from 'ember-data/model';
import { hasMany } from 'ember-data/relationships';


const {
	attr,
} = DS;

export default Model.extend({

	harvester: DS.hasMany('harvest-log', {async: true}),

	label: attr('string'),
  base_Url: attr('string'),
  version: attr('string')
});
