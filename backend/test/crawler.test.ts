import { describe, it, expect } from 'vitest';
import { enforceCategory, CATEGORY_WEIGHTS } from '../src/config';

describe('Crawler Logic', () => {
  describe('enforceCategory', () => {
    it('should convert magazines incorrectly placed in replicas to magazines', () => {
      const result = enforceCategory('Magazine for M4 AEG', 'replicas');
      expect(result).toBe('magazines');
    });

    it('should convert internal parts incorrectly placed in replicas to pecas-internas', () => {
      const result1 = enforceCategory('Cylinder Head for V2 Gearbox', 'replicas');
      const result2 = enforceCategory('Spring M120', 'replicas');
      expect(result1).toBe('pecas-internas');
      expect(result2).toBe('pecas-internas');
    });

    it('should convert external parts incorrectly placed in replicas to pecas-externas', () => {
      const result = enforceCategory('M-LOK Handguard for M4', 'replicas');
      expect(result).toBe('pecas-externas');
    });

    it('should not modify a real replica', () => {
      const result = enforceCategory('Rifle de Airsoft AEG M4A1', 'replicas');
      expect(result).toBe('replicas');
    });

    it('should not modify parts if they are already in the correct category', () => {
      // The function only targets 'replicas' currently
      const result = enforceCategory('Magazine for M4 AEG', 'pecas-externas');
      expect(result).toBe('pecas-externas');
    });
  });

  describe('CATEGORY_WEIGHTS', () => {
    it('should prioritize specific categories over generic ones', () => {
      expect(CATEGORY_WEIGHTS['magazines']).toBeGreaterThan(CATEGORY_WEIGHTS['replicas']);
      expect(CATEGORY_WEIGHTS['pecas-internas']).toBeGreaterThan(CATEGORY_WEIGHTS['replicas']);
      expect(CATEGORY_WEIGHTS['bbs']).toBeGreaterThan(CATEGORY_WEIGHTS['replicas']);
    });
  });
});
