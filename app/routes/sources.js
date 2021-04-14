import Route from '@ember/routing/route';

export default Route.extend({
    setupController() {
        this._super(...arguments);
        this.get('loadElasticAggregations').perform();
    },

    actions: {
        elasticDown() {
            this.intermediateTransitionTo('elastic-down');
            return false;
        },
    },
});
