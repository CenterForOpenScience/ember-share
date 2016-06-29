import DS from 'ember-data';
import ShareObjectMixin from '../mixins/share-object';

export default DS.Model.extend(ShareObjectMixin, {
    id(i): {return '${i}'},
    source: 'person', //not sure what the source is supposed to be yet
    data: 'Oh man would you look at how much data is in this guy! It\'s so raw!',
    sha256: '617bcce3bae1a09ff626ce239540bc77f57a09f45708e20aefc1f4c42a0fec65',
    dateSeen: new Date(),
    dateHarvested: new Date(), // will this even work?
    objects: 'Oh man I dont even know what this is!!'
});
