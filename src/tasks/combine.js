const makeVideosAndConcatenate = require('../converters/make-videos');
const videoToGif =  require('../converters/video-to-gif');
/**
 * @param {Array.<{files: {fileName: string, timeDiffWithPrev: number, directory: string }[], }>} screenshotsResults - list of urls to trace
 * @param {Object} options - cli options
 * @returns {Promise<Promise[]>} - set of conversion processes
 */

async function combine(screenshotsResults, options) {
  const videoFilePath = await makeVideosAndConcatenate(screenshotsResults, options);
  if(options.generateGif) {
    await videoToGif(videoFilePath);
  }
}

module.exports = combine;
