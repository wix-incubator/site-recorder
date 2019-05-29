const traceJsonToJpeg = require('../trace/trace-json-to-jpeg');

/**
 * @param {Array.<{url: string, directory: string, traceJsonPath: string, performanceData: object }>} tasks - url paired with dir to store its data
 * @returns {Promise<Promise[]>} - set of puppeteer trace results
 */
async function extractImages(taskResults) {
  console.log('Start extracting images from trace data');
  const screenshotResults = await Promise.all(taskResults.map(traceJsonToJpeg));
  console.log('Completed extracting images from trace data');
  return screenshotResults;
}

module.exports = extractImages;
