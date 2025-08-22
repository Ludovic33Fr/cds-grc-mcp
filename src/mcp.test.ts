import { describe, it, expect } from 'vitest';
import { getInfoSeller, productList, productGet, productCount, productGetVariants } from './mcp.js';

describe('getInfoSeller', () => {
  it('should return seller information when valid oauthToken is provided', async () => {
    const mockOAuthToken = 'valid-token-123';
    const result = await getInfoSeller(mockOAuthToken);

    // Vérifier que le résultat contient les informations vendeur attendues
    expect(result).toContain('=== INFORMATIONS VENDEUR ===');
    expect(result).toContain('ID Vendeur        : SELLER_001');
    expect(result).toContain('Nom               : TechStore Pro');
    expect(result).toContain('Note              : 4.7/5 ⭐');
    expect(result).toContain('Ventes totales    : 15,420 commandes');
    expect(result).toContain('Temps de réponse  : 2-4h');
    expect(result).toContain('Politique livraison: Livraison gratuite dès 35€');
    expect(result).toContain('Politique retours : Retours acceptés sous 30 jours');
    expect(result).toContain('Vendeur vérifié   : ✅ Oui');
    expect(result).toContain('Localisation     : Paris, France');
    expect(result).toContain('Membre depuis     : 2021');
    expect(result).toContain('Catégories       : Électronique, Informatique, Accessoires');
    expect(result).toContain('Satisfaction client: 98%');
  });

  it('should throw error when oauthToken is empty string', async () => {
    const emptyToken = '';
    
    await expect(getInfoSeller(emptyToken)).rejects.toThrow('OAuth token is required');
  });

  it('should throw error when oauthToken is null', async () => {
    const nullToken = null as any;
    
    await expect(getInfoSeller(nullToken)).rejects.toThrow('OAuth token is required');
  });

  it('should throw error when oauthToken is undefined', async () => {
    const undefinedToken = undefined as any;
    
    await expect(getInfoSeller(undefinedToken)).rejects.toThrow('OAuth token is required');
  });

  it('should return formatted string with proper structure', async () => {
    const mockOAuthToken = 'test-token';
    const result = await getInfoSeller(mockOAuthToken);

    // Vérifier la structure générale
    expect(typeof result).toBe('string');
    expect(result).toMatch(/^=== INFORMATIONS VENDEUR ===\n/);
    expect(result).toMatch(/\n$/); // Should end with newline

    // Vérifier que toutes les lignes sont présentes
    const lines = result.split('\n');
    expect(lines.length).toBeGreaterThan(10); // Au moins 10 lignes d'information
    
    // Vérifier que le format est cohérent
    expect(result).toMatch(/^[^:]+:\s+.+$/m); // Format "Label: Value"
  });

  it('should handle different valid oauthToken values', async () => {
    const tokens = [
      'token-123',
      'Bearer abcdef123456',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      'simple-token'
    ];

    for (const token of tokens) {
      const result = await getInfoSeller(token);
      expect(result).toContain('=== INFORMATIONS VENDEUR ===');
      expect(result).toContain('SELLER_001');
      expect(result).toContain('TechStore Pro');
    }
  });

  it('should return consistent data across multiple calls', async () => {
    const mockOAuthToken = 'consistent-token';
    
    const result1 = await getInfoSeller(mockOAuthToken);
    const result2 = await getInfoSeller(mockOAuthToken);
    
    expect(result1).toBe(result2);
  });
});

