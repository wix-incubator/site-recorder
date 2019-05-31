/**
* @param {PuppeterPage} page - puppeter page object
* @returns {Promise<any>} - promise that resolves once custom script is ready
**/
function longWait(page) {
  return new Promise(resolve => {
    let seconds = 0;
    const handler = setInterval(
      () => (++seconds, console.log(`Wait for: ${seconds}`)),
      1000,
    );
    setTimeout(() => {
      clearInterval(handler);
      resolve();
    }, 3e4);
  });
}
module.exports = longWait;
