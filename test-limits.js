import { productList, productGetVariants } from './build/mcp.js';

async function testLimits() {
  try {
    console.log('=== TESTING LIMIT VALIDATION ===');
    
    // Test productList avec limit = 0
    console.log('\n--- productList avec limit = 0 ---');
    const result1 = await productList({ limit: 0 });
    console.log('Result:', result1);
    console.log('Has error:', !!result1.error);
    if (result1.error) {
      console.log('Error code:', result1.error.code);
      console.log('Error message:', result1.error.message);
    }
    
    // Test productList avec limit = -1
    console.log('\n--- productList avec limit = -1 ---');
    const result2 = await productList({ limit: -1 });
    console.log('Result:', result2);
    console.log('Has error:', !!result2.error);
    if (result2.error) {
      console.log('Error code:', result2.error.code);
      console.log('Error message:', result2.error.message);
    }
    
    // Test productGetVariants avec limit = 0
    console.log('\n--- productGetVariants avec limit = 0 ---');
    const result3 = await productGetVariants({ 
      groupReference: "VARI-IPHONE-13",
      limit: 0 
    });
    console.log('Result:', result3);
    console.log('Has error:', !!result3.error);
    if (result3.error) {
      console.log('Error code:', result3.error.code);
      console.log('Error message:', result3.error.message);
    }
    
    // Test productGetVariants avec limit = -1
    console.log('\n--- productGetVariants avec limit = -1 ---');
    const result4 = await productGetVariants({ 
      groupReference: "VARI-IPHONE-13",
      limit: -1 
    });
    console.log('Result:', result4);
    console.log('Has error:', !!result4.error);
    if (result4.error) {
      console.log('Error code:', result4.error.code);
      console.log('Error message:', result4.error.message);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testLimits();
