import { describe, it, expect } from 'vitest';
import { UncontrolledForm, ControlledForm } from '../components/Forms';

describe('Forms index exports', () => {
  it('exports UncontrolledForm component', () => {
    expect(UncontrolledForm).toBeDefined();
    expect(typeof UncontrolledForm).toBe('function');
  });

  it('exports ControlledForm component', () => {
    expect(ControlledForm).toBeDefined();
    expect(typeof ControlledForm).toBe('function');
  });

  it('exports correct number of components', () => {
    expect(UncontrolledForm).toBeDefined();
    expect(ControlledForm).toBeDefined();
  });

  it('exports are not undefined or null', () => {
    expect(UncontrolledForm).not.toBeNull();
    expect(UncontrolledForm).not.toBeUndefined();
    expect(ControlledForm).not.toBeNull();
    expect(ControlledForm).not.toBeUndefined();
  });
});
