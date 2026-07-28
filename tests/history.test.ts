import { expect, test, describe } from 'vitest';
import { applyChangeTracking } from '../src/history.js';
import { Product, Snapshot } from '../src/types.js';

describe('applyChangeTracking', () => {
  const now = "2026-07-28T12:00:00.000Z";

  test('should detect a new product', () => {
    const current: Product[] = [
      { id: "1", name: "AEG M4", url: "", price: "USD 200.00", image: null, category: "aeg", categoryLabel: "AEG" }
    ];
    
    applyChangeTracking(current, null, now);
    
    expect(current[0].changeType).toBe("new");
    expect(current[0].priceChangedAt).toBe(now);
    expect(current[0].firstSeen).toBe(now);
    expect(current[0].priceHistory).toHaveLength(1);
    expect(current[0].priceHistory![0]).toEqual({ date: now, price: "USD 200.00" });
  });

  test('should detect price drop (sob_consulta)', () => {
    const oldSnapshot: Snapshot = {
      updatedAt: "yesterday",
      count: 1,
      categories: [],
      products: [
        { id: "1", name: "AEG M4", url: "", price: "USD 200.00", image: null, category: "aeg", categoryLabel: "AEG", firstSeen: "yesterday", priceHistory: [{ date: "yesterday", price: "USD 200.00" }] }
      ]
    };
    
    const current: Product[] = [
      { id: "1", name: "AEG M4", url: "", price: null, image: null, category: "aeg", categoryLabel: "AEG" }
    ];
    
    applyChangeTracking(current, oldSnapshot, now);
    
    expect(current[0].changeType).toBe("sob_consulta");
    expect(current[0].previousPrice).toBe("USD 200.00");
    expect(current[0].priceHistory).toHaveLength(2);
    expect(current[0].priceHistory![1]).toEqual({ date: now, price: null });
  });

  test('should detect restock / ganhou_preco', () => {
    const oldSnapshot: Snapshot = {
      updatedAt: "yesterday",
      count: 1,
      categories: [],
      products: [
        { id: "1", name: "AEG M4", url: "", price: null, image: null, category: "aeg", categoryLabel: "AEG", firstSeen: "yesterday", priceHistory: [{ date: "yesterday", price: null }] }
      ]
    };
    
    const current: Product[] = [
      { id: "1", name: "AEG M4", url: "", price: "USD 190.00", image: null, category: "aeg", categoryLabel: "AEG" }
    ];
    
    applyChangeTracking(current, oldSnapshot, now);
    
    expect(current[0].changeType).toBe("restock");
    expect(current[0].previousPrice).toBe(null);
    expect(current[0].priceHistory).toHaveLength(2);
    expect(current[0].priceHistory![1]).toEqual({ date: now, price: "USD 190.00" });
  });

  test('should detect price change', () => {
    const oldSnapshot: Snapshot = {
      updatedAt: "yesterday",
      count: 1,
      categories: [],
      products: [
        { id: "1", name: "AEG M4", url: "", price: "USD 200.00", image: null, category: "aeg", categoryLabel: "AEG", firstSeen: "yesterday", priceHistory: [{ date: "yesterday", price: "USD 200.00" }] }
      ]
    };
    
    const current: Product[] = [
      { id: "1", name: "AEG M4", url: "", price: "USD 180.00", image: null, category: "aeg", categoryLabel: "AEG" }
    ];
    
    applyChangeTracking(current, oldSnapshot, now);
    
    expect(current[0].changeType).toBe("price_change");
    expect(current[0].previousPrice).toBe("USD 200.00");
    expect(current[0].priceHistory).toHaveLength(2);
    expect(current[0].priceHistory![1]).toEqual({ date: now, price: "USD 180.00" });
  });

  test('should clear changeType if no change occurred recently', () => {
    // If it was changed in the past, but between oldSnapshot and current there is NO change
    const oldSnapshot: Snapshot = {
      updatedAt: "yesterday",
      count: 1,
      categories: [],
      products: [
        { id: "1", name: "AEG M4", url: "", price: "USD 200.00", image: null, category: "aeg", categoryLabel: "AEG", firstSeen: "yesterday", priceHistory: [{ date: "yesterday", price: "USD 200.00" }], changeType: "price_change", priceChangedAt: "yesterday" }
      ]
    };
    
    const current: Product[] = [
      { id: "1", name: "AEG M4", url: "", price: "USD 200.00", image: null, category: "aeg", categoryLabel: "AEG" }
    ];
    
    applyChangeTracking(current, oldSnapshot, now);
    
    expect(current[0].changeType).toBe("price_change"); // Should preserve old change tracking so UI still shows it as changed until the UI decides it's old
    expect(current[0].priceChangedAt).toBe("yesterday");
    expect(current[0].priceHistory).toHaveLength(1); // No new history point
  });
});
