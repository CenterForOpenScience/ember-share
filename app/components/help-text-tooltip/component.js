import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['tooltip-helper'],
    safeHelpText: Ember.computed('helpText', function() {
        return Ember.String.htmlSafe(this.get('helpText')).string;
    }),
});
