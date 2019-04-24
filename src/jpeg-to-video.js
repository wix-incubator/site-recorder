const videoshow = require('videoshow');
const {microsecondToSeconds} = require('./utils/microseconds-converter');

/**
 * /**
 * @param {Array.<{fileName: string, timeDiffWithPrev: number}>} screenshotsFiles
 * @returns {Promise<void>}
 */
async function jpegToVideoConverter(screenshotsFiles) {
  const options = {};

  const preparedImageData = screenshotsFiles.map(screenshot => ({
    path: screenshot.fileName,
    loop:  Math.floor(microsecondToSeconds(screenshot.timeDiffWithPrev) * 100) / 100 ,
  }));

  console.log('-- ScreenshotsFiles.length=', screenshotsFiles.length, preparedImageData.length);
  console.log('--  preparedImageData[0]=',  preparedImageData[0]);
  console.log('--  preparedImageData[2]=',  preparedImageData[2]);
  console.log('--  preparedImageData[5]=',  preparedImageData[5]);

  return new Promise((resolve, reject) => {
    videoshow(preparedImageData, options)
      .save('video.mp4')
      .on('start', function (command) {
        //command - the real command to ffpeg
        console.log('ffmpeg process started:', command)
      })
      .on('error', function (err) {
        console.error('Error:', err);
        reject(err);
      })
      .on('end', function (output) {
        resolve(output);
        console.log('Video created in:', output)
      })
  });
}

module.exports = jpegToVideoConverter;
