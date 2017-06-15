import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({

  keyForAttribute: function(attr) {
      return attr;
  },

  keyForRelationship: function(key, relationship) {
      return key;
 },
});
