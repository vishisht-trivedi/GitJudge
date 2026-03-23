import subprocess

script = """
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
"""

with open('/home/visi/linux_entry/GitJudge/Backend/check_models_run.js', 'w') as f:
    f.write(script)

result = subprocess.run(
    ['node', 'check_models_run.js'],
    capture_output=True, text=True,
    cwd='/home/visi/linux_entry/GitJudge/Backend'
)
print(result.stdout)
if result.stderr:
    print('ERR:', result.stderr[:300])
