import { moduleForModel, test } from 'ember-qunit';

moduleForModel('elastic-search-result', 'Unit | Serializer | elastic search result', {
  // Specify the other units that are required for this test.
  needs: ['serializer:elastic-search-result']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
