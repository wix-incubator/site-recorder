const fs = require('fs');
const { spawn } = require('child_process');

const FILE_GIF = './mygif.gif';

jest.setTimeout(20000000);

test('Check that the new gif file is created', () => {
  try {
    fs.accessSync(FILE_GIF); // check if file exists
    fs.unlinkSync(FILE_GIF); // before test remove gif if it's exists
  } catch (err) {
    // do nothing
  }

  const child = spawn('node', [
    './src/cli.js',
    'http://ronnyr34.wixsite.com/mysite-1',
    'http://ronnyr34.wixsite.com/mysite-1',
    '--generate-gif',
  ]);

  return new Promise((resolve, reject) => {
    // debug
    child.stdout.pipe(process.stdout);

    child.on('exit', function(code, signal) {
      console.log(
        'child process exited with ' + `code ${code} and signal ${signal}`,
      );
      fs.access(FILE_GIF, fs.constants.F_OK, err => {
        expect(err).toBe(null);
        resolve();
      });
    });
    child.on('error', function(code, signal) {
      console.error(
        'child process exited with ' + `code ${code} and signal ${signal}`,
      );
      reject();
    });
  });
});
