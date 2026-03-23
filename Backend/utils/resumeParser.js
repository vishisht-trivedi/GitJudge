const { generateJSON } = require('./ai');

/**
 * Extract structured claims from raw resume text using Gemini.
 * Returns array of claim objects.
 */
async function extractResumeClaims(resumeText) {
  const prompt = `You are analyzing a resume. Extract all technical claims the candidate makes.
Return ONLY valid JSON — no markdown, no code fences.

{
  "name": "candidate name or null",
  "claims": [
    {
      "claim": "short description of the claim (e.g. 'Built REST API with Node.js')",
      "category": "language | framework | tool | project | experience | certification | other",
      "skill": "primary skill or technology mentioned"
    }
  ],
  "topSkills": ["skill1", "skill2", "skill3"],
  "yearsExperience": "number or null",
  "roles": ["role1", "role2"]
}

Resume text (first 4000 chars):
${resumeText.slice(0, 4000)}`;

  return generateJSON(prompt, `resume:${Buffer.from(resumeText.slice(0, 200)).toString('base64')}`);
}

module.exports = { extractResumeClaims };
