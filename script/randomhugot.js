module.exports.config = {
	name: "randomhugot",
	version: "1.0.0",
	hasPermission: 0,
	hashPermission: 2,
	credits: "joshua Apostol",
	description: "Get a random hugot quote",
	commandCategory: "fun",
	cooldowns: 5,
	hashPrefix: true,
	dependencies: {
		"axios": ""
	}
};

const axios = require("axios");

module.exports.run = async function({ api, event }) {
	api.sendMessage("⏱️ | Fetching random hugot quote. Please wait...", event.threadID, event.messageID);
  
	const response = await axios.get('https://joshua09.pythonanywhere.com/hugot').catch(error => {
		api.sendMessage("Error fetching hugot quote.", event.threadID, event.messageID);
		console.error(error);
		return;
	});
  
	if (response && response.status === 200 && response.data && response.data.message) {
		api.sendMessage(response.data.message, event.threadID);
	} else {
		api.sendMessage("Failed to retrieve a hugot quote.", event.threadID);
	}
};
