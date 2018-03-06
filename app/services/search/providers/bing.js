'use strict';

const config = require('../../../config/config');
const BingApi = require('node-bing-api')({
    accKey: config.bingAccessKey,
    rootUri: "https://api.cognitive.microsoft.com/bing/v7.0/"
});

/*
 * Fetches data from bing
 *
 * @params {params} the search parameters
 * @params {vertical} type of search results (web, images, etc)
 * @params {callback} the callback function that is executed once the request returns
 */
exports.fetch = function (query, vertical, pageNumber, callback) {
    const options = constructOptions(vertical, pageNumber);
    if (vertical === 'web') BingApi.web(query, options, callback);
    else if (vertical === 'news') BingApi.news(query, options, callback);
    else if (vertical === 'images') BingApi.images(query, options, callback);
    else if (vertical === 'videos') BingApi.video(query, options, callback);
    else throw {
            name: 'Bad Request',
            message: 'Invalid vertical'
        }
};

/*
 * Formats result body received from search api call
 *
 * @params {vertical} type of search results (web, images, etc)
 * @params {body} result body received from the api call
 */
exports.formatResults = function (vertical, res, body) {
    if (!body && !(body.value || body.webPages.value)) {
        throw new Error('No results from search api.');
    }

    if (vertical === 'web') {
        body = body.webPages
    }

    if (vertical === 'images' || vertical === 'videos') {
        for (let i = 0; i < body.value.length; i++) {
            body.value[i].url = body.value[i].contentUrl;
        }
    }

    return {
        results: body.value,
        matches: body.totalEstimatedMatches
    };
};

/*
 * Construct search query options according to search api (bing)
 *
 * https://www.npmjs.com/package/node-bing-api
 * https://docs.microsoft.com/en-us/azure/cognitive-services/bing-web-search/search-the-web
 *
 * @params The query parameters passed to the API via GET
 */
function constructOptions(vertical, pageNumber) {
    const count = (vertical === 'images' || vertical === 'videos') ? 12 : 10;
    const mkt = 'en-US';
    const offset = (pageNumber - 1) * count;

    return {
        offset: offset,
        count: count,
        mkt: mkt
    };
}