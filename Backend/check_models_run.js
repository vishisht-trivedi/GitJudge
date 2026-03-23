
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function main() {
  const models = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-2.0-flash-lite', 'gemini-2.5-flash'];
  for (const m of models) {
    try {
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.generateContent('Say OK');
      console.log('WORKS:', m, '->', result.response.text().trim().slice(0,20));
    } catch(e) {
      console.log('FAIL:', m, '->', e.message.slice(0,100));
    }
  }
}
main();
