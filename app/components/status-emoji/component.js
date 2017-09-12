import Ember from 'ember';

export default Ember.Component.extend({
 emojis : {'Enqueued':'created', 'In Progress':'in_progress', 'Failed':'fail', 'Succeeded':'succeed', 'Rescheduled':'reschedule', 'Forced':'forced', 'Skipped':'skipped', 'Retrying':'retry'}
});
