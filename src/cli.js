/* eslint-disable no-console */
const program = require('commander');
const updateNotifier = require('update-notifier');
const ora = require('ora');
const pkg = require('../package.json');
const handleError = require('./utils/handler-error');
const checkAndCreateDirectory = require('./utils/check-and-create-directory');
const traceWithScreenshots = require('./trace-with-screeshots');
const extractScreenshotsToJpegFiles = require('./extract-screenshots-to-jpeg-files');
const jpegToGifConverter = require('./jpeg-to-gif');
const jpegToVideoConverter = require('./jpeg-to-video');


updateNotifier({ pkg }).notify();

try {
  program
    .version(pkg.version, '-v, --version')
    .usage('[options] <url1 ...> <url2 ...>')
    .arguments('[module]', 'prints module version from the node_modules')
    .option('-d, --debug', 'see full error messages, mostly for debugging')
    .option('--generate-gif', 'should gif be generated')
    .option('--generate-video', 'should video be generated')
    .option('--disable-colors', 'minimize color and styling usage in output');

  program.parse(process.argv);

  // if (program.args.length < 2) {
  //   throw new Error('There should be two urls as an arguments');
  // }

  (async () => {
    const [firstUrl] = program.args;
    const spinner = ora();


    try {
      const workDir = 'tmp'; // await tempdir();
      const traceScreenshotsDir = `${workDir}/trace-screenshots`;
      // const puppeteerScreenshotsDir = `${workDir}/ppptr-screenshots`;

      console.log(`Process your url: ${firstUrl}`);
      try {
        await checkAndCreateDirectory(`./${workDir}`);
        await checkAndCreateDirectory(`./${traceScreenshotsDir}`);
      } catch (error) {
        if (error) {
          console.log("failed to check and create directory:", error);
          throw error;
        }
      }


      spinner.text = 'Puppeteer generating trace JSON...';
      spinner.start();

      const {traceJsonPath, performanceData} = await traceWithScreenshots(firstUrl, workDir);

      console.log('--  performanceData=',  performanceData);
      spinner.text = 'Puppeteer trace JSON ready!';
      spinner.succeed();
      spinner.stop();


      spinner.text = 'Converting trace JSON to screenshots jpeg files...';
      spinner.start();

      const screenshotsResult = await extractScreenshotsToJpegFiles(traceJsonPath, traceScreenshotsDir);

      spinner.text = 'Screenshots generated!';
      spinner.succeed();
      spinner.stop();


      if (program.generateGif) {
        spinner.text = 'Converting screenshots files to GIF';
        spinner.start();

        await jpegToGifConverter(screenshotsResult.files);

        spinner.text = 'GIF is created!';
        spinner.succeed();
        spinner.stop();
      }

      if (program.generateVideo) {
        spinner.text = 'Converting screenshots files to video';
        spinner.start();

        await jpegToVideoConverter(screenshotsResult.files);

        spinner.text = 'video.mp4 is created!';
        spinner.succeed();
        spinner.stop();
      }

      spinner.text = 'All is done, search for .gif files';
      spinner.succeed();
      spinner.stop();
    } catch (e) {
      console.error('Error:', e);
      spinner.text = 'Something go wrong';
      spinner.fail();
      spinner.stop();
    }
  })()

} catch (error) {
  handleError(error, program.debug);
}
