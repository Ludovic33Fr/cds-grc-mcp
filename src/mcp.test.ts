import { describe, it, expect } from 'vitest';
import { getInfoSeller } from './mcp.js';

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
