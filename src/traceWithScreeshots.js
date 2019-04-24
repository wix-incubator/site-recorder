const puppeteer = require('puppeteer');
const {
  getTimeFromPerformanceMetrics,
  extractDataFromPerformanceTiming,
  extractDataFromPerformanceMetrics,
} = require('./utils/puppeteer-helpers');

/**
 * @param {string} url - with puppeteer will "trace"
 * @param {string} workDir - directory path where trace.json will be saved
 * @param {object} options - puppeteer launch options
 * @param {number} options.width - window width
 * @param {number} options.height - window height
 * @param {boolean} options.tracePerformance - should performance metrics be collected
 * @returns {Promise<{traceJsonPath: string, performanceData?:object }>}
 */

async function traceWithScreenshots(url, workDir, options = {width: 1280, height: 720, tracePerformance: true}) {
  let performanceData = null;
  let client;

  const browser = await puppeteer.launch({
    args : [
      `--window-size=${options.width},${options.height}`
    ]
  });

  const page = await browser.newPage();

  if (options.tracePerformance) {
    await page._client.send('Emulation.clearDeviceMetricsOverride');
    await page.tracing.start({path: `${workDir}/trace.json`, screenshots: true});
    client = await page.target().createCDPSession();
    await client.send('Performance.enable');
  }

  await page.goto(url, {waitUntil: 'networkidle2'});

  if (options.tracePerformance) {
    // const performanceEntriesJSON = await page.evaluate(() => JSON.stringify(performance.getEntries(), null, 2));
    const performanceJSON = await page.evaluate(() => JSON.stringify(performance.toJSON(), null, 2));
    const puppeteerPageMetrics = await page.metrics();

    let firstMeaningfulPaint = 0;
    let performanceMetrics;

    while (firstMeaningfulPaint === 0) {
      await page.waitFor(300);
      performanceMetrics = await client.send('Performance.getMetrics');
      console.log('--  performanceMetrics=',  performanceMetrics);
      firstMeaningfulPaint = getTimeFromPerformanceMetrics(
        performanceMetrics,
        'FirstMeaningfulPaint'
      );
    }

    performanceData = {
      // performanceEntriesJSON: JSON.parse(performanceEntriesJSON),
      performanceJSON: JSON.parse(performanceJSON),
      puppeteerPageMetrics,
      extractedDataFromPerformanceJson: extractDataFromPerformanceTiming(
        JSON.parse(performanceJSON).timing,
        'responseEnd',
        'domInteractive',
        'domContentLoadedEventEnd',
        'loadEventEnd',
      )
    };

    performanceData.firstMeaningfulPaint = firstMeaningfulPaint;
    await page.tracing.stop();
  }

  await page.close();

  await browser.close();

  return {
    traceJsonPath: `../${workDir}/trace.json`,
    ...(!!performanceData && { performanceData }),
  };
}

module.exports = traceWithScreenshots;
