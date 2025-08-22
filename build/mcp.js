import { products, orders } from './mockData.js';
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
    try {
        // Vérifier que le curseur est un base64 valide
        if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cursor)) {
            throw new Error('Invalid cursor format');
        }
        const decoded = Buffer.from(cursor, 'base64').toString();
        // Vérifier que le décodage produit quelque chose de valide
        if (!decoded || decoded.trim() === '') {
            throw new Error('Invalid cursor format');
        }
        return decoded;
    }
    catch (error) {
        throw new Error('Invalid cursor format');
    }
}
// Méthode product.list
export async function productList(params) {
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
// ===== MÉTHODES DE GESTION DES COMMANDES =====
// Fonction utilitaire pour filtrer les commandes
function filterOrders(filters) {
    return orders.filter(order => {
        if (filters.status) {
            const statusFilter = Array.isArray(filters.status) ? filters.status : [filters.status];
            if (!statusFilter.includes(order.status))
                return false;
        }
        if (filters.salesChannel) {
            const channelFilter = Array.isArray(filters.salesChannel) ? filters.salesChannel : [filters.salesChannel];
            if (!channelFilter.includes(order.salesChannel))
                return false;
        }
        if (filters.createdAtFrom) {
            const fromDate = new Date(filters.createdAtFrom);
            if (isNaN(fromDate.getTime()))
                throw new Error('Invalid createdAtFrom date');
            if (new Date(order.createdAt) < fromDate)
                return false;
        }
        if (filters.createdAtTo) {
            const toDate = new Date(filters.createdAtTo);
            if (isNaN(toDate.getTime()))
                throw new Error('Invalid createdAtTo date');
            if (new Date(order.createdAt) > toDate)
                return false;
        }
        if (filters.customerEmail) {
            if (!order.customer.email.toLowerCase().includes(filters.customerEmail.toLowerCase())) {
                return false;
            }
        }
        if (filters.reference) {
            if (!order.reference.toLowerCase().includes(filters.reference.toLowerCase())) {
                return false;
            }
        }
        return true;
    });
}
// Fonction utilitaire pour trier les commandes
function sortOrders(orders, sortBy, sortDir) {
    const sorted = [...orders];
    sorted.sort((a, b) => {
        let aValue, bValue;
        switch (sortBy) {
            case 'createdAt':
                aValue = new Date(a.createdAt);
                bValue = new Date(b.createdAt);
                break;
            case 'updatedAt':
                aValue = new Date(a.updatedAt);
                bValue = new Date(b.updatedAt);
                break;
            case 'reference':
                aValue = a.reference;
                bValue = b.reference;
                break;
            case 'totalAmount':
                aValue = a.totalAmount;
                bValue = b.totalAmount;
                break;
            default:
                aValue = new Date(a.createdAt);
                bValue = new Date(b.createdAt);
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
// Méthode order.list
export async function orderList(params) {
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
        let filteredOrders = filterOrders(params.filters || {});
        const sortBy = params.sortBy || "createdAt";
        const sortDir = params.sortDir || "desc";
        filteredOrders = sortOrders(filteredOrders, sortBy, sortDir);
        // Pagination
        let startIndex = 0;
        if (params.cursor) {
            try {
                const decodedCursor = decodeCursor(params.cursor);
                const cursorIndex = filteredOrders.findIndex(o => o.id === decodedCursor);
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
        const paginatedOrders = filteredOrders.slice(startIndex, startIndex + limit);
        // Génération du curseur suivant
        let nextCursor = null;
        if (startIndex + limit < filteredOrders.length) {
            nextCursor = generateCursor(filteredOrders[startIndex + limit - 1].id);
        }
        return {
            items: paginatedOrders,
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
// Méthode order.get
export async function orderGet(params) {
    try {
        const order = orders.find(o => o.id === params.orderId);
        if (!order) {
            return {
                error: {
                    code: 404,
                    message: "Order not found"
                }
            };
        }
        return order;
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
// Méthode order.acknowledge
export async function orderAcknowledge(params) {
    try {
        const order = orders.find(o => o.id === params.orderId);
        if (!order) {
            return {
                error: {
                    code: 404,
                    message: "Order not found"
                }
            };
        }
        // Vérifier que la commande peut être acceptée
        if (order.status !== "pending") {
            return {
                error: {
                    code: 400,
                    message: `Order cannot be acknowledged. Current status: ${order.status}`
                }
            };
        }
        // Mise à jour du statut (simulation)
        const now = new Date().toISOString();
        order.status = "acknowledged";
        order.acknowledgedAt = now;
        order.updatedAt = now;
        // Mise à jour du statut de tous les articles
        order.items.forEach(item => {
            item.status = "acknowledged";
        });
        return {
            success: true,
            message: "Order acknowledged successfully",
            order: {
                id: order.id,
                reference: order.reference,
                status: order.status,
                acknowledgedAt: order.acknowledgedAt,
                updatedAt: order.updatedAt
            }
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
// Méthode order.ship
export async function orderShip(params) {
    try {
        const order = orders.find(o => o.id === params.orderId);
        if (!order) {
            return {
                error: {
                    code: 404,
                    message: "Order not found"
                }
            };
        }
        // Vérifier que la commande peut être expédiée
        if (order.status !== "acknowledged") {
            return {
                error: {
                    code: 400,
                    message: `Order cannot be shipped. Current status: ${order.status}`
                }
            };
        }
        // Mise à jour du statut (simulation)
        const now = new Date().toISOString();
        order.status = "shipped";
        order.shippedAt = now;
        order.updatedAt = now;
        // Mise à jour du statut et des informations de suivi de tous les articles
        order.items.forEach(item => {
            item.status = "shipped";
            item.trackingNumber = params.trackingNumber;
            item.carrier = params.carrier;
        });
        return {
            success: true,
            message: "Order shipped successfully",
            order: {
                id: order.id,
                reference: order.reference,
                status: order.status,
                shippedAt: order.shippedAt,
                updatedAt: order.updatedAt,
                trackingNumber: params.trackingNumber,
                carrier: params.carrier
            }
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
// Méthode order.cancel
export async function orderCancel(params) {
    try {
        const order = orders.find(o => o.id === params.orderId);
        if (!order) {
            return {
                error: {
                    code: 404,
                    message: "Order not found"
                }
            };
        }
        // Vérifier que la commande peut être annulée
        const cancellableStatuses = ["pending", "acknowledged"];
        if (!cancellableStatuses.includes(order.status)) {
            return {
                error: {
                    code: 400,
                    message: `Order cannot be cancelled. Current status: ${order.status}`
                }
            };
        }
        // Mise à jour du statut (simulation)
        const now = new Date().toISOString();
        order.status = "cancelled";
        order.cancelledAt = now;
        order.updatedAt = now;
        order.cancellationReason = params.reason;
        // Mise à jour du statut de tous les articles
        order.items.forEach(item => {
            item.status = "cancelled";
        });
        return {
            success: true,
            message: "Order cancelled successfully",
            order: {
                id: order.id,
                reference: order.reference,
                status: order.status,
                cancelledAt: order.cancelledAt,
                updatedAt: order.updatedAt,
                cancellationReason: order.cancellationReason
            }
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