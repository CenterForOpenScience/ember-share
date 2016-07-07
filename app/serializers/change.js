import JSONLDToAPISerializer from './json-ld-to-api-serializer';

export default JSONLDToAPISerializer.extend({
    normalizeResponse(_, __, data, ___, ____){
        return this._super(_, __, data, ___, ____, 'change');
    }
});
