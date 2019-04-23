const fs = require('fs').promises;

/**
 * @param {string} directory
 * @returns {Promise<void>}
 */
async function checkAndCreateDirectory(directory) {
  try {
    await fs.stat(directory);
  } catch (err) {
    if (err && err.code === 'ENOENT') {
      await fs.mkdir(directory);
    } else {
      throw new Error(err);
    }
  }
}

module.exports = checkAndCreateDirectory;
