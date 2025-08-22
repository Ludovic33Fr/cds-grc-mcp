export async function authenticateOAuth(clientId, clientSecret, redirectUri, scope) {
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
export async function getInfoSeller(oauthToken) {
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
Ventes totales    : ${mockSellerInfo.totalSales.toLocaleString()} commandes
Temps de réponse  : ${mockSellerInfo.responseTime}
Politique livraison: ${mockSellerInfo.shippingPolicy}
Politique retours : ${mockSellerInfo.returnPolicy}
Vendeur vérifié   : ${mockSellerInfo.verified ? '✅ Oui' : '❌ Non'}
Localisation     : ${mockSellerInfo.location}
Membre depuis     : ${mockSellerInfo.memberSince}
Catégories       : ${mockSellerInfo.categories.join(', ')}
Satisfaction client: ${mockSellerInfo.customerSatisfaction}
`.trim();
}
// Jeu de données en mémoire (déterministe)
const products = [
    {
        gtin: "3543111111111",
        productReference: "IPH13-BLACK-128",
        title: "Smartphone Exemple 128 Go",
        language: "fr-FR",
        category: {
            reference: "070302",
            label: "SMARTPHONE",
            referencePath: "07/0703/070302"
        },
        brand: {
            reference: "APL",
            name: "Apple"
        },
        attributes: [
            {
                reference: "39635",
                label: "Mémoire",
                unit: "Go",
                values: ["128"],
                files: [
                    {
                        index: 1,
                        mimeType: "application/pdf",
                        url: "https://media.pdf",
                        updatedAt: "2024-10-01T10:20:30Z"
                    }
                ]
            }
        ],
        pictures: [
            {
                index: 1,
                url: "https://img.mock/iph13-1.jpg"
            }
        ],
        description: "Un super smartphone avec une excellente qualité d'image et une autonomie remarquable.",
        completeness: 92,
        groupReference: "VARI-IPHONE-13",
        createdBySeller: true,
        createdAt: "2024-10-01T10:20:30Z",
        updatedAt: "2025-07-15T09:00:00Z"
    },
    {
        gtin: "4000000000002",
        productReference: "CASE-UNIV-01",
        title: "Coque universelle pour smartphone",
        language: "fr-FR",
        category: {
            reference: "070304",
            label: "COQUES",
            referencePath: "07/0703/070304"
        },
        brand: {
            reference: "GEN",
            name: "Generic"
        },
        attributes: [
            {
                reference: "12345",
                label: "Matériau",
                unit: null,
                values: ["Silicone", "TPU"],
                files: []
            }
        ],
        pictures: [
            {
                index: 1,
                url: "https://img.mock/case-1.jpg"
            }
        ],
        description: "Coque universelle de haute qualité, compatible avec la plupart des smartphones.",
        completeness: 85,
        groupReference: null,
        createdBySeller: false,
        createdAt: "2024-09-15T14:30:00Z",
        updatedAt: "2025-07-10T16:45:00Z"
    },
    {
        gtin: "5000000000003",
        productReference: "TROUSERS-BLUE-32",
        title: "Pantalon classique bleu marine",
        language: "fr-FR",
        category: {
            reference: "030101",
            label: "PANTALONS",
            referencePath: "03/0301/030101"
        },
        brand: {
            reference: "FASH",
            name: "FashionBrand"
        },
        attributes: [
            {
                reference: "67890",
                label: "Taille",
                unit: null,
                values: ["30", "31", "32", "33", "34"],
                files: []
            },
            {
                reference: "67891",
                label: "Couleur",
                unit: null,
                values: ["Bleu marine", "Noir", "Gris"],
                files: []
            }
        ],
        pictures: [
            {
                index: 1,
                url: "https://img.mock/trousers-1.jpg"
            },
            {
                index: 2,
                url: "https://img.mock/trousers-2.jpg"
            }
        ],
        description: "Pantalon classique en coton de qualité, parfait pour un usage quotidien ou professionnel.",
        completeness: 95,
        groupReference: "VARI-TROUSERS-123",
        createdBySeller: true,
        createdAt: "2024-08-20T09:15:00Z",
        updatedAt: "2025-07-12T11:30:00Z"
    }
];
// Fonction utilitaire pour filtrer les produits
function filterProducts(filters) {
    return products.filter(product => {
        if (filters.gtin) {
            const gtinFilter = Array.isArray(filters.gtin) ? filters.gtin : [filters.gtin];
            if (!gtinFilter.includes(product.gtin))
                return false;
        }
        if (filters.productReference) {
            const refFilter = Array.isArray(filters.productReference) ? filters.productReference : [filters.productReference];
            if (!refFilter.includes(product.productReference))
                return false;
        }
        if (filters.categoryReference) {
            const catFilter = Array.isArray(filters.categoryReference) ? filters.categoryReference : [filters.categoryReference];
            if (!catFilter.includes(product.category.reference))
                return false;
        }
        if (filters.brandReference && product.brand.reference !== filters.brandReference) {
            return false;
        }
        if (filters.updatedAtFrom) {
            const fromDate = new Date(filters.updatedAtFrom);
            if (isNaN(fromDate.getTime()))
                throw new Error('Invalid updatedAtFrom date');
            if (new Date(product.updatedAt) < fromDate)
                return false;
        }
        if (filters.updatedAtTo) {
            const toDate = new Date(filters.updatedAtTo);
            if (isNaN(toDate.getTime()))
                throw new Error('Invalid updatedAtTo date');
            if (new Date(product.updatedAt) > toDate)
                return false;
        }
        if (filters.q) {
            const query = filters.q.toLowerCase();
            const titleMatch = product.title.toLowerCase().includes(query);
            const descMatch = product.description.toLowerCase().includes(query);
            if (!titleMatch && !descMatch)
                return false;
        }
        return true;
    });
}
// Fonction utilitaire pour trier les produits
function sortProducts(products, sortBy, sortDir) {
    const sorted = [...products];
    sorted.sort((a, b) => {
        let aValue, bValue;
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
        }
        else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
    });
    return sorted;
}
// Fonction utilitaire pour appliquer les règles de visibilité des champs
function applyFieldVisibility(product, mockOnlyFields) {
    if (product.createdBySeller) {
        // Produit créé par le vendeur → toutes les informations
        if (mockOnlyFields && mockOnlyFields.length > 0) {
            const result = {};
            mockOnlyFields.forEach(field => {
                if (field in product) {
                    result[field] = product[field];
                }
            });
            return result;
        }
        return product;
    }
    else {
        // Produit non créé par le vendeur → champs limités
        const limitedProduct = {
            gtin: product.gtin,
            title: product.title,
            productReference: product.productReference,
            category: product.category,
            language: product.language
        };
        if (mockOnlyFields && mockOnlyFields.length > 0) {
            const result = {};
            mockOnlyFields.forEach(field => {
                if (field in limitedProduct) {
                    result[field] = limitedProduct[field];
                }
            });
            return result;
        }
        return limitedProduct;
    }
}
// Fonction utilitaire pour générer un curseur
function generateCursor(gtin) {
    return Buffer.from(gtin).toString('base64');
}
// Fonction utilitaire pour décoder un curseur
function decodeCursor(cursor) {
    return Buffer.from(cursor, 'base64').toString();
}
// Méthode product.list
export async function productList(params) {
    try {
        // Validation des paramètres
        const limit = Math.min(params.limit || 100, 1000);
        if (limit < 1 || limit > 1000) {
            return {
                error: {
                    code: 400,
                    message: "Limit must be between 1 and 1000"
                }
            };
        }
        if (limit > 1000) {
            return {
                error: {
                    code: 429,
                    message: "Limit exceeds maximum allowed value"
                }
            };
        }
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
            }
            catch (e) {
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
        let nextCursor = null;
        if (startIndex + limit < filteredProducts.length) {
            nextCursor = generateCursor(filteredProducts[startIndex + limit - 1].gtin);
        }
        // Application des règles de visibilité
        const items = paginatedProducts.map(product => applyFieldVisibility(product, params["mockOnly.fields"]));
        return {
            items,
            nextCursor,
            itemsPerPage: limit
        };
    }
    catch (error) {
        return {
            error: {
                code: 400,
                message: error instanceof Error ? error.message : "Unknown error"
            }
        };
    }
}
// Méthode product.get
export async function productGet(params) {
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
    }
    catch (error) {
        return {
            error: {
                code: 400,
                message: error instanceof Error ? error.message : "Unknown error"
            }
        };
    }
}
// Méthode product.count
export async function productCount(params) {
    try {
        const filteredProducts = filterProducts(params.filters || {});
        return {
            count: filteredProducts.length
        };
    }
    catch (error) {
        return {
            error: {
                code: 400,
                message: error instanceof Error ? error.message : "Unknown error"
            }
        };
    }
}
// Méthode product.get_variants
export async function productGetVariants(params) {
    try {
        const limit = Math.min(params.limit || 100, 1000);
        if (limit < 1 || limit > 1000) {
            return {
                error: {
                    code: 400,
                    message: "Limit must be between 1 and 1000"
                }
            };
        }
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
            }
            catch (e) {
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
        let nextCursor = null;
        if (startIndex + limit < filteredProducts.length) {
            nextCursor = generateCursor(filteredProducts[startIndex + limit - 1].gtin);
        }
        // Application des règles de visibilité
        const items = paginatedProducts.map(product => applyFieldVisibility(product));
        return {
            items,
            nextCursor
        };
    }
    catch (error) {
        return {
            error: {
                code: 400,
                message: error instanceof Error ? error.message : "Unknown error"
            }
        };
    }
}
//# sourceMappingURL=mcp.js.map