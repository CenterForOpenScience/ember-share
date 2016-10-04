import Ember from 'ember';
import ENV from '../../config/environment';

export default Ember.Component.extend({
    // TODO: remove when curation is enabled on production
    curationEnabled: ENV.curationEnabled,

    text: null,
    editing: false,
    tagName: 'span',
    classNameBindings: ['editable'],

    textWidth: null,
    updated: Ember.computed.reads('text'),

    rows: function() {
        return this.get('updated').split('\n').length;
    }.property('updated'),

    changed: function() {
        return this.get('text') !== this.get('updated');
    }.property('text', 'updated'),

    editable: function() {
        return !this.get('editing');
    }.property('editing'),

    click() {
        if (this.get('editing')) { return; }
        this.set('editing', true);
        Ember.run.scheduleOnce('afterRender', this, function() {
            this.$('textarea').focus();
        });
    },

    focusOut() {
        // Nasty hack to make X button actually clickable
        Ember.run.debounce(this, function() {
            this.set('editing', false);
            if (this.get('changed')) {
                this.sendAction('onChange', this.get('updated'));
            }
        }, 10);
    },

    actions: {
        cancel() {
            this.setProperties({ editing: false, updated: this.get('text') });
            this.sendAction('onChange', undefined);
        },

        submit(event) {
            if (event.keyCode === 27) {
                return !!this.send('cancel'); // Esc
            }
            if (event.keyCode === 13 && event.shiftKey) {
                return !!this.focusOut();  // Enter + Shift
            }
        }
    }
});
