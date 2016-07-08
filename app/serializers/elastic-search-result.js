import JSONSerializer from 'ember-data/serializers/json';

export default JSONSerializer.extend({
    normalizeResponse(store, primaryModelClass, payload, id, requestType) {
        payload = payload.hits.hits.map(
            hit => {
                // HACK
                let source = hit._source;
                source.id = hit._id;
                source.type = 'elastic-search-result';
                source.workType = source['@type'];
                source.contributors = source.contributors.map(contributor => {
                    return {
                        familyName: contributor.family_name,
                        givenName: contributor.given_name
                    };
                });
                return source;
            }
        );
        return this._super(store, primaryModelClass, payload, id, requestType);
    }
});
