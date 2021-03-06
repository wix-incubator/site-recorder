const chalk = require('chalk');
const os = require('os');
const checkAndCreateDirectory = require('../utils/check-and-create-directory');
const cleanDir = require('../utils/clean-dir');

async function generateFolders(urls) {
  console.log(chalk.green('Prepare temporary folder for sites compare'));

  const tmpdir = os.tmpdir();
  const workTmpDir = `${tmpdir}/site-recorder`;

  try {
    await checkAndCreateDirectory(workTmpDir);
    return buildTasks(urls, workTmpDir);
  } catch (error) {
    console.log(
      chalk.bold.red(
        `failed to check and create directory or it's subfolders: ${workTmpDir}`,
      ),
    );
    throw error;
  }
}

async function buildTasks(urls, workTmpDir) {
  const tasks = [];

  for (let i = 0; i < urls.length; i++) {
    let traceScreenshotsDir = `${workTmpDir}/site_${i}`;

    await checkAndCreateDirectory(traceScreenshotsDir);
    await cleanDir(traceScreenshotsDir);

    tasks.push({
      url: urls[i],
      directory: traceScreenshotsDir,
    });
  }
  return tasks;
}

module.exports = generateFolders;
