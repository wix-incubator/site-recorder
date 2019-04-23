/* eslint-disable no-console */
const program = require('commander');
const updateNotifier = require('update-notifier');
const ora = require('ora');
const fs = require('fs').promises;
const leftPad = require('left-pad');
const pkg = require('../package.json');
const handleError = require('./utils/handler-error');
const jpegToGif = require('./jpeg-to-gif');
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
    const spinner = ora('Process your url...').start();

    try {
      const workdir = '/tmp'; // await tempdir();
      const traceJsonPath = await traceWithScreenshots(firstUrl, workdir);
      const traceJson = require(traceJsonPath);
      const convertSnapshotTimeToRelative = (traceEvent, index, allTraceEvents) => {
        let relativeTime = index === 0 ? 0: traceEvent.ts - allTraceEvents[index - 1].ts;

        return {
          ...traceEvent,
          time: relativeTime
        }
      };

      const traceScreenshots = traceJson.traceEvents.map(convertSnapshotTimeToRelative).filter(x => (
        x.cat === 'disabled-by-default-devtools.screenshot' &&
        x.name === 'Screenshot' &&
        typeof x.args !== 'undefined' &&
        typeof x.args.snapshot !== 'undefined'
      ));
      const pad = traceScreenshots.length.toString().length;

      const generatedFiles = [];

      const writeFilePromises = traceScreenshots.map((snap, index) => {
        const fileName = `${workdir}/screenshot${leftPad(index, pad, '0')}.jpeg`;
        const result = {
          screenshot: snap.args.snapshot,
          time: snap.time,
        };

        console.log('--  result=',  result);

        generatedFiles.push(fileName);
        return fs.writeFile(fileName, result.screenshot, 'base64');
      });

      console.log('generated file paths', generatedFiles);

      await Promise.all(writeFilePromises);
      jpegToGif(`..${workdir}/**.jpeg`);
      console.log('All files are written');

    } catch(e) {
      console.error('Error:', e);
    }

    spinner.text = 'Screenshots are taken';
    spinner.succeed();
    spinner.stop();
  })()

} catch (error) {
  handleError(error, program.debug);
}
