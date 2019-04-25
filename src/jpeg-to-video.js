const fs = require('fs');
const ora = require('ora');
const ffmpeg = require('fluent-ffmpeg');
const {microsecondToSeconds} = require('./utils/microseconds-converter');

/**
 * @param {string} videoFilePath - video file path with name
 * @param {number} fps - video fps value
 * @param {Array.<{fileName: string, timeDiffWithPrev: number}>} screenshotsFiles
 * @returns {Promise<void>}
 */
async function jpegToVideoConverter(screenshotsFiles, fps, videoFilePath) {
  const listFileName = 'my_file_list.txt';
  const spinner = ora('Converting screenshots files to video...').start();

  const preparedImageData = screenshotsFiles.map(({fileName,timeDiffWithPrev }) => ({
    file: fileName,
    duration: Math.round(microsecondToSeconds(timeDiffWithPrev) * 100) / 100,
  }));

  const stream = fs.createWriteStream(listFileName);
  stream.once('open', () => {
    preparedImageData.forEach(({file, duration}, index, array) => {
        stream.write(`file '${file}'\n`);
        stream.write(`duration ${duration}\n`);

        if (index === array.length - 1) {
          stream.write(`file '${file}'\n`);
        }
    });
    stream.end();
  });

  console.log('-- ScreenshotsFiles.length=', preparedImageData.length, screenshotsFiles.length);
  console.log('--  preparedImageData[0]=',  preparedImageData[0]);
  console.log('--  preparedImageData[2]=',  preparedImageData[2]);
  console.log('--  preparedImageData[5]=',  preparedImageData[5]);

  return new Promise((resolve, reject) => {
    // ffmpeg(listFileName).inputFormat('concat')
    //                     .on('progress', (progress) => {
    //                       console.info(`[ffmpeg] ${JSON.stringify(progress)}`);
    //                     })
    //                     .on('error', (err) => {
    //                       console.error(`[ffmpeg] error: ${err.message}`);
    //                       reject(err);
    //                     })
    //                     .on('end', () => {
    //                       console.log('[ffmpeg] finished');
    //                       resolve();
    //                     })
    //                     .save('video.mp4');

    const begin = Date.now();
    ffmpeg()
      .input(listFileName)
      .inputFPS(fps)
      .inputOptions(['-f concat', '-safe 0'])
      .outputOptions('-c copy')
      .on('progress', (progress) => {
        spinner.info(`[ffmpeg] ${JSON.stringify(progress)}`);
      })
      .on('error', (err) => {
        spinner.fail(`video generation is failed with: ${err.message}`);
        reject(err);
      })
      .on('end', () => {
        spinner.succeed(`video.mp4 is created in ${(Date.now() - begin)}ms`);
        spinner.stop();
        resolve();
      })
      .save('video.mp4');
  });
}

module.exports = jpegToVideoConverter;
