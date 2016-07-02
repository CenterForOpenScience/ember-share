import JSONAPISerializer from 'ember-data/serializers/json-api';

export default JSONAPISerializer.extend({
    normalizeResponse(_, __, response) {
        let data = [];
        data = response.hits.hits.map(
            hit => {
                let id = hit._id;
                hit = hit._source.doc;
                return {
                    id: id,
                    attributes: {
                        description: hit.description,
                        title: hit.title,
                        contributors: hit.contributors.map(contributor =>
                            {return {familyName: contributor.family_name, givenName: contributor.given_name};}
                        ),
                        tags: hit.tags
                    },
                    type: 'elastic-search-result'
                }
            }
        );
        return {
            data: data
        }
    }
});
