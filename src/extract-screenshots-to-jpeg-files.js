const fs = require('fs').promises;
const median = require('./utils/median');
const checkAndCreateDirectory = require('./utils/check-and-create-directory');
const convertSnapshotTimeToRelative = require('./utils/convert-snapshot-time-to-relative');


async function extractScreenshotsToJpegFiles(traceJsonPath, workdir) {
  const traceJson = require(traceJsonPath);
  const screenshotsFolder = `./${workdir}/trace-screenshots`;

  try {
    await checkAndCreateDirectory(screenshotsFolder);
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
      timeDiffWithPrev: index === 0 ? 0 : snap.timeFromStart - array[index - 1].timeFromStart
    }
  });

  const medianFps = median(traceScreenshots.map(el => el.timeDiffWithPrev));
  const traceSessionDuration = traceScreenshots[traceScreenshots.length - 1].timeFromStart;

  const pad = traceScreenshots.length.toString().length;

  const writeFilePromises = traceScreenshots.map(async (snap, index) => {
    const fileName = `${screenshotsFolder}/screenshot${String(index).padStart(pad, '0')}.jpeg`;
    await fs.writeFile(fileName, snap.args.snapshot, 'base64');
    return {
      fileName,
      timeDiffWithPrev: snap.timeDiffWithPrev,
    }
  });

  const files = await Promise.all(writeFilePromises);

  return {
    files,
    medianFps,
    traceSessionDuration
  };
}

module.exports = extractScreenshotsToJpegFiles;
