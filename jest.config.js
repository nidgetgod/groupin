// jest.config.js
const nextJest = require('next/jest');

// Providing the path to your Next.js app which will enable loading next.config.js and .env files
const createJestConfig = nextJest({
  dir: './',
});

// Any custom config you want to pass to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Run this file after the test framework is installed
  testEnvironment: 'jsdom', // Use jsdom for testing React components
  moduleNameMapper: {
    // Handle module aliases (this will be automatically configured by next/jest)
    // Example: '^@/components/(.*)$': '<rootDir>/src/components/$1',
    // next/jest will handle this based on tsconfig.json paths
  },
  preset: 'ts-jest', // Use ts-jest for TypeScript files
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleDirectories: ['node_modules', '<rootDir>/'], // Helps Jest find modules
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
