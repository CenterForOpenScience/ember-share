import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
    name() { return faker.fake('{{name.firstName}} {{name.lastName}}'); },
    venueType: 'journal',
    location() { return faker.internet.url(); },
    communityIdentifier() { return faker.random.word(); }
});
