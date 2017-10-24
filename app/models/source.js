import DS from 'ember-data';
import Model from 'ember-data/model';


export default Model.extend({

	longTitle: DS.attr('string'),
  name: DS.attr('string'),
	homePage: DS.attr('string'),
	icon: DS.attr('string')
});
