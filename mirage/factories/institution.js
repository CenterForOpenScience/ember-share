import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
    name() { return faker.fake('{{name.firstName}} {{name.lastName}}'); },
    isni() { return faker.random.alphaNumeric(); },
    ringgold() { return faker.random.alphaNumeric(); },
    location() { return faker.internet.url(); },
    url() { return faker.internet.url(); }
});
