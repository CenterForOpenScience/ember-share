import Ember from 'ember';
import EntityMixin from 'ember-share/mixins/entity';
import { module, test } from 'qunit';

module('Unit | Mixin | entity');

// Replace this with your real tests.
test('it works', function(assert) {
  let EntityObject = Ember.Object.extend(EntityMixin);
  let subject = EntityObject.create();
  assert.ok(subject);
});
