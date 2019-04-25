const fs = require('fs').promises;
const ora = require('ora');
const median = require('./utils/median');
const checkAndCreateDirectory = require('./utils/check-and-create-directory');
const convertSnapshotTimeToRelative = require('./utils/convert-snapshot-time-to-relative');


/**
 * @param {string} traceJsonPath - directory where trace.json is located
 * @param {string} traceScreenshotsDir - directory where screenshots will be generated
 * @returns {Promise<{medianFps: number, files: {fileName: string, timeDiffWithPrev}[], totalSessionDuration: number}>}
 */
async function extractScreenshotsToJpegFiles(traceJsonPath, traceScreenshotsDir) {
  const traceJson = require(traceJsonPath);
  const spinner = ora('Converting trace JSON to screenshots jpeg files...').start();

  try {
    await checkAndCreateDirectory(traceScreenshotsDir);
  } catch (error) {
    if (error) {
      console.log("failed to check and create directory:", error);
      throw error;
    }
  }

  const traceScreenshots = convertSnapshotTimeToRelative(traceJson.traceEvents).filter(x => (
    x.cat === 'disabled-by-default-devtools.screenshot' &&
    x.name === 'Screenshot' &&
    typeof x.args !== 'undefined' &&
    typeof x.args.snapshot !== 'undefined'
  )).map((snap, index, array) => {
    return {
      ...snap,
      timeDiffWithPrev: index === 0 ? snap.timeFromStart : snap.timeFromStart - array[index - 1].timeFromStart
    }
  });

  const screenshotsFileNamePad = traceScreenshots.length.toString().length;

  const writeFilePromises = traceScreenshots.map(async (snap, index) => {
    const fileName = `${traceScreenshotsDir}/screenshot${String(index).padStart(screenshotsFileNamePad, '0')}.jpeg`;
    await fs.writeFile(fileName, snap.args.snapshot, 'base64');
    return {
      fileName,
      timeDiffWithPrev: snap.timeDiffWithPrev,
    }
  });

  const files = await Promise.all(writeFilePromises);

  spinner.text = 'Screenshots generated!';
  spinner.succeed();
  spinner.stop();
  return {
    files,
    medianFps: median(traceScreenshots.map(el => el.timeDiffWithPrev)),
    totalSessionDuration: traceScreenshots[traceScreenshots.length - 1].timeFromStart,
  };
}

module.exports = extractScreenshotsToJpegFiles;
