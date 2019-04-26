module.exports = function (wallaby) {
  return {
    files: [
      'src/**/**.js',
      '!src/**/*.test.js'
    ],

    tests: [
      'src/**/*unit.test.js'
    ],
    env: {
      type: 'node',
      runner: 'node'
    },

    testFramework: 'jest'
  };
};
