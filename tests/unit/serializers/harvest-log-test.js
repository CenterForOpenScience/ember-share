import { moduleForModel, test } from 'ember-qunit';

moduleForModel('harvest-log', 'Unit | Serializer | harvest log', {
  // Specify the other units that are required for this test.
  needs: ['serializer:harvest-log']
});

// Replace this with your real tests.
test('it serializes harvestloglists', function(assert) {
  let harvestloglist = this.subject();

  let serializedRecord = harvestloglist.serialize();

  assert.ok(serializedRecord);
});
