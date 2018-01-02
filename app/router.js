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
    this.route('discover');
    this.route('profile');
    this.route('sources');
    this.route('registration');

    this.route('detail', { path: '/:type/:id' });

    this.route('elastic-down');
    this.route('notfound', { path: '/*path' });
    this.route('notfound');
});

export default Router;
