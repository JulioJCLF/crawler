import { describe, it, expect } from 'vitest';
import { enforceCategory, CATEGORY_WEIGHTS } from '../src/config';

describe('Crawler Logic', () => {
  describe('enforceCategory', () => {
    it('should convert magazines incorrectly placed in replicas to magazines', () => {
      const result = enforceCategory('Magazine for M4 AEG', 'replicas');
      expect(result.categorySlug).toBe('magazines');
    });

    it('should convert internal parts incorrectly placed in replicas to pecas-internas', () => {
      const result1 = enforceCategory('Cylinder Head for V2 Gearbox', 'replicas');
      const result2 = enforceCategory('Spring M120', 'replicas');
      expect(result1.categorySlug).toBe('pecas-internas');
      expect(result2.categorySlug).toBe('pecas-internas');
    });

    it('should convert external parts incorrectly placed in replicas to pecas-externas', () => {
      const result = enforceCategory('M-LOK Handguard for M4', 'replicas');
      expect(result.categorySlug).toBe('pecas-externas');
    });

    it('should not modify a real replica', () => {
      const result = enforceCategory('Rifle de Airsoft AEG M4A1', 'replicas');
      expect(result.categorySlug).toBe('replicas');
    });

    it('should not modify parts if they are already in the correct category', () => {
      // The function only targets 'replicas' currently for generic overrides
      const result = enforceCategory('Magazine for M4 AEG', 'pecas-externas');
      expect(result.categorySlug).toBe('pecas-externas');
    });

    it('should force a gun cross-listed in pecas-externas back to replicas with max weight', () => {
      const result = enforceCategory('M4A1 Airsoft Rifle', 'pecas-externas');
      expect(result.categorySlug).toBe('replicas');
      expect(result.weight).toBe(100);
    });

    it('should force a sniper to replicas with max weight', () => {
      const result = enforceCategory('VSR-10 Sniper Rifle', 'sniper');
      expect(result.categorySlug).toBe('replicas');
      expect(result.weight).toBe(100);
    });

    it('should force a blowback pistol to replicas with max weight', () => {
      const result = enforceCategory('G17 Blowback Airsoft Pistol', 'pistolas');
      expect(result.categorySlug).toBe('replicas');
      expect(result.weight).toBe(100);
    });

    it('should route buckings to their own category from any source', () => {
      const fromReplicas = enforceCategory('MAPLE LEAF HOP-UP BUCKING AEG 70º', 'replicas');
      const fromGas = enforceCategory('KINGARMS HOP-UP BUCKING TM GBB', 'rifles-gas');
      expect(fromReplicas.categorySlug).toBe('buckings');
      expect(fromGas.categorySlug).toBe('buckings');
    });

    it('should win over the AEG gun rule (bucking with "aeg" in name is not a gun)', () => {
      const result = enforceCategory('G&G HOP-UP BUCKING 50º FOR AEG', 'replicas');
      expect(result.categorySlug).toBe('buckings');
      expect(result.weight).toBeGreaterThan(100);
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
