const puppeteer = require('puppeteer');

module.exports = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page._client.send('Emulation.clearDeviceMetricsOverride')
  await page.tracing.start({path: 'trace.json', screenshots: true});
  await page.goto(url, {waitUntil: 'networkidle2'});
  await page.setBypassCSP(true);
  await page.tracing.stop();
  await browser.close();
};
