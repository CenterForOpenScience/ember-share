import Ember from 'ember';
import ENV from '../../config/environment';

export default Ember.Component.extend({
    store: Ember.inject.service(),
    recommendations: [],
    openModal: false,
    isPerson: false,
    objAttributes: Ember.computed('obj', function() {
        var obj = this.get('obj');
        var ret = [];
        obj.eachAttribute(
            attr => {
                if (obj.get(attr) || this.get('compareTo').get(attr)) {
                    ret.push(attr);
                }
            }
        );
        return ret;
    }),
    objRelationships: Ember.computed('obj', function() {
        var obj = this.get('obj');
        var ret = [];
        obj.eachRelationship(
            attr => {
                if (attr === 'links' || attr === 'changes') {
                    return;
                }
                if ((attr === 'subject') && (obj.get(attr).get('name') || this.get('compareTo').get(attr).get('name'))) {
                    ret.push(attr);

                } else if (obj.get(attr).get('length') || this.get('compareTo').get(attr).get('length')) {
                    ret.push(attr);
                }
            }
        );
        return ret;
    }),
    init() {
        var _this = this;
        var _type = this.get('_type');
        if (_type === 'person') {
            this.set('isPerson', true);
        }
        var data = JSON.stringify({
            query: {
                more_like_this: {
                    like: {
                        _index: 'share',
                        _type: _type,
                        _id: this.get('obj.id')
                    },
                    min_term_freq: 1,
                    min_doc_freq: 1
                }
            }
        });
        var url = ENV.apiUrl + '/search/' + _type + '/_search?';
        Ember.$.ajax({
            url: url,
            crossDomain: true,
            type: 'POST',
            contentType: 'application/json',
            data: data
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
            this.get('store').findRecord(obj['@type'] || obj._type, obj._id).then(model => {
                this.set('compareTo', model);
            });
            this.set('openModal', true);
        },
        onMerge() {
            this.set('openModal', false);
            this.sendAction('onMerge', this.get('obj'));
        }
    }
});
