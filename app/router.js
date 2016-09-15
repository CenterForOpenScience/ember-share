import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
    location: config.locationType,
    metrics: Ember.inject.service(),

    didTransition() {
        this._super(...arguments);
        this._trackPage();
    },

    _trackPage() {
        Ember.run.scheduleOnce('afterRender', this, () => {
            const page = document.location.pathname;
            const title = this.getWithDefault('currentRouteName', 'unknown');

            this.get('metrics').trackPage({ page, title });
        });
    }
});

Router.map(function() {
    this.route('curate', function() {
        this.route('person', { path: '/person/:person_id' });
        this.route('work', { path: '/:work_type/:work_id' });
    });
    this.route('changes');
    this.route('discover');
    this.route('profile');
    this.route('support');
    this.route('settings');
    this.route('sources');

    this.route('notfound', { path: '/*path' });
});

export default Router;
