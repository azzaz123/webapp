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
      "tsConfig": "<rootDir>/src/tsconfig.spec.json",
      // By using isolated modules we lose some TS functionalities in the transpilation process but tests are much faster
      // Check more here: https://www.typescriptlang.org/tsconfig#isolatedModules
      "isolatedModules": true
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
