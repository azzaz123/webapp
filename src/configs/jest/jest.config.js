// This file contains the definition of the configuration passed to jest
// Note: this will load the jest-preset-angular file (jest.config.ts)

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
    "^lodash-es$": "lodash"
  },
  testPathIgnorePatterns: [
    "/node-modules/",
    "\w*fixtures.spec\w*"
  ]
};
