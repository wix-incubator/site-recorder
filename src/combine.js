
const traceJsonToJpeg = require('./trace-json-to-jpeg');
const jpegToGifConverter = require('./jpeg-to-gif');
const jpegToVideoConverter = require('./jpeg-to-video');

/**
 * @param {Array.<{url: string, directory: string, traceJsonPath: string, directory: string }>} taskResults - list of urls to trace
 * @param {Object} options - cli options
 * @returns {Promise<Promise[]>} - set of conversion processes
 */

async function combine(taskResults, options) {
    const converters = [
      { enabled: options.generateGif, converter: jpegToGifConverter },
      { enabled: options.generateVideo, converter: jpegToVideoConverter },
    ];
    const conversions = taskResults.map(async taskResult => {
      options.debug && console.log('--  performanceData=', taskResult.performanceData);
  
      const screenshotsResult = await traceJsonToJpeg(taskResult);
  
      return Promise.all(
        converters
          .filter(({ enabled }) => enabled)
          .map(({ converter }) => converter(screenshotsResult)),
      );
    });
    return Promise.all(conversions);
  }
  
  module.exports = combine;