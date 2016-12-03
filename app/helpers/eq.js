import Ember from 'ember';

export function eq([left, right]) {
    return left === right;
}

export default Ember.Helper.helper(eq);
