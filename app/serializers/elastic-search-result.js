import JSONAPISerializer from 'ember-data/serializers/json-api';

export default JSONAPISerializer.extend({
    normalize() {
        debugger;
        return this._super(...arguments);
    }
});
