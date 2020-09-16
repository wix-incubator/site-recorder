const puppeteer = require('puppeteer');
const ora = require('ora');
const customTask = require('../tasks/custom-task');
const {
  extractDataFromPerformanceTiming,
  extractDataFromPerformanceMetrics,
} = require('../utils/puppeteer-helpers');
const devices = require('puppeteer').devices;

/**
 * @param {string} url - with puppeteer will "trace"
 * @param {string} workDir - directory path where trace.json will be saved
 * @param {object} options - puppeteer launch options
 * @param {number} options.width - window width
 * @param {number} options.height - window height
 * @param {boolean} options.tracePerformance - should performance metrics be collected
 * @param {boolean} options.customScript - path to the script module that accepts page and returns a promise
 * @param {number} options.timeout - navigation timeout for puppeter page goto method
 * @returns {Promise<{traceJsonPath: string, performanceData?:object }>}
 */

const DEFAULT_WIDTH = 1280;
const DEFAULT_HEIGHT = 720;

async function puppeteerTraceWithScreenshots(
  url,
  workDir,
  options = {
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    tracePerformance: true,
    device: null,
    customScript: false,
    timeout: 3000,
    network: undefined
  },
) {
  let performanceData = null;
  let client;
  const spinner = ora('Puppeteer generating trace JSON...').start();

  const width = options.width || DEFAULT_WIDTH;
  const height = options.height || DEFAULT_HEIGHT;
  const browser = await puppeteer.launch({
    args: [
      `--window-size=${width},${height}`,
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  });

  const page = await browser.newPage();

  if (options.device) {
    console.log(`- Emulate as: ${options.device}`)
    await page.emulate(devices[options.device]);
  } else {
    console.log(`- View Port width: ${width} height: ${height}`)
    await page.setViewport({ width, height });
  }

  options.customScript && console.log(`- Custom Script:${options.customScript}`);
  options.timeout && console.log(`- Timeout:${options.timeout}`);

  client = await page.target().createCDPSession();

  if (options.network) {
    console.log(`- Network Emulation:${options.network.name}`);
    await client.send('Network.emulateNetworkConditions', options.network)
  }

  await client.send('Performance.enable');
  await client.send('Emulation.clearDeviceMetricsOverride');
  await page.tracing.start({
    path: `${workDir}/trace.json`,
    screenshots: true,
  });

  await page.goto(
    url,
    options.customScript
      ? { timeout: options.timeout }
      : { waitUntil: 'networkidle2', timeout: options.timeout },
  );

  if (options.customScript) {
    await customTask(page, options.customScript);
  }

  if (options.tracePerformance) {
    const windowPerformanceJSON = await page.evaluate(() =>
      JSON.stringify(window.performance.toJSON(), null, 2),
    );
    const puppeteerPageMetrics = await page.metrics();

    let firstMeaningfulPaint = 0;
    let windowPerformanceMetrics;

    while (firstMeaningfulPaint === 0) {
      await page.waitFor(300);
      windowPerformanceMetrics = await client.send('Performance.getMetrics');
      firstMeaningfulPaint = extractDataFromPerformanceMetrics(
        windowPerformanceMetrics,
        'FirstMeaningfulPaint',
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
      windowPerformanceMetricsJSON: JSON.parse(
        JSON.stringify(windowPerformanceMetrics.metrics, null, 2),
      ),
      windowPerformanceMetrics: {
        ...firstMeaningfulPaint,
        ...extractDataFromPerformanceMetrics(
          windowPerformanceMetrics,
          'DomContentLoaded',
        ),
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
