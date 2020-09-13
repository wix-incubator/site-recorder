const buildComparison = require('./tasks/build-comparison');
const { getNetworkList } = require("./utils/networkEmulator");
const { getDeviceList } = require("./utils/deviceEmulator");

async function execute (urls, options) {
  try {
    const task = await buildComparison(urls, options);
    return task;
  }
  catch (e) {
    return e;
  }
}

function devices () {
  return getDeviceList();
}

function networks () {
  return getNetworkList();
}

module.exports = {
  execute,
  devices,
  networks,
};
