import Component from '@ember/component';

export default Component.extend({
    classNames: ['dropdown'],

    actions: {
        select(sortBy, display) {
            this.selectSortOption(sortBy, display);
        },
    },
});
