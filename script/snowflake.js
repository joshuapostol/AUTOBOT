module.exports.config = {
	name: "snowflake",
	version: "1.0.0",
	hasPermission: 0,
	hashPermission: 2,
	credits: "joshua Apostol",
	description: "Get response from snowflake API",
	commandCategory: "fun",
	cooldowns: 5,
	hashPrefix: true,
	dependencies: {
		"axios": ""
	}
};

const axios = require("axios");

module.exports.run = async function({ api, event, args }) {
	const input = args.join(" ");
	if (!input) {
		api.sendMessage("⚠️ Please provide a question.", event.threadID, event.messageID);
		return;
	}
	
	api.sendMessage("⏱️ | Fetching response. Please wait...", event.threadID, event.messageID);
	
	const response = await axios.get(`https://hashier-api-snowflake.vercel.app/api/snowflake?ask=${encodeURIComponent(input)}`).catch(error => {
		api.sendMessage("Error fetching response.", event.threadID, event.messageID);
		console.error(error);
		return;
	});
	
	if (response && response.status === 200 && response.data && response.data.answer) {
		const answer = response.data.answer;
		const question = input;
		
		const message = `
			💭 Question:
			${question}

			💡 Answer:
			${answer}
		`;
		
		api.sendMessage("```" + message + "```", event.threadID);
	} else {
		api.sendMessage("Failed to get a response.", event.threadID);
	}
};
