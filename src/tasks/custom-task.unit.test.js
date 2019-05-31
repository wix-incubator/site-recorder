const customTask = require('./custom-task');

describe('custom task', () => {
  test(`should fail if custom script didn't return promise`, async () => {
    expect.assertions(1);
    try {
      await customTask({}, './__mocks__/invalid-custom-task.js');
    } catch (error) {
      expect(error).toMatch('Custom task script should return promise!');
    }
  });

  test(`should fail if custom script doesn't exist or could not be loaded`, async () => {
    const customScriptPath = './__mocks__/some-path.js';
    expect.assertions(1);
    try {
      await customTask({}, customScriptPath);
    } catch (error) {
      expect(error).toMatch(`Can't find custom script at ${customScriptPath}`);
    }
  });
});
