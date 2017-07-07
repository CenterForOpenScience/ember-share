import { moduleForModel, test } from 'ember-qunit';

moduleForModel('sourceconfig', 'Unit | Serializer | sourceconfig', {
  // Specify the other units that are required for this test.
  needs: ['serializer:sourceconfig']
});

// Replace this with your real tests.
test('it serializes harvestloglists', function(assert) {
  let harvestloglist = this.subject();

  let serializedRecord = harvestloglist.serialize();

  assert.ok(serializedRecord);
});
