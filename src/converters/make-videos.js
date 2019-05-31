const jpegToVideoConverter = require('./jpeg-to-video');
const concatenateVideos = require('./concatenate-videos');

/**
 * @param {Array.<{files: {fileName: string, timeDiffWithPrev: number, directory: string }[], }>} screenshotsResults - list of urls to trace
 * @param {Object} options - cli options
 * @returns {Promise<Promise[]>} - set of conversion processes
 */
async function makeVideosAndConcatenate(screenshotResults, options) {
  if (screenshotResults.length > 2) {
    throw new Error(`Application doesn't support more than 2 urls`);
  }
  const videosFilePath = await Promise.all(
    screenshotResults.map(screenshotResult =>
      jpegToVideoConverter(screenshotResult, options),
    ),
  );
  return concatenateVideos(...videosFilePath);
}

module.exports = makeVideosAndConcatenate;