describe('productList', () => {
  it('should return all products with default parameters', async () => {
    const result = await productList({});
    
    expect(result.items).toHaveLength(3);
    expect(result.itemsPerPage).toBe(100);
    expect(result.nextCursor).toBeNull();
  });

  it('should respect limit parameter', async () => {
    const result = await productList({ limit: 2 });
    
    expect(result.items).toHaveLength(2);
    expect(result.itemsPerPage).toBe(2);
    expect(result.nextCursor).toBeTruthy();
  });

  it('should filter by gtin', async () => {
    const result = await productList({ 
      filters: { gtin: "3543111111111" } 
    });
    
    expect(result.items).toHaveLength(1);
    expect(result.items[0].gtin).toBe("3543111111111");
  });

  it('should filter by multiple gtins', async () => {
    const result = await productList({ 
      filters: { gtin: ["3543111111111", "4000000000002"] } 
    });
    
    expect(result.items).toHaveLength(2);
    expect(result.items.map(p => p.gtin)).toContain("3543111111111");
    expect(result.items.map(p => p.gtin)).toContain("4000000000002");
  });

  it('should filter by category reference', async () => {
    const result = await productList({ 
      filters: { categoryReference: "070302" } 
    });
    
    expect(result.items).toHaveLength(1);
    expect(result.items[0].category.reference).toBe("070302");
  });

  it('should filter by brand reference', async () => {
    const result = await productList({ 
      filters: { brandReference: "APL" } 
    });
    
    expect(result.items).toHaveLength(1);
    expect(result.items[0].brand.reference).toBe("APL");
  });

  it('should filter by date range', async () => {
    const result = await productList({ 
      filters: { 
        updatedAtFrom: "2025-07-01T00:00:00Z",
        updatedAtTo: "2025-07-31T23:59:59Z"
      } 
    });
    
    expect(result.items.length).toBeGreaterThan(0);
    result.items.forEach(item => {
      const updatedAt = new Date(item.updatedAt);
      const fromDate = new Date("2025-07-01T00:00:00Z");
      const toDate = new Date("2025-07-31T23:59:59Z");
      expect(updatedAt >= fromDate).toBe(true);
      expect(updatedAt <= toDate).toBe(true);
    });
  });

  it('should search by text query', async () => {
    const result = await productList({ 
      filters: { q: "smartphone" } 
    });
    
    expect(result.items.length).toBeGreaterThan(0);
    result.items.forEach(item => {
      const titleMatch = item.title.toLowerCase().includes("smartphone");
      const descMatch = item.description?.toLowerCase().includes("smartphone");
      expect(titleMatch || descMatch).toBe(true);
    });
  });

  it('should sort by updatedAt desc by default', async () => {
    const result = await productList({ limit: 10 });
    
    for (let i = 0; i < result.items.length - 1; i++) {
      const current = new Date(result.items[i].updatedAt);
      const next = new Date(result.items[i + 1].updatedAt);
      expect(current >= next).toBe(true);
    }
  });

  it('should sort by createdAt asc', async () => {
    const result = await productList({ 
      sortBy: "createdAt", 
      sortDir: "asc" 
    });
    
    for (let i = 0; i < result.items.length - 1; i++) {
      const current = new Date(result.items[i].createdAt);
      const next = new Date(result.items[i + 1].createdAt);
      expect(current <= next).toBe(true);
    }
  });

  it('should sort by gtin', async () => {
    const result = await productList({ 
      sortBy: "gtin", 
      sortDir: "asc" 
    });
    
    for (let i = 0; i < result.items.length - 1; i++) {
      expect(result.items[i].gtin <= result.items[i + 1].gtin).toBe(true);
    }
  });

  it('should apply field visibility rules for seller-created products', async () => {
    const result = await productList({ 
      filters: { gtin: "3543111111111" } 
    });
    
    const product = result.items[0];
    expect(product.gtin).toBeDefined();
    expect(product.title).toBeDefined();
    expect(product.brand).toBeDefined();
    expect(product.attributes).toBeDefined();
    expect(product.pictures).toBeDefined();
    expect(product.description).toBeDefined();
    expect(product.completeness).toBeDefined();
  });

  it('should apply field visibility rules for non-seller products', async () => {
    const result = await productList({ 
      filters: { gtin: "4000000000002" } 
    });
    
    const product = result.items[0];
    expect(product.gtin).toBeDefined();
    expect(product.title).toBeDefined();
    expect(product.productReference).toBeDefined();
    expect(product.category).toBeDefined();
    expect(product.language).toBeDefined();
    
    // Champs qui ne devraient PAS être présents
    expect(product.brand).toBeUndefined();
    expect(product.attributes).toBeUndefined();
    expect(product.pictures).toBeUndefined();
    expect(product.description).toBeUndefined();
  });

  it('should handle mockOnly.fields for seller products', async () => {
    const result = await productList({ 
      filters: { gtin: "3543111111111" },
      "mockOnly.fields": ["gtin", "title", "brand"]
    });
    
    const product = result.items[0];
    expect(product.gtin).toBeDefined();
    expect(product.title).toBeDefined();
    expect(product.brand).toBeDefined();
    
    // Champs qui ne devraient PAS être présents
    expect(product.attributes).toBeUndefined();
    expect(product.pictures).toBeUndefined();
    expect(product.description).toBeUndefined();
  });

  it('should handle mockOnly.fields for non-seller products', async () => {
    const result = await productList({ 
      filters: { gtin: "4000000000002" },
      "mockOnly.fields": ["gtin", "title"]
    });
    
    const product = result.items[0];
    expect(product.gtin).toBeDefined();
    expect(product.title).toBeDefined();
    
    // Champs qui ne devraient PAS être présents
    expect(product.productReference).toBeUndefined();
    expect(product.category).toBeUndefined();
    expect(product.language).toBeUndefined();
  });

  it('should return error for invalid limit < 1', async () => {
    const result = await productList({ limit: 0 });
    
    expect(result.error).toBeDefined();
    expect(result.error.code).toBe(400);
    expect(result.error.message).toContain("Limit must be between 1 and 1000");
  });

  it('should return error for invalid limit > 1000', async () => {
    const result = await productList({ limit: 1001 });
    
    expect(result.error).toBeDefined();
    expect(result.error.code).toBe(400);
    expect(result.error.message).toContain("Limit must be between 1 and 1000");
  });

  it('should handle pagination with cursor', async () => {
    const firstPage = await productList({ limit: 1 });
    expect(firstPage.items).toHaveLength(1);
    expect(firstPage.nextCursor).toBeTruthy();
    
    const secondPage = await productList({ 
      limit: 1, 
      cursor: firstPage.nextCursor 
    });
    expect(secondPage.items).toHaveLength(1);
    expect(firstPage.items[0].gtin).not.toBe(secondPage.items[0].gtin);
  });
});

