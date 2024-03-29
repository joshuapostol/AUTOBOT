const axios = require('axios');

module.exports.config = {
  name: "ai",
  version: "69",
  role: 0,
  credits: "OtinXSandip", // converted by kira
  description: "ask AI",
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

    await api.sendMessage({
      body: `𝗕𝗢𝗧 𝗥𝗘𝗦𝗣𝗢𝗡𝗦𝗘 | 🟢
━━━━━━━━━━━━━━━━━━        
${answer}
━━━━━━━━━━━━━━━━━━\n\n- 𝚃𝚑𝚒𝚜 𝚋𝚘𝚝 was create 𝚋𝚢 churchill \n• 𝐅𝐛𝐥𝐢𝐧𝐤: >>https://www.facebook.com/profile.php?id=100087212564100<<`,
    }, event.threadID);

  } catch (error) {
    console.error("🔴 An error occurred while processing your request.\nPlease contact churchill for an error", error.message);
    api.setMessageReaction("🔴", event.messageID, (err) => {}, true);
  }
};
