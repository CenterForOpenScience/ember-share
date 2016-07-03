export default function buildQueryString(queryDict) {
    var queryStrings = [];
    Object.keys(queryDict).map(key => {
        let val = queryDict[key];
        if (typeof val === 'object') {
            val = val.join(' AND '); //can be switched to OR
        }
        if (val) {
            queryStrings.push('q=' + key + '=' + String(val));
        }
    })
    return queryStrings.join('&');
}
