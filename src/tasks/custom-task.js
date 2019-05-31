const fs = require('fs');
const adjustPathToRelative = require('../utils/adjust-path-to-relative');

function customTask(page, scriptPath) {
  const fullPath = adjustPathToRelative(scriptPath);
  if (!fs.existsSync(fullPath)) {
    throw `Can't find custom script at ${scriptPath}`;
  }

  const execTask = require(fullPath);
  const execution = execTask(page);
  if (!(execution.then || execution.catch)) {
    throw 'Custom task script should return promise!';
  }
  return execution;
}

module.exports = customTask;
