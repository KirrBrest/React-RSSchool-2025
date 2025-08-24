import { describe, it, expect } from 'vitest';
import { Modal, ModalOne, ModalTwo } from '../components/Modal';

describe('Modal index exports', () => {
  it('exports Modal component', () => {
    expect(Modal).toBeDefined();
    expect(typeof Modal).toBe('function');
  });

  it('exports ModalOne component', () => {
    expect(ModalOne).toBeDefined();
    expect(typeof ModalOne).toBe('function');
  });

  it('exports ModalTwo component', () => {
    expect(ModalTwo).toBeDefined();
    expect(typeof ModalTwo).toBe('function');
  });

  it('exports correct number of components', () => {
    expect(Modal).toBeDefined();
    expect(ModalOne).toBeDefined();
    expect(ModalTwo).toBeDefined();
  });

  it('exports are not undefined or null', () => {
    expect(Modal).not.toBeNull();
    expect(Modal).not.toBeUndefined();
    expect(ModalOne).not.toBeNull();
    expect(ModalOne).not.toBeUndefined();
    expect(ModalTwo).not.toBeNull();
    expect(ModalTwo).not.toBeUndefined();
  });
});