describe('productGet', () => {
  it('should return product by gtin', async () => {
    const result = await productGet({ gtin: "3543111111111" });
    
    expect(result.gtin).toBe("3543111111111");
    expect(result.title).toBe("Smartphone Exemple 128 Go");
    expect(result.brand.name).toBe("Apple");
  });

  it('should return error for non-existent gtin', async () => {
    const result = await productGet({ gtin: "9999999999999" });
    
    expect(result.error).toBeDefined();
    expect(result.error.code).toBe(404);
    expect(result.error.message).toBe("Product not found");
  });

  it('should respect field visibility rules for seller products', async () => {
    const result = await productGet({ gtin: "3543111111111" });
    
    expect(result.brand).toBeDefined();
    expect(result.attributes).toBeDefined();
    expect(result.pictures).toBeDefined();
    expect(result.description).toBeDefined();
  });

  it('should respect field visibility rules for non-seller products', async () => {
    const result = await productGet({ gtin: "4000000000002" });
    
    expect(result.gtin).toBeDefined();
    expect(result.title).toBeDefined();
    expect(result.productReference).toBeDefined();
    expect(result.category).toBeDefined();
    expect(result.language).toBeDefined();
    
    expect(result.brand).toBeUndefined();
    expect(result.attributes).toBeUndefined();
    expect(result.pictures).toBeUndefined();
    expect(result.description).toBeUndefined();
  });
});

describe('productCount', () => {
  it('should return total count without filters', async () => {
    const result = await productCount({});
    
    expect(result.count).toBe(3);
  });

  it('should return count with gtin filter', async () => {
    const result = await productCount({ 
      filters: { gtin: "3543111111111" } 
    });
    
    expect(result.count).toBe(1);
  });

  it('should return count with category filter', async () => {
    const result = await productCount({ 
      filters: { categoryReference: "070302" } 
    });
    
    expect(result.count).toBe(1);
  });

  it('should return count with brand filter', async () => {
    const result = await productCount({ 
      filters: { brandReference: "APL" } 
    });
    
    expect(result.count).toBe(1);
  });

  it('should return count with text search', async () => {
    const result = await productCount({ 
      filters: { q: "smartphone" } 
    });
    
    expect(result.count).toBeGreaterThan(0);
  });

  it('should return count with date range filter', async () => {
    const result = await productCount({ 
      filters: { 
        updatedAtFrom: "2025-07-01T00:00:00Z",
        updatedAtTo: "2025-07-31T23:59:59Z"
      } 
    });
    
    expect(result.count).toBeGreaterThan(0);
  });
});

describe('productGetVariants', () => {
  it('should return variants by group reference', async () => {
    const result = await productGetVariants({ 
      groupReference: "VARI-IPHONE-13" 
    });
    
    expect(result.items.length).toBeGreaterThan(0);
    result.items.forEach(item => {
      expect(item.groupReference).toBe("VARI-IPHONE-13");
    });
  });

  it('should return variants with pagination', async () => {
    const result = await productGetVariants({ 
      groupReference: "VARI-IPHONE-13",
      limit: 1
    });
    
    expect(result.items).toHaveLength(1);
    expect(result.nextCursor).toBeTruthy();
  });

  it('should return empty array for non-existent group reference', async () => {
    const result = await productGetVariants({ 
      groupReference: "NON-EXISTENT" 
    });
    
    expect(result.items).toHaveLength(0);
    expect(result.nextCursor).toBeNull();
  });

  it('should respect field visibility rules', async () => {
    const result = await productGetVariants({ 
      groupReference: "VARI-IPHONE-13" 
    });
    
    result.items.forEach(item => {
      if (item.createdBySeller) {
        expect(item.brand).toBeDefined();
        expect(item.attributes).toBeDefined();
      } else {
        expect(item.brand).toBeUndefined();
        expect(item.attributes).toBeUndefined();
      }
    });
  });

  it('should return error for invalid limit < 1', async () => {
    const result = await productGetVariants({ 
      groupReference: "VARI-IPHONE-13",
      limit: 0
    });
    
    expect(result.error).toBeDefined();
    expect(result.error.code).toBe(400);
  });

  it('should return error for invalid limit > 1000', async () => {
    const result = await productGetVariants({ 
      groupReference: "VARI-IPHONE-13",
      limit: 1001
    });
    
    expect(result.error).toBeDefined();
    expect(result.error.code).toBe(400);
  });
});
