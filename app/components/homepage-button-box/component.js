import Component from '@ember/component';

export default Component.extend({

    tagName: 'button',
    classNames: ['btn', 'btn-default', 'btn-sm'],
    classNameBindings: ['selected:active'],

    didRender() {
        $('.infoBox').parent().css({ outline: '0' });
    },
});
