import { expect, test, describe } from 'vitest';
import { isValidProduct } from '../src/config.js';

describe('isValidProduct', () => {
  test('should keep valid airsoft products', () => {
    expect(isValidProduct('M4A1 Carbine AEG')).toBe(true);
    expect(isValidProduct('BBS 0.20g 4000un')).toBe(true);
    expect(isValidProduct('Magazine mid-cap 120 bbs')).toBe(true);
  });

  test('should exclude wellness products', () => {
    expect(isValidProduct('Tapete de Yoga Wellness')).toBe(false);
    expect(isValidProduct('Kit Fitness 3 pecas')).toBe(false);
  });

  test('should exclude non-airsoft random items', () => {
    expect(isValidProduct('Chaveiro em formato de M4')).toBe(false);
    expect(isValidProduct('Adesivo Arsenal Sports')).toBe(false);
    expect(isValidProduct('Mouse Pad gigante')).toBe(false);
  });
});
