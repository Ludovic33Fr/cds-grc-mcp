import { products, Product } from './mockData.js';

export async function authenticateOAuth(
  clientId: string,
  clientSecret?: string,
  redirectUri?: string,
  scope?: string
): Promise<string> {
  
  const defaultScope = scope || 'read write';

  return `
  AccessToken: FakeTokenCDS
  TokenType: Bearer
  ExpiresIn: 3600
  Scope: ${defaultScope}
  RefreshToken: FakeRefreshTokenCDS
  SimulationMode: true
  `.trim();

}

export async function getInfoSeller(
  oauthToken: string
): Promise<string> {

  if (!oauthToken) {
    throw new Error('OAuth token is required');
  }

  // Mocked seller information for e-commerce marketplace
  const mockSellerInfo = {
    sellerId: "SELLER_001",
    sellerName: "TechStore Pro",
    rating: 4.7,
    totalSales: 15420,
    responseTime: "2-4h",
    shippingPolicy: "Livraison gratuite dès 35€",
    returnPolicy: "Retours acceptés sous 30 jours",
    verified: true,
    location: "Paris, France",
    memberSince: "2021",
    categories: ["Électronique", "Informatique", "Accessoires"],
    customerSatisfaction: "98%"
  };

  return `
=== INFORMATIONS VENDEUR ===
ID Vendeur        : ${mockSellerInfo.sellerId}
Nom               : ${mockSellerInfo.sellerName}
Note              : ${mockSellerInfo.rating}/5 ⭐
Ventes totales    : ${mockSellerInfo.totalSales.toLocaleString().replace(/\u202F/g, ' ')} commandes
Temps de réponse  : ${mockSellerInfo.responseTime}
Politique livraison: ${mockSellerInfo.shippingPolicy}
Politique retours : ${mockSellerInfo.returnPolicy}
Vendeur vérifié   : ${mockSellerInfo.verified ? '✅ Oui' : '❌ Non'}
Localisation     : ${mockSellerInfo.location}
Membre depuis     : ${mockSellerInfo.memberSince}
Catégories       : ${mockSellerInfo.categories.join(', ')}
Satisfaction client: ${mockSellerInfo.customerSatisfaction}
`.trim() + '\n';
}

// Fonction utilitaire pour filtrer les produits
function filterProducts(filters: any): Product[] {
  return products.filter(product => {
    if (filters.gtin) {
      const gtinFilter = Array.isArray(filters.gtin) ? filters.gtin : [filters.gtin];
      if (!gtinFilter.includes(product.gtin)) return false;
    }
    
    if (filters.productReference) {
      const refFilter = Array.isArray(filters.productReference) ? filters.productReference : [filters.productReference];
      if (!refFilter.includes(product.productReference)) return false;
    }
    
    if (filters.categoryReference) {
      const catFilter = Array.isArray(filters.categoryReference) ? filters.categoryReference : [filters.categoryReference];
      if (!catFilter.includes(product.category.reference)) return false;
    }
    
    if (filters.brandReference && product.brand.reference !== filters.brandReference) {
      return false;
    }
    
    if (filters.updatedAtFrom) {
      const fromDate = new Date(filters.updatedAtFrom);
      if (isNaN(fromDate.getTime())) throw new Error('Invalid updatedAtFrom date');
      if (new Date(product.updatedAt) < fromDate) return false;
    }
    
    if (filters.updatedAtTo) {
      const toDate = new Date(filters.updatedAtTo);
      if (isNaN(toDate.getTime())) throw new Error('Invalid updatedAtTo date');
      if (new Date(product.updatedAt) > toDate) return false;
    }
    
    if (filters.q) {
      const query = filters.q.toLowerCase();
      const titleMatch = product.title.toLowerCase().includes(query);
      const descMatch = product.description.toLowerCase().includes(query);
      if (!titleMatch && !descMatch) return false;
    }
    
    return true;
  });
}

// Fonction utilitaire pour trier les produits
function sortProducts(products: Product[], sortBy: string, sortDir: string): Product[] {
  const sorted = [...products];
  
  sorted.sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'updatedAt':
        aValue = new Date(a.updatedAt);
        bValue = new Date(b.updatedAt);
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      case 'gtin':
        aValue = a.gtin;
        bValue = b.gtin;
        break;
      default:
        aValue = new Date(a.updatedAt);
        bValue = new Date(b.updatedAt);
    }
    
    if (sortDir === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });
  
  return sorted;
}

// Fonction utilitaire pour appliquer les règles de visibilité des champs
function applyFieldVisibility(product: Product, mockOnlyFields?: string[]): any {
  if (product.createdBySeller) {
    // Produit créé par le vendeur → toutes les informations
    if (mockOnlyFields && mockOnlyFields.length > 0) {
      const result: any = {};
      mockOnlyFields.forEach(field => {
        if (field in product) {
          (result as any)[field] = (product as any)[field];
        }
      });
      return result;
    }
    return product;
  } else {
    // Produit non créé par le vendeur → champs limités + champs de tri
    const limitedProduct = {
      gtin: product.gtin,
      title: product.title,
      productReference: product.productReference,
      category: product.category,
      language: product.language,
      // Ajouter les champs de tri pour maintenir la cohérence
      updatedAt: product.updatedAt,
      createdAt: product.createdAt
    };
    
    if (mockOnlyFields && mockOnlyFields.length > 0) {
      const result: any = {};
      mockOnlyFields.forEach(field => {
        if (field in limitedProduct) {
          (result as any)[field] = (limitedProduct as any)[field];
        }
      });
      return result;
    }
    
    return limitedProduct;
  }
}

