import ENV from '../config/environment';

export default function buildElasticCall() {
    return ENV.apiUrl + '/search/abstractcreativework/_search';
}
