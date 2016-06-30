import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
    id(i) {return '${i}'},
    source: 'person', //not sure what the source is supposed to be yet
    data: 'Oh man would you look at how much data is in this guy! It\'s so raw!',
    sha256: '617bcce3bae1a09ff626ce239540bc77f57a09f45708e20aefc1f4c42a0fec65',
    dateSeen(i) {return faker.date.past(i)},
    dateHarvested(i) {return faker.date.past(i)},
    objects: 'Oh man I dont even know what this is!!'
});
