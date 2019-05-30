const path = require('path');

module.exports = function(filePath) {
  if (filePath.indexOf('.') === 0) {
    return path.join(path.dirname(require.main.filename), filePath);
  }
  return filePath;
};
