const fs = require('fs').promises;
const ora = require('ora');
const chalk = require('chalk');
const median = require('../utils/median');
const checkAndCreateDirectory = require('../utils/check-and-create-directory');
const convertSnapshotTimeToRelative = require('../utils/convert-snapshot-time-to-relative');

/**
 * @param {<traceJsonPath: string, directory: string>} taskResult - directory where trace.json is located
 * @returns {Promise<{medianFps: number, files: {fileName: string, timeDiffWithPrev}[], totalSessionDuration: number}>}
 */
async function traceJsonToJpeg({ traceJsonPath, directory }) {
  const traceJson = require(traceJsonPath);
  const spinner = ora(
    'Converting trace JSON to screenshots jpeg files...',
  ).start();

  try {
    await checkAndCreateDirectory(directory);
  } catch (error) {
    if (error) {
      console.log(chalk.red(`\nfailed to check and create directory: ${directory}`));
      throw error;
    }
  }

  const traceScreenshots = convertSnapshotTimeToRelative(traceJson.traceEvents)
    .filter(
      x =>
        x.cat === 'disabled-by-default-devtools.screenshot' &&
        x.name === 'Screenshot' &&
        typeof x.args !== 'undefined' &&
        typeof x.args.snapshot !== 'undefined',
    )
    .map((snap, index, array) => {
      return {
        ...snap,
        timeDiffWithPrev:
          index === 0
            ? snap.timeFromStart
            : snap.timeFromStart - array[index - 1].timeFromStart,
      };
    });

  const screenshotsFileNamePad = traceScreenshots.length.toString().length;

  const writeFilePromises = traceScreenshots.map(async (snap, index) => {
    const fileName = `${directory}/screenshot${String(index).padStart(
      screenshotsFileNamePad,
      '0',
    )}.jpeg`;
    await fs.writeFile(fileName, snap.args.snapshot, 'base64');
    return {
      fileName,
      timeDiffWithPrev: snap.timeDiffWithPrev,
    };
  });

  const files = await Promise.all(writeFilePromises);

  spinner.text = 'Screenshots generated!';
  spinner.succeed();
  spinner.stop();
  return {
    files,
    directory,
    medianFps: median(traceScreenshots.map(el => el.timeDiffWithPrev)),
    totalSessionDuration:
      traceScreenshots[traceScreenshots.length - 1].timeFromStart,
  };
}

module.exports = traceJsonToJpeg;
