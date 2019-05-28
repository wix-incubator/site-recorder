const puppeteerTraceWithScreenshots = require('./puppeteer-trace-with-screeshots');

/**
 * @param {Array.<{url: string, directory: string }>} tasks - url paired with dir to store its data
 * @returns {Promise<Promise[]>} - set of puppeteer trace results
 */
function execute(tasks) {
  return Promise.all(tasks.map(generateScreenshots));
}

async function generateScreenshots({ url, directory }) {
  console.log(`Start session for "${url}"`);

  const result = await puppeteerTraceWithScreenshots(url, directory, {
    width: 1280,
    height: 720,
    tracePerformance: true,
  });

  console.log(`Close session for "${url}"`);

  return { url, directory, ...result };
}

module.exports = execute;
