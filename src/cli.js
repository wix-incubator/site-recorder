/* eslint-disable no-console */
const program = require('commander');
const updateNotifier = require('update-notifier');
const ora = require('ora');
const fs = require('fs').promises;
const pkg = require('../package.json');
const handleError = require('./utils/handler-error');
const convertSnapshotTimeToRelative = require('./utils/convert-snapshot-time-to-relative');
const checkAndCreateDirectory = require('./utils/check-and-create-directory');
const median = require('./utils/median');
const jpegToGifConverter = require('./jpeg-to-gif');
const traceWithScreenshots = require('./traceWithScreeshots');


updateNotifier({ pkg }).notify();

try {
  program
    .version(pkg.version, '-v, --version')
    .usage('[options] <url1 ...> <url2 ...>')
    .arguments('[module]', 'prints module version from the node_modules')
    .option('-d, --debug', 'see full error messages, mostly for debugging')
    .option('--disable-colors', 'minimize color and styling usage in output');

  program.parse(process.argv);

  if (program.args.length < 1) {
    throw new Error('There should be two urls as an arguments')
  }

  (async () => {
    const [firstUrl] = program.args;
    const spinner = ora();


    try {
      const workdir = 'tmp'; // await tempdir();

      console.log(`Process your url: ${firstUrl}`);
      try {
        await checkAndCreateDirectory(`./${workdir}`);
      } catch (error) {
        if (error) {
          console.log("failed to check and create directory:", error);
          throw new Error(error);
        }
      }


      spinner.text = 'Puppeteer generating trace JSON...';
      spinner.start();
      const {traceJsonPath, performanceData} = await traceWithScreenshots(firstUrl, workdir);
      spinner.text = 'Puppeteer trace JSON ready!';
      spinner.succeed();
      spinner.stop();

      console.log('--  performanceData=',  performanceData);
      spinner.text = 'Converting trace JSON to screenshots jpeg files...';
      spinner.start();
      const traceJson = require(traceJsonPath);
      const traceScreenshots = convertSnapshotTimeToRelative(traceJson.traceEvents).filter(x => (
        x.cat === 'disabled-by-default-devtools.screenshot' &&
        x.name === 'Screenshot' &&
        typeof x.args !== 'undefined' &&
        typeof x.args.snapshot !== 'undefined'
      )).map((snap, index, array) => {
        return {
          ...snap,
          timeDiffWithPrev: index === 0 ? 0 : snap.timeFromStart - array[index - 1].timeFromStart
        }
      });

      const medianFps = median(traceScreenshots.map(el => el.timeDiffWithPrev));
      const traceSessionDuration = traceScreenshots[traceScreenshots.length - 1].timeFromStart;
      console.log('--  traceSessionDuration, medianFps: ', traceSessionDuration, medianFps);


      const pad = traceScreenshots.length.toString().length;

      const writeFilePromises = traceScreenshots.map(async (snap, index) => {
        const fileName = `./${workdir}/screenshot${String(index).padStart(pad, '0')}.jpeg`;
        await fs.writeFile(fileName, snap.args.snapshot, 'base64');
        return {
          fileName,
          timeDiffWithPrev: snap.timeDiffWithPrev,
        }
      });

      const files = await Promise.all(writeFilePromises);
      spinner.text = 'Screenshots generated!';
      spinner.succeed();
      spinner.stop();


      spinner.text = 'Converting screenshots files to GIF';
      spinner.start();
      await jpegToGifConverter(files);
      spinner.text = 'GIF is created!';
      spinner.succeed();
      spinner.stop();
    } catch (e) {
      console.error('Error:', e);
    }

    spinner.text = 'All is done, search for .gif files';
    spinner.succeed();
    spinner.stop();
  })()

} catch (error) {
  handleError(error, program.debug);
}
