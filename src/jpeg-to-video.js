const videoshow = require('videoshow');
const {microsecondToSeconds} = require('./utils/microseconds-converter');

/**
 * @param {string} videoFilePath - video file path with name
 * @param {Array.<{fileName: string, timeDiffWithPrev: number}>} screenshotsFiles
 * @returns {Promise<void>}
 */
async function jpegToVideoConverter(screenshotsFiles, videoFilePath) {
  const videoOptions = {
    fps: 25,
    transition: false,
    videoCodec: 'libx264',
    size: '640x?',
    pixelFormat: 'yuv420p'
  };

  const preparedImageData = screenshotsFiles.map(screenshot => ({
    path: screenshot.fileName,
    disableFadeOut: true,
    loop: Math.round(microsecondToSeconds(screenshot.timeDiffWithPrev) * 1000) / 1000,
  }));

  console.log('-- ScreenshotsFiles.length=', screenshotsFiles.length, preparedImageData.length);
  console.log('--  preparedImageData[0]=',  preparedImageData[0]);
  console.log('--  preparedImageData[2]=',  preparedImageData[2]);
  console.log('--  preparedImageData[5]=',  preparedImageData[5]);
  return new Promise((resolve, reject) => {
    videoshow(preparedImageData, videoOptions)
      .save('video.mp4')
      .on('start', function (command) {
        console.log('ffmpeg process started:', command);
      })
      .on('error', function (err) {
        console.error('Error:', err);
        reject(err);
      })
      .on('end', function (output) {
        console.log('Video created in:', output);
        resolve(output);
      })
  });
}

module.exports = jpegToVideoConverter;
