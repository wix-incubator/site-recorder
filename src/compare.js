const prepare = require('./prepare');
const execute = require('./execute');
const combine = require('./combine');

/**
 * @param {string[]} urls - list of urls to trace
 * @param {Object} options - cli options
 * @returns {Promise<Promise[]>} - set of conversion processes
 */
function compare(urls, options) {
  return prepare(urls)
    .then(execute)
    .then(results => combine(results, options));
}

module.exports = compare;
