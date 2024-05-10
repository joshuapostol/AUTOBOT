const axios = require('axios');
module.exports.config = {
  name: 'ai',
  hasPermssion: 0,
  credits: "𝐌𝐀𝐑𝐉𝐇𝐔𝐍 𝐁𝐀𝐘𝐋𝐎𝐍",
  description: '𝙴𝙳𝚄𝙲𝙰𝚃𝙸𝙾𝙽𝙰𝙻 𝙰𝙸 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 ',
  usePrefix: false,
  commandCategory: 'educational',
  usages: '𝙰𝙸 - 𝚈𝙾𝚄𝚁 𝚀𝚄𝙴𝚂𝚃      𝙸𝙾𝙽 ',
  cooldown: 2,
};
module.exports.run = async function({ api, event, args }) {
  try {
    const prompt = encodeURIComponent(args.join(" "));
    if (!prompt) return api.sendMessage("🤖 Please enter a prompt!!!", event.threadID, event.messageID);
    api.sendMessage("Processing your question...", event.threadID, event.messageID);
    const apiUrl = "https://boxgptapi.replit.app/api/blackbox?msg=";
    const response = await axios.get(apiUrl + prompt);
    const responseData = response.data.message;

    await api.sendMessage(`${responseData}`, event.threadID);
  } catch (error) {
    console.error(error);
    return api.sendMessage(error.message, event.threadID, event.messageID);
  }
};
