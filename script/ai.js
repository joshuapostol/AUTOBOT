const axios = require('axios');

module.exports.config = {
  name: "ai",
  version: "69",
  role: 0,
  credits: "OtinXSandip", // converted by kira
  description: "Ask AI",
  usages: "ask <question>",
  hasPrefix: false,
  commandCategory: "ai",
  cooldowns: 0
};
  
module.exports.run = async function ({ api, event, args, message }) {
  try {
    const prompt = event.body.trim();
    if (!prompt) {
      await api.sendMessage({ body: "Hey I am Ai, ask me questions dear 🤖" }, event.threadID);
      return;
    }
    api.setMessageReaction("🔎", event.messageID, (err) => {}, true);
    const response = await axios.get(`https://sandipapi.onrender.com/gpt?prompt=${encodeURIComponent(prompt)}`);
    api.setMessageReaction("✅", event.messageID, (err) => {}, true);
    const answer = response.data.answer;

    const fbLink = "https://www.facebook.com/profile.php?id=100087212564100"; // Your Facebook link

    await api.sendMessage({
      body: `𝗕𝗢𝗧 𝗥𝗘𝗦𝗣𝗢𝗡𝗦𝗘 | 🟢
━━━━━━━━━━━━━━━━━━        
${answer}
━━━━━━━━━━━━━━━━━━\n\n- This bot was created by Churchill\n• devname: >>${CHURCHILL}<<`,
    }, event.threadID);

  } catch (error) {
    console.error("🔴 An error occurred while processing your request.\nPlease contact Churchill for an error", error.message);
    api.setMessageReaction("🔴", event.messageID, (err) => {}, true);
  }
};
