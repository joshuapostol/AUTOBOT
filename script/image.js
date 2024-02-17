const axios = require('axios');

module.exports.config = {
	name: "image",
	version: "1.0.1",
	role: 0,
	credits: "CHATGPT",
	description: "Search for high-quality images using Unsplash API and return a specified number of results.",
	usages: "{P}{N}",
	hasPrefix: false,
	cooldown: 5
};

module.exports.run = async function({ args, message }) {
	try {
		const query = args.join(' ');
		const numResults = parseInt(args[0]) || 5; // Default to 5 if no number is provided
		const url = `https://api.unsplash.com/search/photos?page=1&per_page=${numResults}&query=${query}&client_id=oWmBq0kLICkR_5Sp7m5xcLTAdkNtEcRG7zrd55ZX6oQ`;

		const { data } = await axios.get(url);
		const results = data.results.map(result => result.urls.regular);

		const attachments = await Promise.all(results.map(async url => {
			const response = await axios.get(url, { responseType: 'arraybuffer' });
			return { data: Buffer.from(response.data, 'binary'), name: 'image.jpg' };
		}));

		return message.reply({ body: `Here are the top ${numResults} high-quality image results for "${query}" from Unsplash:`, attachment: attachments });
	} catch (error) {
		console.error(error);
		return message.reply("Sorry, I couldn't find any results.");
	}
};
