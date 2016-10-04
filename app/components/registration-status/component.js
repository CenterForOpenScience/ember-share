import Ember from 'ember';

const STATUS_HELP = {
    pending: function(registration) {
        return 'The application for ' + registration.sourceName + ' is being reviewed. Check back soon!';
    },
    accepted: function(registration) {
        if (registration.directSource) {
            return registration.sourceName + ' has been approved as a source. Start pushing data!';
        }
        return registration.sourceName + ' has been approved as a source but we have not started scraping it yet.';
    },
    implemented: function(registration) {
        return registration.sourceName + ' is now a source. Check it out!';
    },
    rejected: function(registration) {
        return registration.sourceName + ' has been rejected as a source. Contact support@osf.io for additional information.';
    },
};

export default Ember.Component.extend({
    init() {
        this._super(...arguments);
        Ember.run.schedule('afterRender', this, function() {
            this.send('enablePopover');
        });
    },

    colorClass: Ember.computed('registration.data.status', 'registration.data.sourceName', function() {
        return this.getStatusColor(this.get('registration.data'));
    }),

    helpText: Ember.computed('registration.data.status', function() {
        let registration = this.get('registration.data');
        return STATUS_HELP[registration.status](registration);
    }),

    getStatusColor(registration) {
        if (registration.status === 'pending') {
            return 'bg-warning';
        } else if (registration.directSource && registration.status === 'accepted') {
            return 'bg-success';
        } else if (registration.status === 'accepted') {
            return 'bg-info';
        } else if (registration.status === 'implemented') {
            return 'bg-success';
        }
        return 'bg-danger';
    },

    actions: {
        enablePopover() {
            Ember.$('[data-toggle="popover"]').popover();
        }
    }
});
