import Ember from 'ember';

export default Ember.Component.extend({
    text: null,
    editing: false,
    tagName: 'span',
    classNameBindings: ['editable'],

    textWidth: null,
    updated: Ember.computed.reads('text'),

    changed: function() {
      return this.get('text') != this.get('updated');
    }.property('text', 'updated'),

    editable: function() {
      return !this.get('editing')
    }.property('editing'),

    click() {
      if (this.get('editing')) return;
      this.set('editing', true);
      this.set('textWidth', (this.$('.text-display').width() + 10) + 'px');
      Ember.run.scheduleOnce('afterRender', this, function() {
        this.$('input').focus();
      });
    },

    focusOut() {
      // Nasty hack to make X button actually clickable
      Ember.run.debounce(this, function() {
        this.set('editing', false);
        this.sendAction('onChange', this.get('updated'));
      }, 10);
    },

    actions: {
        cancel() {
            this.setProperties({editing: false, updated: this.get('text')});
            this.sendAction('onChange', undefined);
        },

        submit(text, event) {
          if (event.keyCode == 27) // Esc
            this.send('cancel');
          if (event.keyCode == 13) // Enter
            this.focusOut();
        }
    }
});
