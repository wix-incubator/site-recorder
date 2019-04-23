const rimraf = require('rimraf');

/**
 * @param {string} directory - directory to be deleted
 * @returns {Promise}
 */
function removeDirectory(directory) {
  return new Promise(function(resolve, reject) {
    rimraf(directory, { disableGlob: true }, function(error) {
      if (error) {
        reject(error)
      }
      resolve()
    });
  });
}
module.exports = removeDirectory;
