import Component from '@ember/component';

import ENV from '../../config/environment';


export default Component.extend({
    baseUrl: ENV.apiBaseUrl,
});
