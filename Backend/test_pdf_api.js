
require('dotenv').config();
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

// Create a minimal test PDF buffer to test the API
// pdf-parse v2 changed its API
console.log('pdf-parse version:', require('./node_modules/pdf-parse/package.json').version);
console.log('pdf-parse type:', typeof pdfParse);
console.log('pdf-parse keys:', Object.keys(pdfParse));

// Check if it's a default export issue
const pp = require('pdf-parse');
console.log('default:', typeof pp.default);
