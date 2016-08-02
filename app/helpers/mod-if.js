import Ember from 'ember';

export function modIf([value, modBy]) {
    return ((value + 1) % modBy === 0);
}

export default Ember.Helper.helper(modIf);
