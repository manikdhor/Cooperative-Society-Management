const baseConfig = require('../../jest.config.base');

module.exports = {
  ...baseConfig,
  displayName: 'member-service',
  rootDir: '.',
  testEnvironment: 'node',
};
