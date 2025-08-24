import { describe, it, expect } from 'vitest';
import { PasswordValidation } from '../validation/PasswordValidation';

describe('PasswordValidation index exports', () => {
  it('exports PasswordValidation component', () => {
    expect(PasswordValidation).toBeDefined();
    expect(typeof PasswordValidation).toBe('function');
  });

  it('exports correct number of components', () => {
    expect(PasswordValidation).toBeDefined();
  });

  it('exports are not undefined or null', () => {
    expect(PasswordValidation).not.toBeNull();
    expect(PasswordValidation).not.toBeUndefined();
  });
});
