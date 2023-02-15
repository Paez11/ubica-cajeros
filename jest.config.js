module.exports = {
  moduleNameMapper: {
    '@core/(.*)': '<rootDir>/src'
  },
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  collectCoverage: true,
  coverageDirectory: 'coverage/bol',
  testRegex: '(/__tests__/.*|(\\.|/)(test|jest.spec))\\.[jt]sx?$',
  transformIgnorePatterns: ['node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic)']
};
