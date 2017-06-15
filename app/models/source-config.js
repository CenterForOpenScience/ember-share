import DS from 'ember-data';
import Model from 'ember-data/model';
import { hasMany } from 'ember-data/relationships';

export default Model.extend({

	harvestLog: DS.hasMany('harvest-log', {async: true}),
});
