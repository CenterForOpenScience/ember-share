import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('merge-search-result-person', 'Integration | Component | merge search result person', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{merge-search-result-person}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#merge-search-result-person}}
      template block text
    {{/merge-search-result-person}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
