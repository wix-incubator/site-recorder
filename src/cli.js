/* eslint-disable no-console */
const program = require('commander');
const chalk = require('chalk');
const updateNotifier = require('update-notifier');
const ora = require('ora');
const pkg = require('../package.json');
const handleError = require('./utils/handler-error');
const compare = require('./compare');

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
      '-bw, --disable-colors',
      'minimize color and styling usage in output',
    );

  

  program.parse(process.argv);

  if (program.args.length < 1) {
    throw new Error(
      'There should be at least one url as an arguments provided',
    );
  }

  const [firstUrl, secondUrl] = program.args;

  (async () => {
    const spinner = ora();

    try {
      const options = program.opts();
      await compare([firstUrl, secondUrl], options);
      spinner.succeed('All is done, search for .gif files');
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
