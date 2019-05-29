const traceJsonToJpeg = require('./trace-json-to-jpeg');

async function extractImages(taskResults) {
  console.log('Start extracting images from trace data');
  const screenshotResults = await Promise.all(taskResults.map(traceJsonToJpeg));
  console.log('Completed extracting images from trace data');
  return screenshotResults;
}

module.exports = extractImages;
