const puppeteerTraceWithScreenshots = require('../trace/puppeteer-trace-with-screeshots');

/**
 * @param {Array.<{url: string, directory: string }>} tasks - url paired with dir to store its data
 * @returns {Promise<{url: string, directory: string, traceJsonPath: string, performanceData: object}[]>} - set of puppeteer trace results
 */
function collectTraceData(tasks, options) {
  return Promise.all(tasks.map(task => generateScreenshots(task, options)));
}

async function generateScreenshots({ url, directory }, options) {
  console.log(`\nStart session for "${url}"`);

  const result = await puppeteerTraceWithScreenshots(url, directory, {
    width: options.resolutionWidth,
    height: options.resolutionHeight,
    tracePerformance: true,
    customScript: options.customScript,
    timeout: options.timeout,
    device: options.device,
    network: options.network,
  });

  console.log(`\nClose session for "${url}"`);

  options.debug && console.log('--  performanceData=', result.performanceData);

  return { url, directory, ...result };
}

module.exports = collectTraceData;
