import Ember from 'ember';
import _ from 'lodash/lodash';

export default Ember.Component.extend({
    objects: [],

    segments: function() {
        return _.chunk(this.get('objects').toArray(), 4);
    }.property('objects.[]')
});
