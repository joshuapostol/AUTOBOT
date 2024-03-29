const axios = require('axios');

module.exports.config = {
    name: "ai",
    version: "69",
    role: 0,
    credits: "OtinXSandip", // converted by kira
    description: "Talk to Gemini (conversational)",
    usages: "ask <question>",
    hasPrefix: false,
    commandCategory: "ai",
    cooldowns: 0
};

module.exports.run = async function ({ api, event, args, message }) {
    try {
        let prompt = args.join(" ");
        const uid = event.senderID;
        let url;
        
        if (!prompt) {
            await api.sendMessage({ body: "Hey I am Ai, ask me questions dear 🤖" }, event.threadID);
            return;
        }
        
        api.sendTypingIndicator(event.threadID);
        
        const geminiApi = `https://gemini-api.replit.app`;
        
        if (event.type == "message_reply") {
            if (event.messageReply.attachments[0]?.type == "photo") {
                url = encodeURIComponent(event.messageReply.attachments[0].url);
                const res = (await axios.get(`${geminiApi}/gemini?prompt=${prompt}&url=${url}&uid=${uid}`)).data;
                return api.sendMessage(res.gemini, event.threadID);
            } else {
                return api.sendMessage('Please reply to an image.', event.threadID);
            }
        }
        
        const response = (await axios.get(`${geminiApi}/gemini?prompt=${prompt}&uid=${uid}`)).data;
        const answer = response.gemini;

        await api.sendMessage({
            body: `𝗕𝗢𝗧 𝗥𝗘𝗦𝗣𝗢𝗡𝗦𝗘 | 🟢
━━━━━━━━━━━━━━━━━━        
${answer}
━━━━━━━━━━━━━━━━━━\n\n- 𝚃𝚑𝚒𝚜 𝚋𝚘𝚝 𝚞𝚗𝚍𝚎𝚛 𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚍 𝚋𝚢 churchill\n• 𝐅𝐛𝐥𝐢𝐧𝐤: >>https://www.facebook.com/profile.php?id=100087212564100<<`,
        }, event.threadID);
    } catch (error) {
        console.error("🔴 An error occurred while processing your request.\nPlease contact churchill abing for an error", error.message);
        api.setMessageReaction("🔴", event.messageID, (err) => {}, true);
    }
};
