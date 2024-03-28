module.exports = {
	config: {
		name: 'gemini',
		version: '2.5.4',
		author: 'Deku', // Credits the owner of this API (Facebook Profile: https://www.facebook.com/profile.php?id=100087212564100)
		role: 0,
		category: 'bard',
		shortDescription: {
			en: 'Talk to Gemini (conversational).', // Provides a brief description of what the module does
		},
		guide: {
			en: '{pn} [prompt]', // Describes how to use the module, indicating that it requires a prompt as an argument
		},
	},

	onStart: async function ({ api, event, args }) {
		const axios = require("axios");
		const ownerLink = 'https://www.facebook.com/profile.php?id=100087212564100'; // Your Facebook profile link
		let prompt = args.join(" "),
			uid = event.senderID,
			url;
		if (!prompt) return api.sendMessage(`Please enter a prompt.`, event.threadID); // Checks if a prompt is provided, if not, prompts the user to enter one
		api.sendTypingIndicator(event.threadID);
		try {
			const geminiApi = `https://gemini-api.replit.app`;
			if (event.type == "message_reply") {
				if (event.messageReply.attachments[0]?.type == "photo") {
					url = encodeURIComponent(event.messageReply.attachments[0].url);
					const res = (await axios.get(`${geminiApi}/gemini?prompt=${prompt}&url=${url}&uid=${uid}`)).data; // Calls Gemini API with prompt and image URL
					return api.sendMessage(`${res.gemini}\n\n${ownerLink}`, event.threadID); // Sends Gemini's response back to the user with owner's link
				} else {
					return api.sendMessage('Please reply to an image.', event.threadID); // Prompts the user to reply with an image if they didn't
				}
			}
			const response = (await axios.get(`${geminiApi}/gemini?prompt=${prompt}&uid=${uid}`)).data; // Calls Gemini API with prompt only
			return api.sendMessage(`${response.gemini}\n\n${ownerLink}`, event.threadID); // Sends Gemini's response back to the user with owner's link
		} catch (error) {
			console.error(error);
			return api.sendMessage('❌ | An error occurred. You can try typing your query again or resending it. There might be an issue with the server that\'s causing the problem, and it might resolve on retrying.', event.threadID); // Informs the user about the error that occurred during the process
		}
	}
};
