import JSONAPISerializer from 'ember-data/serializers/json-api';

export default JSONAPISerializer.extend({
    normalizeResponse(_, __, data, ___, ____){
        data = {
            data: data.results.map(result => {
                return {
                    id: result['@id'],
                    type: result['@type'],
                    attributes: result
                }
            })
        };
        return this._super(_, __, data, ___, ____);
    }
});
