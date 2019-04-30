const path = require('path');
const fs = require('fs');
const util = require('util');

const readdir = util.promisify(fs.readdir);
const unlink = util.promisify(fs.unlink);

async function cleanDir(pathToDir) {
  const list = await readdir(pathToDir);
  for (let item of list) {
    try {
      await unlink(path.join(pathToDir, item))
    } catch(e) {
      console.error(e);
    }
  }
}

module.exports = cleanDir;
