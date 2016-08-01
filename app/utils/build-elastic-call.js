import ENV from '../config/environment';

export default function buildElasticCall() {
    return ENV.apiUrl + '/api/search/abstractcreativework/_search';
}
