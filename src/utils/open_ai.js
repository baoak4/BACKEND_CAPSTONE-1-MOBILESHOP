const OpenAI = require("openai");
const KEY = require("../config/key");

let cachedClient = null;

function getOpenAIClient() {
    const key = KEY.OPENAI_API_KEY && String(KEY.OPENAI_API_KEY).trim();
    if (!key) {
        return null;
    }
    if (!cachedClient) {
        cachedClient = new OpenAI({ apiKey: key });
    }
    return cachedClient;
}

const openAiModel = KEY.OPENAI_MODEL;

module.exports = { getOpenAIClient, openAiModel };
