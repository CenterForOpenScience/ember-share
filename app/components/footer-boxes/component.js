import Ember from 'ember';

export default Ember.Component.extend({

    tagName: 'button',
    classNames: ['ember-view'],
    classNameBindings: ['selected:active'],
    metrics: Ember.inject.service(),

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

        Ember.get(this, 'metrics').trackEvent({ category, action, label });

        if (!type) {
            this.$().blur();
        }
        if (type === 'provider') {
            window.location.href = 'https://osf.io/share/registration/';
        } else {
            window.location.href = 'https://share.osf.io/api/';
        }
        this.sendAction('onClick', type);
    }
});
