import EmberRouter from '@ember/routing/router';
import { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';

import config from './config/environment';

const Router = EmberRouter.extend({
    location: config.locationType,
    metrics: service(),

    rootURL: config.rootURL,

    didTransition() {
        this._super(...arguments);
        this._trackPage();
    },

    _trackPage() {
        scheduleOnce('afterRender', this, () => {
            const page = document.location.pathname;
            const title = this.getWithDefault('currentRouteName', 'unknown');

            this.get('metrics').trackPage({ page, title });
        });
    },
});

/* eslint-disable array-callback-return */

Router.map(function() {
    this.route('notfound', { path: '/*path' });

    this.route('discover');
    this.route('profile');
    this.route('sources');
    this.route('registration');

    // NOTE the 'detail' route manually delegates to template/controller pairs
    // not listed here -- see the route handler's `setup` hook
    this.route('detail', { path: '/:type/:id' });

    this.route('elastic-down');
    this.route('notfound');
});

/* eslint-enable array-callback-return */

export default Router;
