import Ember from 'ember';

const { Helper } = Ember;

export function prettify([str]) {
    return str.split(/([A-Z][a-z]+)/).filter(x => x).join(' ');
}

export default Helper.helper(prettify);
