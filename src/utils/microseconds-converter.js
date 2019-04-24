
function microsecondToMilliseconds(microsecond) {
  return microsecond / 1000;
}

function microsecondToSeconds(microsecond) {
  return microsecondToMilliseconds(microsecond) / 1000;
}

module.exports = {
  microsecondToSeconds,
  microsecondToMilliseconds,
};
