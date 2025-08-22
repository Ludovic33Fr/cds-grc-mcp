import { productList } from './build/mcp.js';

async function testSort() {
  try {
    console.log('=== TESTING SORT ===');
    
    // Test tri par updatedAt desc (par défaut)
    console.log('\n--- Tri par updatedAt desc (par défaut) ---');
    const result1 = await productList({ limit: 10 });
    console.log('Items count:', result1.items.length);
    
    result1.items.forEach((item, index) => {
      console.log(`${index}: ${item.gtin} - updatedAt: ${item.updatedAt}`);
    });
    
    // Vérifier l'ordre
    for (let i = 0; i < result1.items.length - 1; i++) {
      const current = new Date(result1.items[i].updatedAt);
      const next = new Date(result1.items[i + 1].updatedAt);
      console.log(`Comparing ${i}: ${current.toISOString()} >= ${next.toISOString()} = ${current >= next}`);
    }
    
    // Test tri par createdAt asc
    console.log('\n--- Tri par createdAt asc ---');
    const result2 = await productList({ sortBy: "createdAt", sortDir: "asc", limit: 10 });
    console.log('Items count:', result2.items.length);
    
    result2.items.forEach((item, index) => {
      console.log(`${index}: ${item.gtin} - createdAt: ${item.createdAt}`);
    });
    
    // Vérifier l'ordre
    for (let i = 0; i < result2.items.length - 1; i++) {
      const current = new Date(result2.items[i].createdAt);
      const next = new Date(result2.items[i + 1].createdAt);
      console.log(`Comparing ${i}: ${current.toISOString()} <= ${next.toISOString()} = ${current <= next}`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testSort();
