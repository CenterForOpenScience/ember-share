import DS from 'ember-data';
import Model from 'ember-data/model';

const{
	attr,
}= DS;

export default DS.Model.extend({
	long_Title: attr('string')
});
