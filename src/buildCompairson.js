const generateFolders = require('./generateFolders');
const collectTraceData = require('./collectTraceData');
const extractImages = require('./extractImages');
const combine = require('./combine');

/**
 * @param {string[]} urls - list of urls to trace
 * @param {Object} options - cli options
 * @returns {Promise<Promise[]>} - set of conversion processes
 */
function buildCompairson(urls, options) {
  // TODO curry actions with options argument
  return generateFolders(urls)
    .then(task => collectTraceData(task, options))
    .then(traceResults => extractImages(traceResults, options))
    .then(screenshotResults => combine(screenshotResults, options));
}

module.exports = buildCompairson;
