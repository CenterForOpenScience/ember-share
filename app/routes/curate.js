import Ember from 'ember';
import BigInteger from 'npm:big-integer';
import ENV from '../config/environment';

const NUM = 0xDEADBEEF;
const MOD = 10000000000;

export default Ember.Route.extend({
    getEncodedPk(pk, type) {
        const modelID = ENV.modelIDs[type] || ENV.modelIDs.creativework;
        const encoded = ('000000000' + new BigInteger(pk).multiply(NUM).mod(MOD).toString(16).toUpperCase()).substr(-9);
        return `${modelID.toString(16)}${encoded.slice(0, 3)}-${encoded.slice(3, 6)}-${encoded.slice(6)}`;
    },
    beforeModel(transition) {
        const params = transition.params.curate;
        params.id = this.getEncodedPk(params.id, params.type);
        this.transitionTo('detail', params.type, params.id);
    },
});
