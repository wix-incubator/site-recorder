/**
 * @param {Array<number>} array - array of numbers
 * @returns {number} median - median number
 */
function median(array) {
  const mid = Math.floor(array.length / 2);
  const nums = [...array].sort((a, b) => a - b);

  return array.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
}

module.exports = median;
