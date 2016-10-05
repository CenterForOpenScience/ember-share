import Ember from 'ember';

const category = 'detail';
const action = 'click';

export default Ember.Component.extend({

    metrics: Ember.inject.service(),

    classNames: ['list-item'],

    actions: {
        remove(item) {
            this.sendAction('remove', item);
        },
        track(event) {
            const label = 'view ' + event.content.data.givenName + ' ' + event.content.data.familyName;
            this.get('metrics').trackEvent({ category, action, label });
        }
    }
});
