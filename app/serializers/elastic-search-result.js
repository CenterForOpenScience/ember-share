import JSONSerializer from 'ember-data/serializers/json';

export default JSONSerializer.extend({
    normalizeResponse(store, primaryModelClass, payload, id, requestType) {
        payload = payload.hits.hits.map(
            hit => {
                let source = hit._source;
                source.id = hit._id;
                source.type = 'elastic-search-result';
                return source;
            }
        );
        return this._super(store, primaryModelClass, payload, id, requestType);
    }
});
