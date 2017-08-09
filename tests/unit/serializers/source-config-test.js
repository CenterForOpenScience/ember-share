import { moduleForModel, test } from 'ember-qunit';

moduleForModel('source-config', 'Unit | Serializer | source config', {
  // Specify the other units that are required for this test.
  needs: ['serializer:source-config']
});

// Replace this with your real tests.
test('it serializes harvestloglists', function(assert) {
  let harvestloglist = this.subject();

  let serializedRecord = harvestloglist.serialize();

  assert.ok(serializedRecord);
});
