import DS from 'ember-data';
import Model from 'ember-data/model';

<<<<<<< HEAD
const{
	attr,
}= DS;

export default DS.Model.extend({
	long_Title: attr('string')
=======

const {
	attr,
} = DS;

export default Model.extend({
	long_Title: attr('string'),
  name: attr('string'),
	home_Page: attr('string'),
	icon: attr('string')
>>>>>>> 02dea0918e56ac2c442a8aa2a65e9cf2ffed6abb
});
