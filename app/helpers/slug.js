import Ember from 'ember';

const { Helper } = Ember;

export function slug([type]) {
    return type.classify().toLowerCase();
}

export default Helper.helper(slug);
