
require('dotenv').config();
const { PDFParse } = require('pdf-parse');

async function test() {
  // Create a minimal valid PDF in memory to test
  // Just test the API shape
  const parser = new PDFParse();
  console.log('PDFParse instance created OK');
  console.log('methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(parser)));
}
test().catch(e => console.log('ERR:', e.message));
