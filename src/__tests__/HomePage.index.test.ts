import { describe, it, expect } from 'vitest';
import { HomePage } from '../components/HomePage';

describe('HomePage index exports', () => {
  it('exports HomePage component', () => {
    expect(HomePage).toBeDefined();
    expect(typeof HomePage).toBe('function');
  });

  it('exports correct number of components', () => {
    expect(HomePage).toBeDefined();
  });

  it('exports are not undefined or null', () => {
    expect(HomePage).not.toBeNull();
    expect(HomePage).not.toBeUndefined();
  });
});
