const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Model priority: primary -> fallback
const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash-lite'];

// Simple in-memory cache with TTL (10 minutes)
const cache = new Map();
const CACHE_TTL = 10 * 60 * 1000;

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) { cache.delete(key); return null; }
  return entry.value;
}

function setCached(key, value) {
  cache.set(key, { value, ts: Date.now() });
}

function isQuotaError(err) {
  const msg = err.message || '';
  return msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED');
}

/**
 * Call Gemini with auto-fallback on quota errors.
 * Returns parsed JSON. Throws on all-model failure.
 * @param {string} prompt
 * @param {string} [cacheKey] - optional cache key; if provided, result is cached
 */
async function generateJSON(prompt, cacheKey) {
  if (cacheKey) {
    const hit = getCached(cacheKey);
    if (hit) { console.log('[ai] cache hit:', cacheKey); return hit; }
  }

  let lastErr;
  for (const modelName of MODELS) {
    try {
      console.log(`[ai] trying ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      let text = result.response.text().trim();
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(text);
      if (cacheKey) setCached(cacheKey, parsed);
      return parsed;
    } catch (err) {
      lastErr = err;
      if (isQuotaError(err)) {
        console.warn(`[ai] quota hit on ${modelName}, trying next model`);
        continue;
      }
      // Non-quota error -- don't try fallback, throw immediately
      throw err;
    }
  }

  throw new Error(`All Gemini models exhausted. Last error: ${lastErr?.message}`);
}

module.exports = { generateJSON };
