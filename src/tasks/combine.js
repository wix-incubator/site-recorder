const jpegToGifConverter = require('../converters/jpeg-to-gif');
const makeVideosAndConcatenate = require('../converters/make-videos');
/**
 * @param {Array.<{files: {fileName: string, timeDiffWithPrev: number, directory: string }[], }>} screenshotsResults - list of urls to trace
 * @param {Object} options - cli options
 * @returns {Promise<Promise[]>} - set of conversion processes
 */

function combine(screenshotsResults, options) {
  const converters = [
    { enabled: options.generateGif, converter: jpegToGifConverter },
    { enabled: options.generateVideo, converter: makeVideosAndConcatenate },
  ];

  // TODO Should we stop making video if gif has failed?
  return Promise.all(converters
    .filter(({ enabled }) => enabled)
    .map(({ converter }) => converter(screenshotsResults, options)));
}

module.exports = combine;
