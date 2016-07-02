pmport Ember from 'ember';

let CurateFieldComponent = Ember.Component.extend({
    classNames: ['curate-field'],

    fieldValue: Ember.computed.reads('value'),

    actions: {
        change() {
            this.sendAction('onChange', this.get('fieldValue'));
        }
    }
});
