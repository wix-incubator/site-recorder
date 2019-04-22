/* eslint-disable no-console */
const { spawn } = require('child_process');
const program = require('commander');
const updateNotifier = require('update-notifier');
const pkg = require('../package.json');
const videoWithWebRTC = require('./videoWithWebRTC');
const traceWithScreenshots = require('./traceWithScreeshots');
const ora = require('ora');

const handleError = require('./handler-error');

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
      await Promise.all([traceWithScreenshots(firstUrl), videoWithWebRTC(firstUrl)]);
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
