import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
    location: config.locationType
});

Router.map(function() {
  this.route('curate', function() {
      this.route('person', { path: '/person/:person_id' });
      this.route('work', { path: '/:work_type/:work_id' });
  });
  this.route('changes');
  this.route('discover');
  this.route('login');
  this.route('profile');
  this.route('support');
  this.route('settings');
});

export default Router;
