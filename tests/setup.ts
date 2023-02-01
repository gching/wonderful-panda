import { expect, afterEach, beforeAll, afterAll, } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';
import { fetch } from 'cross-fetch';
import { mswServer } from "./mswServer";

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

global.fetch = fetch;

beforeAll(() => mswServer.listen({ onUnhandledRequest: 'error' }))

afterAll(() => mswServer.close())

afterEach(() => {
    cleanup();
    mswServer.resetHandlers()
});