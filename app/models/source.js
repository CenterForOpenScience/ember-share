import DS from 'ember-data';
import Model from 'ember-data/model';


const {
	attr,
} = DS;

export default Model.extend({
	long_Title: attr('string'),
  name: attr('string'),
	home_Page: attr('string'),
	icon: attr('string')
});
