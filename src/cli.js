/* eslint-disable no-console */
const program = require('commander');
const fs = require('fs');
const chalk = require('chalk');
const updateNotifier = require('update-notifier');
const ora = require('ora');
const pkg = require('../package.json');
const handleError = require('./utils/handler-error');
const adjustToRelative = require('./utils/adjust-path-to-relative');
const buildComparison = require('./tasks/build-Comparison');
const { getNetworkList, getNetwork } = require("./utils/networkEmulator");
const { getDeviceList, getDevice } = require("./utils/deviceEmulator");

updateNotifier({ pkg }).notify();

try {
  program
      .version(pkg.version, '-v, --version')
      .usage('[options] <url1 ...> <url2 ...>')
      .arguments('[module]', 'prints module version from the node_modules')
      .option('-d, --debug', 'see full error messages, mostly for debugging')
      .option('-W, --resolution-width <width>', 'define the resolution width in the screen recording',
          width => parseInt(width),)
      .option('-H, --resolution-height <height>', 'define the resolution height in the screen recording',
          height => parseInt(height),)
      .option('-gif, --generate-gif', 'generate gif as additional output')
      .option(
          '-t, --timeout <navigation-timeout>',
          'navigation timeout for loading event in puppeteer',
          value => parseInt(value),
          30000,
      )
      .option(
          '-cs, --custom-script <path-to-file>',
          'add path to custom script that will execute once page is loaded',
      )
      .option(
          '-bw, --disable-colors',
          'minimize color and styling usage in output',
      )
      .option(
          '-N, --network <network>',
          `define the network that will be emulated.\n      Valid list of network: ${getNetworkList()}\n`,
          value => getNetwork (value),
      )
      .option('-D, --device <device>',
          `define the device that will run the screen recording (Override resolution param).\n`+
          `      Valide list of devices: ${getDeviceList()}\n`,
          device => getDevice(device),);


  program.parse(process.argv);

  if (program.args.length < 2) {
    throw new Error(
        'There should be at least two urls as an arguments provided',
    );
  }

  const options = program.opts();
  if (options.customScript) {
    options.customScript = adjustToRelative(options.customScript);
    if (!fs.existsSync(options.customScript)) {
      throw new Error(
          `can't find file from --custom-script ${options.customScript}`,
      );
    }
  }

  const [firstUrl, secondUrl] = program.args;

  (async () => {
    const spinner = ora();

    try {
      await buildComparison([firstUrl, secondUrl], options);
      spinner.succeed('All is done');
      spinner.stop();
    } catch (e) {
      spinner.fail('\nSomething go wrong\n');
      spinner.stop();
      console.error(chalk.bold.red(e.message));
      console.log(chalk.bold.red(e.stack));
      process.exit(1);
    }
  })();
} catch (error) {
  handleError(error, program.debug);
}

async function execute (urls, options) {
  try {
    await buildComparison(urls, options);
    return null;
  }
  catch (e) {
    return e;
  }
}

function devices () {
  return getDeviceList();
}

function networks () {
  return getNetworkList();
}

module.exports = {
  execute,
  devices,
  networks,
};

