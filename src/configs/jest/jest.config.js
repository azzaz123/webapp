// This file contains the definition of the configuration passed to jest
// Note: this will load the jest-preset-angular file (jest.config.ts)

const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('../../../tsconfig');
const mappedPaths = pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/src/' });

module.exports = {
  rootDir: "../../../",
  preset: "jest-preset-angular",
  setupFilesAfterEnv: [
    "<rootDir>/src/configs/jest/jest.config.ts"
  ],
  globals: {
    "ts-jest": {
      "tsConfig": "<rootDir>/src/tsconfig.spec.json"
    }
  },
  moduleNameMapper: {
    ...mappedPaths,
    "^lodash-es$": "lodash"
  },
  testPathIgnorePatterns: [
    "node_modules/",
    "fixtures\.spec\.ts",
  ],
  watchPathIgnorePatterns: [
		"node_modules/"
	]
};
