const path = require('path');

module.exports = function(filePath) {
  if (!path.isAbsolute(filePath)) {
    return path.join(path.dirname(require.main.filename), filePath);
  }
  return filePath;
};
