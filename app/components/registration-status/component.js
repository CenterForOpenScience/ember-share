import Component from '@ember/component';
import { schedule } from '@ember/runloop';
import { computed } from '@ember/object';

const STATUS_HELP = {
    pending(registration) {
        return `The application for ${registration.sourceName} is being reviewed. Check back soon!`;
    },
    accepted(registration) {
        if (registration.directSource) {
            return `${registration.sourceName} has been approved as a source. Start pushing data!`;
        }
        return `${registration.sourceName} has been approved as a source but we have not started scraping it yet.`;
    },
    implemented(registration) {
        return `${registration.sourceName} is now a source. Check it out!`;
    },
    rejected(registration) {
        return `${registration.sourceName} has been rejected as a source. Contact share-support@osf.io for additional information.`;
    },
};

export default Component.extend({
    colorClass: computed('registration.data.{status,sourceName}', function() {
        return this.getStatusColor(this.get('registration.data'));
    }),

    helpText: computed('registration.data.status', function() {
        const registration = this.get('registration.data');
        return STATUS_HELP[registration.status](registration);
    }),

    init() {
        this._super(...arguments);
        schedule('afterRender', this, function() {
            this.send('enablePopover');
        });
    },

    actions: {
        enablePopover() {
            $('[data-toggle="popover"]').popover();
        },
    },

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
});
