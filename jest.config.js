/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  rootDir: 'test',
  testRegex: '.+\\.test\\.tsx?$',
};
