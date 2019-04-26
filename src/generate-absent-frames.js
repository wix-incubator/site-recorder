const DEFAULT_FRAME_RATE = 60;

/**
 * TODO: To be able to concat 2 gifs side by side, we should
 * set static frame rate (FPS, ex. 60 FPS) and generate(copy)
 * frames where the image didn't change
 *
 * @param {Object[]} files - files
 * @param {string} files[].fileName - file path
 * @param {number} files[].timeDiffWithPrev - time for delay from previous frame in microseconds
 */
function generateAbsentFrames(files) {

  return 2;
}

module.exports = generateAbsentFrames;
