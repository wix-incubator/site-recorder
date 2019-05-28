const chulk = require('chalk');
const os = require('os');
const checkAndCreateDirectory = require('./utils/check-and-create-directory');
const concatenateVideos = require('./concatenate-videos');
const cleanDir = require('./utils/clean-dir');

async function prepare(urls) {
  console.log(chulk.green('Prepare temporary folder for sites compare'));

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
    let traceScreenshotsDir = `${workTmpDir}/screenshots_${i}`;

    await checkAndCreateDirectory(traceScreenshotsDir);
    await cleanDir(traceScreenshotsDir);

    tasks.push({
      url: urls[i],
      directory: traceScreenshotsDir,
    });
  }
  return tasks;
}

module.exports = prepare;
