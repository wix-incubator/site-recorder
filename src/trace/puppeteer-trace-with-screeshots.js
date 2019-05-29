const puppeteer = require('puppeteer');
const ora = require('ora');

const {
  getTimeFromPerformanceMetrics,
  extractDataFromPerformanceTiming,
  extractDataFromPerformanceMetrics,
} = require('../utils/puppeteer-helpers');

/**
 * @param {string} url - with puppeteer will "trace"
 * @param {string} workDir - directory path where trace.json will be saved
 * @param {object} options - puppeteer launch options
 * @param {number} options.width - window width
 * @param {number} options.height - window height
 * @param {boolean} options.tracePerformance - should performance metrics be collected
 * @returns {Promise<{traceJsonPath: string, performanceData?:object }>}
 */

async function puppeteerTraceWithScreenshots(url, workDir, options = {width: 1280, height: 720, tracePerformance: true}) {
  let performanceData = null;
  let client;
  const spinner = ora('Puppeteer generating trace JSON...').start();

  const browser = await puppeteer.launch({
    args : [
      `--window-size=${options.width},${options.height}`
    ]
  });

  const page = await browser.newPage();
  console.log('options:', options)

  await page._client.send('Emulation.clearDeviceMetricsOverride');
  await page.tracing.start({path: `${workDir}/trace.json`, screenshots: true});
  client = await page.target().createCDPSession();
  await client.send('Performance.enable');

  await page.goto(url, {waitUntil: 'networkidle2'});

  if (options.tracePerformance) {
    // const windowPerformanceEntriesJSON = await page.evaluate(() => JSON.stringify(window.performance.getEntries(), null, 2));
    const windowPerformanceJSON = await page.evaluate(() => JSON.stringify(window.performance.toJSON(), null, 2));
    const puppeteerPageMetrics = await page.metrics();

    let firstMeaningfulPaint = 0;
    let windowPerformanceMetrics;

    while (firstMeaningfulPaint === 0) {
      await page.waitFor(300);
      windowPerformanceMetrics = await client.send('Performance.getMetrics');
      firstMeaningfulPaint = extractDataFromPerformanceMetrics(
        windowPerformanceMetrics,
        'FirstMeaningfulPaint'
      );
    }

    performanceData = {
      // windowPerformanceEntriesJSON: JSON.parse(windowPerformanceEntriesJSON),
      puppeteerPageMetrics,
      windowPerformanceJSON: JSON.parse(windowPerformanceJSON),
      windowPerformance: {
        ...extractDataFromPerformanceTiming(
          JSON.parse(windowPerformanceJSON).timing,
          'responseEnd',
          'domInteractive',
          'domContentLoadedEventEnd',
          'loadEventEnd',
        ),
      },
      windowPerformanceMetricsJSON: JSON.parse(JSON.stringify(windowPerformanceMetrics.metrics, null, 2)),
      windowPerformanceMetrics: {
        ...firstMeaningfulPaint,
        ...extractDataFromPerformanceMetrics(windowPerformanceMetrics, 'DomContentLoaded'),
      },
    };

    await page.tracing.stop();
  }

  await page.close();

  await browser.close();

  spinner.succeed();
  spinner.stop();

  return {
    traceJsonPath: `${workDir}/trace.json`,
    ...(!!performanceData && { performanceData }),
  };
}

module.exports = puppeteerTraceWithScreenshots;
