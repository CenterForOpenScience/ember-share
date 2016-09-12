import Ember from 'ember';
import ENV from '../../config/environment';

export default Ember.Component.extend({

    metrics: Ember.inject.service(),

    tagName: 'button',
    classNames: ['ember-view'],
    classNameBindings: ['selected:active'],

    didRender() {
        Ember.$('.providerBox').parent().css({ background: 'rgba(52, 73, 94, 0)', border: 'none', outline: '0' });
    },

    selected: Ember.computed('selectedType', function() {
        return this.get('selectedType') === this.get('type');
    }),

    click() {
        let type = this.get('selected') ? null : this.get('type');

        const category = 'homepage';
        const action = 'click';
        const label = type;

        this.get('metrics').trackEvent({ category, action, label });

        if (!type) {
            this.$().blur();
        }
        if (type === 'provider') {
            // TODO: move registration form to v2 and update link
            window.location.href = 'https://osf.io/share/registration/';
        } else {
            window.location.href = `${ENV.apiBaseUrl}/api/`;
        }
        this.sendAction('onClick', type);
    }
});
