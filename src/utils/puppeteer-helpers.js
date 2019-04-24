const extractDataFromPerformanceTiming = (timing, ...dataNames) => {
  const navigationStart = timing.navigationStart;

  const extractedData = {};
  dataNames.forEach(name => {
    extractedData[name] = timing[name] - navigationStart;
  });

  //results are in [ms]
  return extractedData;
};

const getTimeFromPerformanceMetrics = (metrics, name) =>
  Math.round(metrics.metrics.find(x => x.name === name).value * 1000);

const extractDataFromPerformanceMetrics = (metrics, ...dataNames) => {
  const navigationStart = getTimeFromPerformanceMetrics(
    metrics,
    'NavigationStart'
  );

  const extractedData = {};
  dataNames.forEach(name => {
    extractedData[name] =
      getTimeFromPerformanceMetrics(metrics, name) - navigationStart;
  });

  return extractedData;
};

module.exports = {
  getTimeFromPerformanceMetrics,
  extractDataFromPerformanceTiming,
  extractDataFromPerformanceMetrics,
};
