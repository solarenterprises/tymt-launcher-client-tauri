import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Suppress React act() warnings in tests
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('wrapped in act(...)') ||
     args[0].includes('CJS build of Vite') ||
     args[0].includes('Failed to refresh token') ||
     args[0].includes('Failed to requestMessage'))
  ) {
    return;
  }
  originalError.call(console, ...args);
};

// Suppress specific warnings
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('wrapped in act(...)')
  ) {
    return;
  }
  originalWarn.call(console, ...args);
};

// Global test setup
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
