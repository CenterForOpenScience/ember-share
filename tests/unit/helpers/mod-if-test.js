import { modIf } from 'ember-share/helpers/mod-if';
import { module, test } from 'qunit';

module('Unit | Helper | mod if');

// Replace this with your real tests.
test('mod even', function(assert) {
  let result = modIf([5, 2]);
  assert.ok(result);
});

test('mod odd', function(assert) {
  let result = modIf([4, 2]);
  assert.notOk(result);
});
