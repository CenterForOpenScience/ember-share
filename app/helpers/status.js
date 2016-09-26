import Ember from 'ember';

const statusMap = {
    pending: 'bg-warning',
    accepted: 'bg-info',
    implemented: 'bg-success',
    rejected: 'bg-danger'
};

export function status(status) {
    return statusMap[status];
}

export default Ember.Helper.helper(status);
