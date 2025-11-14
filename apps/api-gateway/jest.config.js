const baseConfig = require('../../jest.config.base');

module.exports = {
  ...baseConfig,
  displayName: 'api-gateway',
  rootDir: '.',
  testEnvironment: 'node',
};
