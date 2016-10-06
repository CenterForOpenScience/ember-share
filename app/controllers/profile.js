import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Controller.extend({
    session: Ember.inject.service(),

    // TODO: remove when curation is enabled on production
    curationEnabled: ENV.curationEnabled,
});
