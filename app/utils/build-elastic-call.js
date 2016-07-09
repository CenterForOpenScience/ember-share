import ENV from '../config/environment';

export default function buildElasticCall(queryString) {
    return ENV.apiUrl + '/api/search/abstractcreativework/_search?' + queryString;
}
