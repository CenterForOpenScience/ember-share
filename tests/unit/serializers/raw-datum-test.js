import { moduleForModel, test } from 'ember-qunit';

moduleForModel('raw-datum', 'Unit | Serializer | raw datum', {
  // Specify the other units that are required for this test.
  needs: ['serializer:raw-datum']
});

// Replace this with your real tests.
test('it serializes harvestloglists', function(assert) {
  let harvestloglist = this.subject();

  let serializedRecord = harvestloglist.serialize();

  assert.ok(serializedRecord);
});
