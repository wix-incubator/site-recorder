/* eslint-disable no-console */
const program = require('commander');
const updateNotifier = require('update-notifier');
const ora = require('ora');
const pkg = require('../package.json');
const handleError = require('./utils/handler-error');
const checkAndCreateDirectory = require('./utils/check-and-create-directory');
const jpegToGifConverter = require('./jpeg-to-gif');
const traceWithScreenshots = require('./trace-with-screeshots');
const extractScreenshotsToJpegFiles = require('./extract-screenshots-to-jpeg-files');


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
      const workdir = 'tmp'; // await tempdir();

      console.log(`Process your url: ${firstUrl}`);
      try {
        await checkAndCreateDirectory(`./${workdir}`);
      } catch (error) {
        if (error) {
          console.log("failed to check and create directory:", error);
          throw error;
        }
      }


      spinner.text = 'Puppeteer generating trace JSON...';
      spinner.start();

      const {traceJsonPath, performanceData} = await traceWithScreenshots(firstUrl, workdir);

      console.log('--  performanceData=',  performanceData);
      spinner.text = 'Puppeteer trace JSON ready!';
      spinner.succeed();
      spinner.stop();


      spinner.text = 'Converting trace JSON to screenshots jpeg files...';
      spinner.start();

      const files = await extractScreenshotsToJpegFiles(traceJsonPath, workdir);

      spinner.text = 'Screenshots generated!';
      spinner.succeed();
      spinner.stop();


      if (program.generateGif) {
        spinner.text = 'Converting screenshots files to GIF';
        spinner.start();

        await jpegToGifConverter(files);

        spinner.text = 'GIF is created!';
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
