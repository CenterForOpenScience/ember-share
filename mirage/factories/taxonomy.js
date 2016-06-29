import Mirage from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  name(i) { return '${i}\'s taxonomy'; },
  url(i) { return 'http://www.coolbeans${i}.edu'; },
});
