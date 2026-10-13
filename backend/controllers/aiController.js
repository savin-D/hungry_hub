const { GoogleGenerativeAI } = require("@google/generative-ai");

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  throw new Error('Missing GEMINI_API_KEY environment variable. Set GEMINI_API_KEY in backend/.env.')
}

const genAI = new GoogleGenerativeAI(geminiApiKey);

exports.suggestRecipe = async (req, res) => {
  try {
    let { ingredients } = req.body;

    if (!ingredients) {
      return res.status(400).json({ message: "Ingredients required" });
    }

    if (typeof ingredients === 'string') {
      ingredients = ingredients
        .split(/[\n,]+/)
        .map(i => i.trim())
        .filter(Boolean);
    }

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ message: "Ingredients must be a non-empty list" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Create a simple recipe using these ingredients:
${ingredients.join(", ")}

Return:
Title
Ingredients
Steps
Cook Time
`;

    const result = await model.generateContent(prompt);
    const response = typeof result.response?.text === 'function'
      ? await result.response.text()
      : result.response?.text || result.response || '';

    res.json({ aiRecipe: response });

  } catch (error) {
    res.status(500).json({ message: error?.message || String(error) });
  }
};