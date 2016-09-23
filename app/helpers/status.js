import Ember from 'ember';

const statusMap = {
    '0': 'Pending',
    '1': 'Accepted',
    '2': 'Implemented',
    '3': 'Rejected'
};

export function status(status) {
    return statusMap[status];
}

export default Ember.Helper.helper(status);
