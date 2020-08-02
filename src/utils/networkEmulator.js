let NETWORK_PRESETS = {
  'GPRS': {
    'name': 'GPRS',
    'offline': false,
    'downloadThroughput': 50 * 1024 / 8,
    'uploadThroughput': 20 * 1024 / 8,
    'latency': 500
  },
  'Regular2G': {
    'name': 'Regular2G',
    'offline': false,
    'downloadThroughput': 250 * 1024 / 8,
    'uploadThroughput': 50 * 1024 / 8,
    'latency': 300
  },
  'Good2G': {
    'name': 'Good2G',
    'offline': false,
    'downloadThroughput': 450 * 1024 / 8,
    'uploadThroughput': 150 * 1024 / 8,
    'latency': 150
  },
  'Regular3G': {
    'name': 'Regular3G',
    'offline': false,
    'downloadThroughput': 750 * 1024 / 8,
    'uploadThroughput': 250 * 1024 / 8,
    'latency': 100
  },
  'Good3G': {
    'name': 'Good3G',
    'offline': false,
    'downloadThroughput': 1.5 * 1024 * 1024 / 8,
    'uploadThroughput': 750 * 1024 / 8,
    'latency': 40
  },
  'Regular4G': {
    'name': 'Regular4G',
    'offline': false,
    'downloadThroughput': 4 * 1024 * 1024 / 8,
    'uploadThroughput': 3 * 1024 * 1024 / 8,
    'latency': 20
  },
  'DSL': {
    'name': 'DSL',
    'offline': false,
    'downloadThroughput': 2 * 1024 * 1024 / 8,
    'uploadThroughput': 1 * 1024 * 1024 / 8,
    'latency': 5
  },
  'WiFi': {
    'name': 'WiFi',
    'offline': false,
    'downloadThroughput': 30 * 1024 * 1024 / 8,
    'uploadThroughput': 15 * 1024 * 1024 / 8,
    'latency': 2
  }
}

const getNetworkList = () => {
  return (Object.keys(NETWORK_PRESETS))
}

const getNetwork = (networkParam) => {
  const puppeteerNetwork = NETWORK_PRESETS[networkParam];

  if (!puppeteerNetwork) {
    throw new Error(
        `can't find valid network for "${networkParam}"\nPlease choose one of the following networks: ${getNetworkList()}`,
    );
    return undefined;
  }
  return puppeteerNetwork;
}

module.exports = { getNetworkList, getNetwork };
