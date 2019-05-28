const fs = require('fs');
const ora = require('ora');
const ffmpeg = require('fluent-ffmpeg');
const { microsecondToSeconds } = require('./utils/microseconds-converter');

/**
 * @param {Object} screenshotsResult
 * @param {string} screenshotsResult.videoFilePath - video file path with name
 * @param {number} screenshotsResult.medianFps - video fps value
 * @param {Array.<{fileName: string, timeDiffWithPrev: number}>} screenshotsResult.screenshotsFiles
 * @returns {Promise<void>}
 */
async function jpegToVideoConverter({
  files,
  medianFps,
  videoFilePath = 'video.mp4',
}) {
  const listFileName = 'my_file_list.txt';
  const spinner = ora('Converting screenshots files to video...').start();

  const preparedImageData = files.map(
    ({ fileName, timeDiffWithPrev }) => ({
      file: fileName,
      duration: Math.round(microsecondToSeconds(timeDiffWithPrev) * 100) / 100,
    }),
  );

  const stream = fs.createWriteStream(listFileName);
  stream.once('open', () => {
    preparedImageData.forEach(({ file, duration }, index, array) => {
      stream.write(`file '${file}'\n`);
      stream.write(`duration ${duration}\n`);

      if (index === array.length - 1) {
        stream.write(`file '${file}'\n`);
      }
    });
    stream.end();
  });

  console.log(
    '-- ScreenshotsFiles.length=',
    preparedImageData.length,
    files.length,
  );
  console.log('--  preparedImageData[0]=', preparedImageData[0]);
  console.log('--  preparedImageData[2]=', preparedImageData[2]);
  console.log('--  preparedImageData[5]=', preparedImageData[5]);

  return new Promise((resolve, reject) => {
    const begin = Date.now();
    ffmpeg()
      .input(listFileName)
      .inputFPS(medianFps)
      .inputOptions(['-f concat', '-safe 0'])
      .outputOptions('-c copy')
      .on('progress', progress => {
        spinner.info(`[ffmpeg] ${JSON.stringify(progress)}`);
      })
      .on('error', err => {
        spinner.fail(`video generation is failed with: ${err.message}`);
        reject(err);
      })
      .on('end', () => {
        spinner.succeed(`video.mp4 is created in ${Date.now() - begin}ms`);
        spinner.stop();
        resolve();
      })
      .save(videoFilePath);
  });
}

module.exports = jpegToVideoConverter;
