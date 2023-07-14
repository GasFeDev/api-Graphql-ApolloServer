// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  setupFilesAfterEnv: ["<rootDir>/tests/jest.setEnvVars"],
  coveragePathIgnorePatterns: [
    ".*/generated/.*",
    ".*/generated\\.*",
    ".*/migrations/.*",
    ".*/seeds/.*",
    ".*/mocks/.*",
    ".*/fixtures/.*",
    ".*/(build|dist)/.*",
    "\\.d\\.ts",
  ],
  collectCoverageFrom: ["app/**/*.{js,ts}"],
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  moduleFileExtensions: ["js", "json", "ts", "d.ts"],
  modulePathIgnorePatterns: [".*/build/.*"],
  coverageThreshold: {
    global: {
      branches: 100,
      lines: 100,
      statements: 100,
    },
  },
  testTimeout: 1000,
};
