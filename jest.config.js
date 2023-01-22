module.exports = {
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: "reports/junit",
      },
    ],
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["lcov"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx"],
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  preset: "ts-jest",
  setupFilesAfterEnv: ["<rootDir>/src/tests/config/setup.ts"],
  testEnvironment: "<rootDir>/src/tests/config/db-env.js",
  testMatch: ["**/tests/**/?(*.)+(spec|test).(ts|tsx|js|jsx)"],
  testTimeout: 60000,
};
