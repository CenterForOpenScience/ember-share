import Mirage from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  name(i) { return `Award number ${i}`; },
  description: 'This is an award only given to true winners.',
  url(i) { return `http://award.${i}.gov`; },
});
