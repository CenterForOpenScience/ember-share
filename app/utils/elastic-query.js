import moment from 'moment';

/*
 * @function dateRangeFilter
 * @param String field Name of the date field to filter
 * @param Object start Beginning of date range
 * @param Object end End of date range
 */
function dateRangeFilter(field, start, end) {
    if (start && end) {
        let filter = { range: {} };
        filter.range[field] = {
            gte: moment(start).format(),
            lte: moment(end).format()
        };
        return filter;
    } else {
        return null;
    }
}

function invertDateRangeFilter(field, filter) {
    let start = null, end = null;
    if (filter) {
        let range = filter.range[field];
        start = moment(range.gte);
        end = moment(range.lte);
    }
    return { start, end };
}

/*
 * @function termsFilter
 * @param String field Name of the field to filter
 * @param Array terms List of terms to match
 * @param Boolean [raw] If true, uses the raw, unanalyzed version of the field
 * for exact matches. Defaults to true.
 */
function termsFilter(field, terms, raw = true) {
    if (terms && terms.length) {
        if (raw) {
            field = field + '.raw';
        }
        let filter = { terms: {} };
        filter.terms[field] = terms;
        return filter;
    } else {
        return null;
    }
}

function associationTermsFilter(field, terms, raw = true) {
    field = field + 's.name';
    return termsFilter(field, terms, raw);
}

function personTermsFilter(field, terms, raw = true) {
    field = field + '.name';
    return termsFilter(field, terms, raw);
}

function uniqueFilter(value, index, self) {
    return self.indexOf(value) === index;
}

function getUniqueList(data) {
    return data.filter( uniqueFilter );
}

function encodeParams(tags) {
    return tags.map(tag => tag.replace(',', ',\\'));
}

function decodeParams(param) {
    return param.split(/,(?!\\)/).map(function(tag) {
        return tag.replace(',\\', ',');
    });
}

function getSplitParams(params) {
    if (!params.length) {
        return params.slice(0);
    } else if (params.length && Array.isArray(params[0])) {
        return params[0];
    } else if (params.length && typeof(params) === 'string') {
        return decodeParams(params);
    } else if (params.length === 1) {
        return decodeParams(params[0]);
    }
    return params;
}

export {
    dateRangeFilter,
    invertDateRangeFilter,
    termsFilter,
    associationTermsFilter,
    personTermsFilter,
    getUniqueList,
    encodeParams,
    decodeParams,
    getSplitParams
};
