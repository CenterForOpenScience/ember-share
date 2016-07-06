import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('curate-list-tag', 'Integration | Component | curate list tag', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{curate-list-tag}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#curate-list-tag}}
      template block text
    {{/curate-list-tag}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
