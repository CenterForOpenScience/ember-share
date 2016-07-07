import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        let type = params.work_type;
        let id = params.work_id;
        return this.get('store').findRecord(type, id);
    }
});
