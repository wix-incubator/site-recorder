/* eslint-disable no-console */
const program = require('commander');
const fs = require('fs');
const chalk = require('chalk');
const updateNotifier = require('update-notifier');
const ora = require('ora');
const pkg = require('../package.json');
const handleError = require('./utils/handler-error');
const adjustToRelative = require('./utils/adjust-path-to-relative');
const buildCompairson = require('./tasks/build-compairson');

updateNotifier({ pkg }).notify();

try {
  program
    .version(pkg.version, '-v, --version')
    .usage('[options] <url1 ...> <url2 ...>')
    .arguments('[module]', 'prints module version from the node_modules')
    .option('-d, --debug', 'see full error messages, mostly for debugging')
    .option('-g, --generate-gif', 'should gif be generated')
    .option('-v, --generate-video', 'should video be generated')
    .option(
      '-cs, --custom-script [path-to-file]',
      'add path to custom script that will execute once page is loaded',
    )
    .option(
      '-bw, --disable-colors',
      'minimize color and styling usage in output',
    );

  program.parse(process.argv);

  if (program.args.length < 1) {
    throw new Error(
      'There should be at least one url as an arguments provided',
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

  // TODO check that 2 urls are provided
  const [firstUrl, secondUrl] = program.args;

  (async () => {
    const spinner = ora();

    try {
      await buildCompairson([firstUrl, secondUrl], options);
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
