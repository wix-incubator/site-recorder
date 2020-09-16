const fs = require('fs');
const path = require('path');
const ora = require('ora');
const ffmpeg = require('fluent-ffmpeg');
const { microsecondToSeconds } = require('../utils/microseconds-converter');

/**
 * @param {Object} screenshotsResult
 * @param {number} screenshotsResult.medianFps - video fps value
 * @param {string} screenshotsResult.directory - temporary folder for comparison aggregation
 * @param {Array.<{fileName: string, timeDiffWithPrev: number>} screenshotsResult.screenshotsFiles
 * @returns {Promise<void>}
 */
async function jpegToVideoConverter({ files, medianFps, directory }) {
  const listFileName = path.join(directory, 'my_file_list.txt');
  const spinner = ora('Converting screenshots files to video...').start();
  const videoFilePath = path.join(directory, 'video.mp4');
  const preparedImageData = files.map(({ fileName, timeDiffWithPrev }) => ({
    file: fileName,
    duration: Math.round(microsecondToSeconds(timeDiffWithPrev) * 100) / 100,
  })).filter(f => f.duration < 5); //w puppeteer@5 some timeDiffWithPrev returned too large

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
        resolve(videoFilePath);
      })
      .save(videoFilePath);
  });
}

module.exports = jpegToVideoConverter;
