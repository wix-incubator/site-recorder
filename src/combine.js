const jpegToGifConverter = require('./jpeg-to-gif');
const jpegToVideoConverter = require('./jpeg-to-video');

/**
 * @param {Array.<{files: {fileName: string, timeDiffWithPrev: number}[], }>} screenshotsResults - list of urls to trace
 * @param {Object} options - cli options
 * @returns {Promise<Promise[]>} - set of conversion processes
 */

async function combine(screenshotsResults, options) {
  const converters = [
    { enabled: options.generateGif, converter: jpegToGifConverter },
    { enabled: options.generateVideo, converter: jpegToVideoConverter },
  ];

  const conversions = screenshotsResults.map(async screenshotsResult => {
    return Promise.all(
      converters
        .filter(({ enabled }) => enabled)
        .map(({ converter }) => converter(screenshotsResult)),
    );
  });
  return Promise.all(conversions);
}

module.exports = combine;
