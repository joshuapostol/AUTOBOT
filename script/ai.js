module.exports.run = async function ({ api, event, args, message }) {
    try {
        let prompt = args.join(" ");
        const uid = event.senderID;
        let url;

        if (!prompt) {
            await api.sendMessage({ body: "Hey I am Ai, ask me question 🤖" }, event.threadID);
            return;
        }

        const geminiApi = `https://gemini-api.replit.app`;

        if (event.type == "message_reply" && event.messageReply.attachments[0]?.type == "photo") {
            api.sendTypingIndicator(event.threadID);
            url = encodeURIComponent(event.messageReply.attachments[0].url);
            const res = axios.get(`${geminiApi}/gemini?prompt=${prompt}&url=${url}&uid=${uid}`);
            api.sendMessage(res.data.gemini, event.threadID);
            return;
        }

        if (event.attachments.length > 0 && event.attachments[0].type == "photo") {
            api.sendTypingIndicator(event.threadID);
            url = encodeURIComponent(event.attachments[0].url);
            const res = axios.get(`${geminiApi}/gemini?prompt=${prompt}&url=${url}&uid=${uid}`);
            api.sendMessage(res.data.gemini, event.threadID);
            return;
        }

        api.sendTypingIndicator(event.threadID);
        const response = axios.get(`${geminiApi}/gemini?prompt=${prompt}&uid=${uid}`);
        api.sendMessage(response.data.gemini, event.threadID);

    } catch (error) {
        console.error("🔴 An error occurred while processing your request.\nPlease contact churchill abing for an error", error.message);
        api.setMessageReaction("🔴", event.messageID, (err) => { }, true);
    }
};
