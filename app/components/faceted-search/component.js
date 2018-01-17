import Component from '@ember/component';

export default Component.extend({
    actions: {
        facetChanged(paramName, value) {
            this.get('updateParams')(paramName, value);
        },
    },
});
