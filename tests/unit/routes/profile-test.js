import { moduleFor, test } from 'ember-qunit';

moduleFor('route:profile', 'Unit | Route | profile', {
    // Specify the other units that are required for this test.
    needs: [
        'service:metrics',
        'service:session',
    ],
});

test('it exists', function(assert) {
    const route = this.subject();
    assert.ok(route);
});
