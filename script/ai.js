const axios = require('axios');

module.exports.config = {
  name: 'ai',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  description: "Description of your command",
  usage: "ai [prompt]",
  credits: 'joshua', // Credits for creating the command
  cooldown: 2, // Cooldown in seconds
};

module.exports.run = async function({ api, event, args }) {
    try {
        const prompt = encodeURIComponent(args.join(" "));
        if (!prompt) return api.sendMessage("Please enter a prompt!!!", event.threadID, event.messageID);
        api.sendMessage("Processing your question...", event.threadID, event.messageID);
        const apiUrl = "https://joshweb.click/new/gpt-4_adv?prompt=";
        const response = await axios.get(apiUrl + prompt);
        const responseData = response.data;
        return api.sendMessage(`Response: ${responseData}`, event.threadID, event.messageID);
    } catch (error) {
        console.error(error);
        return api.sendMessage(error.message, event.threadID, event.messageID);
    }
};
