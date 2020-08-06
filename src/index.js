const buildComparison = require('./tasks/build-Comparison');
const { getNetworkList } = require("./utils/networkEmulator");
const { getDeviceList } = require("./utils/deviceEmulator");

async function execute (urls, options) {
  try {
    await buildComparison(urls, options);
    return null;
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
