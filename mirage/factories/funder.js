import Mirage from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  funderName(i) { return 'Funding Organization #${i}'; },
  funderRegion: 'Kentucky',
  communityIdentifier: { return '${i}'},
  url: 'www.iLikeToEatApplesAndBanan.as'
});
