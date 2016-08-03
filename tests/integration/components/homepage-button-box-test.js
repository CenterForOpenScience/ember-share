import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('homepage-button-box', 'Integration | Component | homepage button box', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{homepage-button-box}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#homepage-button-box}}
      template block text
    {{/homepage-button-box}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
