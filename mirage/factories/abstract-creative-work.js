import { faker, hasMany, belongsTo } from 'ember-cli-mirage';
import shareObject from './share-object';

export default shareObject.extend({
    title(i) {return `Creative Stuff #${i}`;},
    description: 'I\'m here to describe things',
    contributors: hasMany('contributors'),
    institutions: hasMany('institutions'),
    venues: hasMany('venues'),
    funders: hasMany('funders'),
    awards: hasMany('awards'),
    dataProviders: hasMany('data-providers'),
    providerLink: 'http://otisReddingProvidesHappiness.edu',
    subject: belongsTo('tag'),
    doi: 'whatEven1saDoI',
    isbn: 'th1s1san1sbn',
    tags: hasMany('tags'),
    workType: 'Type of work',
    created(i) {return faker.date.past(i);},
    published(i) {return faker.date.past(i);},
    freeToReadType: 'Type of free',
    freeToReadDate(i) {return faker.date.past(i);},
    license: 'This is a license',
});
