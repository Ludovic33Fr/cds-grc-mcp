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
//# sourceMappingURL=mcp.js.map