const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

async function convertToGif(videoFilePath) {
  const outFilename = videoFilePath.replace(
    path.extname(videoFilePath),
    '.gif',
  );
  await ffmpeg(videoFilePath)
    .outputOption('-vf', 'fps=15')
    .save(outFilename);

  return outFilename;
}

module.exports = convertToGif;
