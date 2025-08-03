import '@testing-library/jest-dom';
import { vi, afterEach, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';

global.fetch = vi.fn((input: RequestInfo | URL): Promise<Response> => {
  const url = typeof input === 'string' ? input : input.toString();

  if (url.includes('pikachu')) {
    return Promise.resolve(
      new Response(
        JSON.stringify({
          name: 'pikachu',
          url: 'https://pokeapi.co/api/v2/pokemon/25/',
        }),
        {
          status: 200,
          statusText: 'OK',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    );
  } else if (url.includes('limit=30')) {
    return Promise.resolve(
      new Response(
        JSON.stringify({
          results: [
            { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
          ],
        }),
        {
          status: 200,
          statusText: 'OK',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    );
  } else {
    return Promise.reject(new Error('Failed to fetch'));
  }
});

afterEach(() => {
  vi.clearAllMocks();
  cleanup();
});

afterAll(() => {
  vi.clearAllMocks();
  cleanup();
});
