/* eslint-disable no-console */
const program = require('commander');
const updateNotifier = require('update-notifier');
const ora = require('ora');
const os = require('os');
const pkg = require('../package.json');
const handleError = require('./utils/handler-error');
const checkAndCreateDirectory = require('./utils/check-and-create-directory');
const puppeteerTraceWithScreenshots = require('./puppeteer-trace-with-screeshots');
const traceJsonToJpeg = require('./trace-json-to-jpeg');
const jpegToGifConverter = require('./jpeg-to-gif');
const jpegToVideoConverter = require('./jpeg-to-video');
const concatenateVideos = require('./concatenate-videos');
const cleanDir = require('./utils/clean-dir');

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

  if (program.args.length < 1) {
    throw new Error('There should be at least one url as an arguments provided');
  }

  const [firstUrl, secondUrl] = program.args;

  (async () => {
    const spinner = ora();


    try {
      const tmpdir = os.tmpdir();
      const workTmpDir = `${tmpdir}/site-recorder`;
      const traceScreenshotsDir = `${workTmpDir}/trace-screenshots`;

      console.log(`Process your url: ${firstUrl}`);
      try {
        await checkAndCreateDirectory(workTmpDir);
        await checkAndCreateDirectory(traceScreenshotsDir);
        await cleanDir(traceScreenshotsDir);
      } catch (error) {
        if (error) {
          console.log("failed to check and create directory:", error);
          throw error;
        }
      }

      let traceJsonPath = `${workTmpDir}/trace.json`;
      let performanceData = {};

      const traceResults = await puppeteerTraceWithScreenshots(firstUrl, workTmpDir, {width: 1280, height: 720, tracePerformance: true});
      traceJsonPath = traceResults.traceJsonPath;
      performanceData = traceResults.performanceData;

      console.log('--  performanceData=',  performanceData);

      const screenshotsResult = await traceJsonToJpeg(traceJsonPath, traceScreenshotsDir);

      if (program.generateGif) {
        await jpegToGifConverter(screenshotsResult.files);
      }

      if (program.generateVideo) {
        await jpegToVideoConverter(screenshotsResult.files, screenshotsResult.medianFps, `video.mp4`);
        // await concatenateVideos('video1.mp4', 'video2.mp4') NOTE: concanetation works.
        // TODO: Use produced videos as filenames for concantenation
      }

      spinner.succeed('All is done, search for .gif files');
      spinner.stop();
    } catch (e) {
      console.error('Error:', e);
      spinner.fail('Something go wrong');
      spinner.stop();
    }
  })();

} catch (error) {
  handleError(error, program.debug);
}
