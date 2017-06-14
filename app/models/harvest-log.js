import DS from 'ember-data';
import Model from 'ember-data/model';

const {
	attr,
	belongsTo,
	hasMany,
} = DS;

export default Model.extend({
	source_Config: belongsTo('source-config'),

	status: attr('number'),
	//source_config: ('harvest-log', {async: true}),
});
