const fs = require('fs');

/**
 * @param {string} directory
 * @returns {Promise<any>}
 */
function checkAndCreateDirectory(directory) {
  return new Promise(function(resolve, reject) {
    fs.stat(directory, function(err, stats) {
      //Check if error defined and the error code is "not exists"
      if (err && err.errno === 34) {
        //Create the directory, call the callback.
        fs.mkdir(directory, resolve);
      } else {
        //just in case there was a different error:
        reject(err)
      }
    });
  });
}

module.exports = checkAndCreateDirectory;
