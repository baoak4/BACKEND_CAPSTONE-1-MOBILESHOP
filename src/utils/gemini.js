const { GoogleGenerativeAI } = require("@google/generative-ai");
const KEY = require("../config/key");
const { SYSTEM_PROMPT } = require("./prompt");

let cachedModel = null;

function getGeminiModel() {
    const apiKey = KEY.GEMINI_API_KEY && String(KEY.GEMINI_API_KEY).trim();
    if (!apiKey) {
        return null;
    }
    if (!cachedModel) {
        const genAI = new GoogleGenerativeAI(apiKey);
        cachedModel = genAI.getGenerativeModel({
            model: KEY.GEMINI_MODEL || "gemini-2.5-flash",
            systemInstruction: SYSTEM_PROMPT,
            generationConfig: {
                responseMimeType: "application/json",
            },
        });
    }
    return cachedModel;
}

module.exports = { getGeminiModel };
