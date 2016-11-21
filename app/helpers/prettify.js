import Ember from 'ember';

export function prettify([str]) {
    return str.split(/([A-Z][a-z]+)/).filter(x => x).join(' ');
}

export default Ember.Helper.helper(prettify);
