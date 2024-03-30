module.exports.config = {
  name: "gemini",
  hasPermission: 0,
  credits: "Deku", //https://facebook.com/joshg101
  description: "Talk to Gemini (conversational)",
  usePrefix: false,
  commandCategory: "bard",
  version: "5.6.7"
};

module.exports.run = async function ({ api, event, args }) {
	const axios = require("axios");
	let prompt = args.join(" "),
		uid = event.senderID,
		url;
	if (!prompt) return api.sendMessage(`Please enter a prompt.`, event.threadID);
	api.sendTypingIndicator(event.threadID);
	try {
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
		return api.sendMessage(response.gemini, event.threadID);
	} catch (error) {
		console.error(error);
		return api.sendMessage('❌ | An error occurred. You can try typing your query again or resending it. There might be an issue with the server that\'s causing the problem, and it might resolve on retrying.', event.threadID);
	}
};
