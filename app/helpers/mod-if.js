import Ember from 'ember';

const { Helper } = Ember;

export function modIf([value, modBy]) {
    return ((value + 1) % modBy === 0);
}

export default Helper.helper(modIf);
