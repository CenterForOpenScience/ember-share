import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
    id(i) {return '${i}'},
    version(i) {return '${i}.${i}'}
});
