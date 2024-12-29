import { jest } from '@jest/globals';

// Mock process
globalThis.process = {
  ...process,
  env: {
    ...process.env,
    NODE_ENV: 'test'
  }
};

// Mock window.fs
globalThis.window = {
  ...globalThis.window,
  fs: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
    readFileSync: jest.fn(),
    writeFileSync: jest.fn()
  }
};