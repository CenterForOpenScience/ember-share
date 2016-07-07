import JSONAPISerializer from 'ember-data/serializers/json-api';

export default JSONAPISerializer.extend({
    normalizeResponse(_, __, data, ___, ____){
        data = {
            data: data.results.map(result => {
                //oh please rewrite this when you are not so tired
                let splitog = result['self'];
                let id_ = splitog[splitog.length - 2];
                return {
                    id: id_,
                    type: 'changeset',
                    attributes: result
                }
            })
        };
        return this._super(_, __, data, ___, ____);
    }
});
