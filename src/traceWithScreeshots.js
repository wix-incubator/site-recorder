const puppeteer = require('puppeteer');
const checkAndCreateDirectory = require('./utils/check-and-create-directory');

/**
 * @param {string} url - with puppeteer will "trace"
 * @param {string} workDir - directory path where trace.json will be saved
 * @returns {Promise<string>} - resolves to traceJsonPath
 */

async function traceWithScreenshots(url, workDir) {
  try {
    await checkAndCreateDirectory(workDir);
  } catch (error) {
    if (error) {
      console.log("failed to check and create directory:", error);
      throw new Error(error);
    }
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page._client.send('Emulation.clearDeviceMetricsOverride');
  await page.tracing.start({path: `${workDir}/trace.json`, screenshots: true});
  await page.goto(url, {waitUntil: 'networkidle2'});
  await page.setBypassCSP(true);
  await page.tracing.stop();
  await page.close();

  await browser.close();

  return `..${workDir}/trace.json`;
}

module.exports = traceWithScreenshots;