// Fonction utilitaire pour générer un curseur
function generateCursor(gtin: string): string {
  return Buffer.from(gtin).toString('base64');
}

// Fonction utilitaire pour décoder un curseur
function decodeCursor(cursor: string): string {
  return Buffer.from(cursor, 'base64').toString();
}

// Méthode product.list
export async function productList(params: {
  filters?: {
    gtin?: string | string[];
    productReference?: string | string[];
    categoryReference?: string | string[];
    brandReference?: string;
    updatedAtFrom?: string;
    updatedAtTo?: string;
    q?: string;
  };
  cursor?: string | null;
  limit?: number;
  sortBy?: "updatedAt" | "createdAt" | "gtin";
  sortDir?: "asc" | "desc";
  "mockOnly.fields"?: string[];
}): Promise<any> {
  try {
    // Validation des paramètres
    if (params.limit !== undefined && params.limit < 1) {
      return {
        error: {
          code: 400,
          message: "Limit must be between 1 and 1000"
        }
      };
    }
    
    if (params.limit && params.limit > 1000) {
      return {
        error: {
          code: 429,
          message: "Limit exceeds maximum allowed value"
        }
      };
    }
    
    const limit = Math.min(params.limit || 100, 1000);
    
    // Filtrage et tri
    let filteredProducts = filterProducts(params.filters || {});
    const sortBy = params.sortBy || "updatedAt";
    const sortDir = params.sortDir || "desc";
    filteredProducts = sortProducts(filteredProducts, sortBy, sortDir);
    
    // Pagination
    let startIndex = 0;
    if (params.cursor) {
      try {
        const decodedCursor = decodeCursor(params.cursor);
        const cursorIndex = filteredProducts.findIndex(p => p.gtin === decodedCursor);
        if (cursorIndex !== -1) {
          startIndex = cursorIndex + 1;
        }
      } catch (e) {
        return {
          error: {
            code: 400,
            message: "Invalid cursor format"
          }
        };
      }
    }
    
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);
    
    // Génération du curseur suivant
    let nextCursor: string | null = null;
    if (startIndex + limit < filteredProducts.length) {
      nextCursor = generateCursor(filteredProducts[startIndex + limit - 1].gtin);
    }
    
    // Application des règles de visibilité
    const items = paginatedProducts.map(product => 
      applyFieldVisibility(product, params["mockOnly.fields"])
    );
    
    return {
      items,
      nextCursor,
      itemsPerPage: limit
    };
    
  } catch (error) {
    return {
      error: {
        code: 400,
        message: error instanceof Error ? error.message : "Unknown error"
      }
    };
  }
}

// Méthode product.get
export async function productGet(params: { gtin: string }): Promise<any> {
  try {
    const product = products.find(p => p.gtin === params.gtin);
    
    if (!product) {
      return {
        error: {
          code: 404,
          message: "Product not found"
        }
      };
    }
    
    return applyFieldVisibility(product);
    
  } catch (error) {
    return {
      error: {
        code: 400,
        message: error instanceof Error ? error.message : "Unknown error"
      }
    };
  }
}

// Méthode product.count
export async function productCount(params: {
  filters?: {
    gtin?: string | string[];
    productReference?: string | string[];
    categoryReference?: string | string[];
    brandReference?: string;
    updatedAtFrom?: string;
    updatedAtTo?: string;
    q?: string;
  };
}): Promise<any> {
  try {
    const filteredProducts = filterProducts(params.filters || {});
    
    return {
      count: filteredProducts.length
    };
    
  } catch (error) {
    return {
      error: {
        code: 400,
        message: error instanceof Error ? error.message : "Unknown error"
      }
    };
  }
}

// Méthode product.get_variants
export async function productGetVariants(params: {
  groupReference: string;
  cursor?: string | null;
  limit?: number;
}): Promise<any> {
  try {
    // Validation des paramètres
    if (params.limit !== undefined && params.limit < 1) {
      return {
        error: {
          code: 400,
          message: "Limit must be between 1 and 1000"
        }
      };
    }
    
    if (params.limit && params.limit > 1000) {
      return {
        error: {
          code: 429,
          message: "Limit exceeds maximum allowed value"
        }
      };
    }
    
    const limit = Math.min(params.limit || 100, 1000);
    
    // Filtrage par groupReference
    let filteredProducts = products.filter(p => p.groupReference === params.groupReference);
    
    // Pagination
    let startIndex = 0;
    if (params.cursor) {
      try {
        const decodedCursor = decodeCursor(params.cursor);
        const cursorIndex = filteredProducts.findIndex(p => p.gtin === decodedCursor);
        if (cursorIndex !== -1) {
          startIndex = cursorIndex + 1;
        }
      } catch (e) {
        return {
          error: {
            code: 400,
            message: "Invalid cursor format"
          }
        };
      }
    }
    
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);
    
    // Génération du curseur suivant
    let nextCursor: string | null = null;
    if (startIndex + limit < filteredProducts.length) {
      nextCursor = generateCursor(filteredProducts[startIndex + limit - 1].gtin);
    }
    
    // Application des règles de visibilité
    const items = paginatedProducts.map(product => 
      applyFieldVisibility(product)
    );
    
    return {
      items,
      nextCursor
    };
    
  } catch (error) {
    return {
      error: {
        code: 400,
        message: error instanceof Error ? error.message : "Unknown error"
      }
    };
  }
}