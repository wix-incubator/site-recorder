const fs = require('fs').promises;
const puppeteer = require('puppeteer');
const leftPad = require('left-pad');

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
  const traceScreenshots = traceJson.traceEvents.filter(x => (
      x.cat === 'disabled-by-default-devtools.screenshot' &&
      x.name === 'Screenshot' &&
      typeof x.args !== 'undefined' &&
      typeof x.args.snapshot !== 'undefined'
  ));
  const writeFilePromises = [];
  const pad = traceScreenshots.length.toString().length;
  traceScreenshots.forEach(function(snap, index) {
    writeFilePromises.push(fs.writeFile(`tmp/screenshot${leftPad(index, pad, '0')}.jpeg`, snap.args.snapshot, 'base64'))
  })

  try {
      await Promise.all(writeFilePromises);
      console.log('All files are written');
    } catch(err) {
      console.error(err);
  }
};
