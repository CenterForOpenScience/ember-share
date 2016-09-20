import { moduleFor, test } from 'ember-qunit';

moduleFor('route:registration', 'Unit | Route | registration', {
    // Specify the other units that are required for this test.
    needs: [
        'service:metrics'
    ]
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
