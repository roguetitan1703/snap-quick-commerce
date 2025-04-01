// This file is used to provide TypeScript types for Jest when not properly recognized

// If you're still seeing errors, ensure @types/jest is installed correctly
// and that the tsconfig.json includes jest in the types array

// Declare global Jest variables and functions that might be missing
declare global {
  const jest: any;
  const describe: any;
  const it: any;
  const test: any;
  const expect: any;
  const beforeAll: any;
  const beforeEach: any;
  const afterAll: any;
  const afterEach: any;
} 