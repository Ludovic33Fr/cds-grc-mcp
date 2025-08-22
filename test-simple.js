import { getInfoSeller } from './build/mcp.js';

async function test() {
  try {
    console.log('=== TESTING toLocaleString ===');
    const testNumber = 15420;
    console.log('Number:', testNumber);
    console.log('toLocaleString():', testNumber.toLocaleString());
    console.log('Expected: 15,420');
    
    console.log('\n=== TESTING getInfoSeller ===');
    const result = await getInfoSeller('test-token');
    console.log('Result type:', typeof result);
    console.log('Result length:', result.length);
    
    // Afficher ligne par ligne
    const lines = result.split('\n');
    console.log('\n=== LINES ===');
    lines.forEach((line, index) => {
      if (line.includes('Ventes totales') || line.includes('15') || line.includes('commandes')) {
        console.log(`${index}: "${line}"`);
        console.log(`  Length: ${line.length}`);
        console.log(`  Hex: ${Buffer.from(line).toString('hex')}`);
        console.log(`  Contains "15 420": ${line.includes('15 420')}`);
        console.log(`  Contains "15": ${line.includes('15')}`);
        console.log(`  Contains "420": ${line.includes('420')}`);
      }
    });
    
    // Chercher la ligne spécifique
    const salesLine = lines.find(line => line.includes('Ventes totales'));
    if (salesLine) {
      console.log('\n=== SALES LINE ANALYSIS ===');
      console.log('Line:', `"${salesLine}"`);
      console.log('Length:', salesLine.length);
      console.log('Hex:', Buffer.from(salesLine).toString('hex'));
      console.log('Contains "15 420":', salesLine.includes('15 420'));
      console.log('Contains "15":', salesLine.includes('15'));
      console.log('Contains "420":', salesLine.includes('420'));
      console.log('Contains "commandes":', salesLine.includes('commandes'));
    }
    
    console.log('\n=== CHECKING CONTENT ===');
    console.log('Contains "15 420":', result.includes('15 420'));
    console.log('Contains "commandes":', result.includes('commandes'));
    console.log('Contains "TechStore":', result.includes('TechStore'));
    console.log('Contains "Ventes totales":', result.includes('Ventes totales'));
  } catch (error) {
    console.error('Error:', error);
  }
}

test();
