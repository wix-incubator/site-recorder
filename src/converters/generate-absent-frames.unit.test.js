const generateAbsentFrames = require('./generate-absent-frames');


test('should return 1', () => {
  expect(generateAbsentFrames([{}])).toBe(2)
})
