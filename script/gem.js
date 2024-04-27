const axios = require("axios");

module.exports.config = {
    name: "gemini",
    role: 0,
    credits: "joshua Apostol",
    description: "Talk to Gemini (conversational)",
    hasPrefix: false,
    version: "5.6.7",
    aliases: ["bard"],
    usage: "gemini [prompt]",
    cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
    let prompt = args.join(" "),
        uid = event.senderID,
        url;
    if (!prompt) return api.sendMessage(`Please enter a prompt.`, event.threadID);
    api.sendTypingIndicator(event.threadID);
    try {
        const geminiApi = `https://deku-rest-api.replit.app/gemini?prompt=hello&uid=100`;
        const response = await axios.get(`${geminiApi}?prompt=${encodeURIComponent(prompt)}&uid=${uid}`);
        return api.sendMessage(response.data.gemini, event.threadID);
    } catch (error) {
        console.error(error);
        return api.sendMessage('❌ | An error occurred. You can try typing your query again or resending it. There might be an issue with the server that\'s causing the problem, and it might resolve on retrying.', event.threadID);
    }
};
