const ffmpeg = require('fluent-ffmpeg');
const ora = require('ora');
const adjustToRelative = require('../utils/adjust-path-to-relative');
async function concatenateVideos(firstVideo, secondVideo) {
  console.log(`\nConcatenating videos: ${firstVideo} && ${secondVideo}\n`);
  const spinner = ora(
    `\nConcatenating videos: ${firstVideo} && ${secondVideo}\n`,
  ).start();

  const begin = Date.now();

  await new Promise((resolve, reject) => {
    ffmpeg()
      .input(firstVideo)
      .input(secondVideo)
      .complexFilter(['hstack'])
      .on('progress', progress => {
        spinner.info(`[ffmpeg] ${JSON.stringify(progress)}`);
      })
      .on('error', err => {
        spinner.fail(`video merging is failed with: ${err.message}`);
        reject(err);
      })
      .on('end', () => {
        spinner.succeed(
          `merged output.mp4 is created in ${Date.now() - begin}ms`,
        );
        spinner.stop();
        resolve();
      })
      .save('output.mp4');
  });
  return adjustToRelative('../output.mp4');
}
module.exports = concatenateVideos;
