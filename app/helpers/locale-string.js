import Ember from 'ember';

const { Helper } = Ember;

export function localeString([value]) {
    return !!value ? value.toLocaleString() : value;
}

export default Helper.helper(localeString);
