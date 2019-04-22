const fs = require('fs');
const puppeteer = require('puppeteer');

module.exports = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page._client.send('Emulation.clearDeviceMetricsOverride');
  await page.tracing.start({path: 'tmp/trace.json', screenshots: true});
  await page.goto(url, {waitUntil: 'networkidle2'});
  await page.setBypassCSP(true);
  await page.tracing.stop();
  await page.close();

  await browser.close();
  const traceJson = require('../tmp/trace.json');
  const tracedScreenshots = traceJson.traceEvents.filter(e => e.name === 'Screenshot').map(el => el.args.snapshot);
  tracedScreenshots.forEach((screenshotBase64, i) => {
    const base64Data = screenshotBase64.replace(/^data:image\/png;base64,/, "");

    fs.writeFile(`tmp/screenshot${i}.png`, base64Data, 'base64', function(err) {
      if (err) {
        console.error('error', err);
      }
    });
  });

};
