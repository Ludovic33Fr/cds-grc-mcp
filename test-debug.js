import { productList } from './build/mcp.js';

async function debugLimit() {
  try {
    console.log('=== DEBUGGING LIMIT = 0 ===');
    
    // Test avec limit = 0
    console.log('\n--- Test avec limit = 0 ---');
    const result = await productList({ limit: 0 });
    
    console.log('Result type:', typeof result);
    console.log('Result keys:', Object.keys(result));
    console.log('Has error:', !!result.error);
    
    if (result.error) {
      console.log('Error details:', result.error);
    } else {
      console.log('Items count:', result.items?.length);
      console.log('Items per page:', result.itemsPerPage);
      console.log('Next cursor:', result.nextCursor);
    }
    
    // Test avec limit = 0.5
    console.log('\n--- Test avec limit = 0.5 ---');
    const result2 = await productList({ limit: 0.5 });
    
    console.log('Result type:', typeof result2);
    console.log('Result keys:', Object.keys(result2));
    console.log('Has error:', !!result2.error);
    
    if (result2.error) {
      console.log('Error details:', result2.error);
    } else {
      console.log('Items count:', result2.items?.length);
      console.log('Items per page:', result2.itemsPerPage);
      console.log('Next cursor:', result2.nextCursor);
    }
    
    // Test avec limit = "0"
    console.log('\n--- Test avec limit = "0" ---');
    const result3 = await productList({ limit: "0" });
    
    console.log('Result type:', typeof result3);
    console.log('Result keys:', Object.keys(result3));
    console.log('Has error:', !!result3.error);
    
    if (result3.error) {
      console.log('Error details:', result3.error);
    } else {
      console.log('Items count:', result3.items?.length);
      console.log('Items per page:', result3.itemsPerPage);
      console.log('Next cursor:', result3.nextCursor);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

debugLimit();
