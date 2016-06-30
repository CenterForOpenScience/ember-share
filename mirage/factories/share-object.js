import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
    id(i) {return String(i);},
    version(i) {return `${i}.${i}`;}
});
