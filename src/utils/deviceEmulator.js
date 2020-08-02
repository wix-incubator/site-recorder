const devices = require('puppeteer/DeviceDescriptors');

const getDeviceList = () => {
  const listOfDevices = Object.keys(devices);
  return listOfDevices
      .filter(deviceName => deviceName.length>3)
      .map(deviceName => deviceName.replace(' ','_'));
};

const getDevice = (deviceParam) => {
  const deviceName = deviceParam.replace('_', ' ');
  const puppeteerDevice = devices[deviceName];

  if (!puppeteerDevice) {
    throw new Error(
        `can't find valid device for "${deviceName}".\nPlease choose one of the following devices: ${getDeviceList()}`,
    );
  }
  return deviceName;
}

module.exports = { getDeviceList, getDevice };
