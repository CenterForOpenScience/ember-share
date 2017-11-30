import Route from '@ember/routing/route';

export default Route.extend({
    actions: {
        elasticDown() {
            this.intermediateTransitionTo('elastic-down');
            return false;
        }
    }
});
