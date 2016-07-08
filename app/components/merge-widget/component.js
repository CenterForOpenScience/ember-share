import Ember from 'ember';
import ENV from '../../config/environment';

export default Ember.Component.extend({
    store: Ember.inject.service(),
    recommendations: [],
    init() {
        var _this = this;
        var _type = this.get('_type');
        var data = JSON.stringify({
            query: {
                'more_like_this': {
                    like: {
                        '_index': 'share',
                        '_type': _type,
                        '_id': this.get('obj.id')
                    }
                }
            }
        });
        var url = ENV.apiUrl + '/api/search/' + _type + '/_search?';
        Ember.$.ajax({
            'url': url,
            'crossDomain': true,
            'type': 'POST',
            'contentType': 'application/json',
            'data': data
        }).then(function(json) {
            let hits = json.hits.hits.splice(0, 3);
            hits.map(hit => {
                Ember.$.extend(hit, hit._source);
                delete hit._source;
                return hit;
            });
            _this.set('recommendations', hits);
        });
        return this._super(...arguments);
    },
    actions: {
        compare(obj) {
            //pop up comparison modal
        }
    }
});
