import Mirage from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  name(i) { return 'Provider of Data #${i}'; },
  location: 'São Paulo, Brasil',
  url: 'freedata.com.br'
});
