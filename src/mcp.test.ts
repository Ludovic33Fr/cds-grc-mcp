import { describe, it, expect, beforeEach } from 'vitest';
import { getInfoSeller, productList, productGet, productCount, productGetVariants, orderList, orderGet, orderAcknowledge, orderShip, orderCancel } from './mcp.js';
import { products, orders, resetOrdersData } from './mockData.js';

describe('getInfoSeller', () => {
  it('should return seller information when valid oauthToken is provided', async () => {
    const mockOAuthToken = 'valid-token-123';
    const result = await getInfoSeller(mockOAuthToken);

    // Vérifier que le résultat contient les informations vendeur attendues
    expect(result).toContain('=== INFORMATIONS VENDEUR ===');
    expect(result).toContain('ID Vendeur        : SELLER_001');
    expect(result).toContain('Nom               : TechStore Pro');
    expect(result).toContain('Note              : 4.7/5 ⭐');
    expect(result).toContain('Ventes totales    : 15 420 commandes');
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
    expect(result.error.code).toBe(429);
    expect(result.error.message).toContain("Limit exceeds maximum allowed value");
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
    // Avec seulement 1 produit dans ce groupe, il n'y a pas de page suivante
    expect(result.nextCursor).toBeNull();
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
    expect(result.error.code).toBe(429);
    expect(result.error.message).toContain("Limit exceeds maximum allowed value");
  });
});

// ===== TESTS DES MÉTHODES DE GESTION DES COMMANDES =====

describe('orderList', () => {
    beforeEach(() => {
    resetOrdersData();
  });

  it('should return all orders when no filters are applied', async () => {
    const result = await orderList({});
    expect(result.items).toHaveLength(4);
    expect(result.itemsPerPage).toBe(100);
    expect(result.nextCursor).toBeNull();
  });

  it('should filter orders by status', async () => {
    const result = await orderList({ filters: { status: 'pending' } });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].status).toBe('pending');
  });

  it('should filter orders by multiple statuses', async () => {
    const result = await orderList({ filters: { status: ['pending', 'acknowledged'] } });
    expect(result.items).toHaveLength(2);
    expect(result.items.every(order => ['pending', 'acknowledged'].includes(order.status))).toBe(true);
  });

  it('should filter orders by salesChannel', async () => {
    const result = await orderList({ filters: { salesChannel: 'cdiscount' } });
    expect(result.items).toHaveLength(4);
    expect(result.items.every(order => order.salesChannel === 'cdiscount')).toBe(true);
  });

  it('should filter orders by date range', async () => {
    const result = await orderList({ 
      filters: { 
        createdAtFrom: '2025-07-13T00:00:00Z',
        createdAtTo: '2025-07-15T23:59:59Z'
      } 
    });
    expect(result.items).toHaveLength(3);
  });

  it('should filter orders by customer email', async () => {
    const result = await orderList({ filters: { customerEmail: 'jean.dupont' } });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].customer.email).toContain('jean.dupont');
  });

  it('should filter orders by reference', async () => {
    const result = await orderList({ filters: { reference: 'CDS-2025-001' } });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].reference).toBe('CDS-2025-001');
  });

  it('should sort orders by createdAt desc by default', async () => {
    const result = await orderList({ limit: 4 });
    const dates = result.items.map(order => new Date(order.createdAt));
    expect(dates[0] > dates[1]).toBe(true);
    expect(dates[1] > dates[2]).toBe(true);
    expect(dates[2] > dates[3]).toBe(true);
  });

  it('should sort orders by totalAmount asc', async () => {
    const result = await orderList({ sortBy: 'totalAmount', sortDir: 'asc', limit: 4 });
    const amounts = result.items.map(order => order.totalAmount);
    expect(amounts[0] <= amounts[1]).toBe(true);
    expect(amounts[1] <= amounts[2]).toBe(true);
    expect(amounts[2] <= amounts[3]).toBe(true);
  });

  it('should handle pagination with cursor', async () => {
    const result1 = await orderList({ limit: 2 });
    expect(result1.items).toHaveLength(2);
    expect(result1.nextCursor).toBeTruthy();

    const result2 = await orderList({ limit: 2, cursor: result1.nextCursor });
    expect(result2.items).toHaveLength(2);
    expect(result2.nextCursor).toBeNull();
  });

  it('should return error for invalid limit < 1', async () => {
    const result = await orderList({ limit: 0 });
    expect(result.error).toBeDefined();
    expect(result.error.code).toBe(400);
  });

  it('should return error for invalid limit > 1000', async () => {
    const result = await orderList({ limit: 1001 });
    expect(result.error).toBeDefined();
    expect(result.error.code).toBe(429);
  });

  it('should return error for invalid cursor format', async () => {
    const result = await orderList({ cursor: 'invalid-cursor' });
    expect(result.error).toBeDefined();
    expect(result.error.code).toBe(400);
  });
});

