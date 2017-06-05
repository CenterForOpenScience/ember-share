import Ember from 'ember';


const equals = (params) => params[0] === params[1];
export default Ember.Helper.helper(equals);
