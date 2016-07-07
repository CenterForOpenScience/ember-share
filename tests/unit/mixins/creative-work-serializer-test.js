import Ember from 'ember';
import CreativeWorkSerializerMixin from 'ember-share/mixins/creative-work-serializer';
import { module, test } from 'qunit';

module('Unit | Mixin | creative work serializer');

// Replace this with your real tests.
test('it works', function(assert) {
  let CreativeWorkSerializerObject = Ember.Object.extend(CreativeWorkSerializerMixin);
  let subject = CreativeWorkSerializerObject.create();
  assert.ok(subject);
});
