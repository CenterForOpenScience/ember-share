import Mirage from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  name(i) { return `tag number ${i}`; },
  url(i) { return `http://www.coolbeans${i}.edu`; },
  type: Mirage.belongsTo('taxonomy')
});
