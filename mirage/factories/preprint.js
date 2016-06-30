import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
    postedDate(i) { return faker.date.past(i); }
});