describe('orderGet', () => {
  beforeEach(() => {
    resetOrdersData();
  });

  it('should return order details when valid orderId is provided', async () => {
    const result = await orderGet({ orderId: 'ORD-001' });
    expect(result.id).toBe('ORD-001');
    expect(result.reference).toBe('CDS-2025-001');
    expect(result.status).toBe('pending');
    expect(result.customer.email).toBe('jean.dupont@email.com');
  });

  it('should return error when orderId does not exist', async () => {
    const result = await orderGet({ orderId: 'NONEXISTENT' });
    expect(result.error).toBeDefined();
    expect(result.error.code).toBe(404);
    expect(result.error.message).toBe('Order not found');
  });
});

describe('orderAcknowledge', () => {
  beforeEach(() => {
    resetOrdersData();
  });

  it('should acknowledge a pending order successfully', async () => {
    const result = await orderAcknowledge({ orderId: 'ORD-001' });
    expect(result.success).toBe(true);
    expect(result.message).toBe('Order acknowledged successfully');
    expect(result.order.status).toBe('acknowledged');
    expect(result.order.acknowledgedAt).toBeDefined();
  });

  it('should return error when orderId does not exist', async () => {
    const result = await orderAcknowledge({ orderId: 'NONEXISTENT' });
    expect(result.error).toBeDefined();
    expect(result.error.code).toBe(404);
  });

  it('should return error when order is not in pending status', async () => {
    const result = await orderAcknowledge({ orderId: 'ORD-003' }); // shipped order
    expect(result.error).toBeDefined();
    expect(result.error.code).toBe(400);
    expect(result.error.message).toContain('cannot be acknowledged');
  });

  it('should update all items status to acknowledged', async () => {
    await orderAcknowledge({ orderId: 'ORD-001' });
    const order = orders.find(o => o.id === 'ORD-001');
    expect(order?.items.every(item => item.status === 'acknowledged')).toBe(true);
  });
});

describe('orderShip', () => {
  beforeEach(() => {
    resetOrdersData();
  });

  it('should ship an acknowledged order successfully', async () => {
    const result = await orderShip({ 
      orderId: 'ORD-002', 
      trackingNumber: 'TRK987654321', 
      carrier: 'Chronopost' 
    });
    expect(result.success).toBe(true);
    expect(result.message).toBe('Order shipped successfully');
    expect(result.order.status).toBe('shipped');
    expect(result.order.trackingNumber).toBe('TRK987654321');
    expect(result.order.carrier).toBe('Chronopost');
  });

  it('should return error when orderId does not exist', async () => {
    const result = await orderShip({ 
      orderId: 'NONEXISTENT', 
      trackingNumber: 'TRK123', 
      carrier: 'Test' 
    });
    expect(result.error).toBeDefined();
    expect(result.error.code).toBe(404);
  });

  it('should return error when order is not in acknowledged status', async () => {
    const result = await orderShip({ 
      orderId: 'ORD-001', // pending order
      trackingNumber: 'TRK123', 
      carrier: 'Test' 
    });
    expect(result.error).toBeDefined();
    expect(result.error.code).toBe(400);
    expect(result.error.message).toContain('cannot be shipped');
  });

  it('should update all items with tracking information', async () => {
    await orderShip({ 
      orderId: 'ORD-002', 
      trackingNumber: 'TRK987654321', 
      carrier: 'Chronopost' 
    });
    const order = orders.find(o => o.id === 'ORD-002');
    expect(order?.items.every(item => 
      item.status === 'shipped' && 
      item.trackingNumber === 'TRK987654321' && 
      item.carrier === 'Chronopost'
    )).toBe(true);
  });
});

describe('orderCancel', () => {
  beforeEach(() => {
    resetOrdersData();
  });

  it('should cancel a pending order successfully', async () => {
    const result = await orderCancel({ 
      orderId: 'ORD-001', 
      reason: 'Client request' 
    });
    expect(result.success).toBe(true);
    expect(result.message).toBe('Order cancelled successfully');
    expect(result.order.status).toBe('cancelled');
    expect(result.order.cancellationReason).toBe('Client request');
  });

  it('should cancel an acknowledged order successfully', async () => {
    const result = await orderCancel({ 
      orderId: 'ORD-002', 
      reason: 'Out of stock' 
    });
    expect(result.success).toBe(true);
    expect(result.order.status).toBe('cancelled');
  });

  it('should return error when orderId does not exist', async () => {
    const result = await orderCancel({ 
      orderId: 'NONEXISTENT', 
      reason: 'Test' 
    });
    expect(result.error).toBeDefined();
    expect(result.error.code).toBe(404);
  });

  it('should return error when order cannot be cancelled', async () => {
    const result = await orderCancel({ 
      orderId: 'ORD-003', // shipped order
      reason: 'Test' 
    });
    expect(result.error).toBeDefined();
    expect(result.error.code).toBe(400);
    expect(result.error.message).toContain('cannot be cancelled');
  });

  it('should update all items status to cancelled', async () => {
    await orderCancel({ 
      orderId: 'ORD-001', 
      reason: 'Client request' 
    });
    const order = orders.find(o => o.id === 'ORD-001');
    expect(order?.items.every(item => item.status === 'cancelled')).toBe(true);
  });
});
