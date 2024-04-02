const axios = require("axios");
const fs = require('fs');
const path = require('path');

module.exports = {
	config: {
		name: "pinterest",
		usePrefix: true,
		credits: "1SOY DEV",
		usage: "imgsearch query",
		description: "Search for an image on Google",
		permission: 0,
		// Other configuration properties
		commandCategory:"Image Search",
	},
	run: async function ({ api, event, args, commandModules }) {
		const query = args.join(" ");

		if (!query) {
			api.sendMessage("Please Provide A Query...", event.threadID, event.messageID);
			return;
		}

		api.sendMessage("Searching Image🔍, Please Wait.....", event.threadID).then(async (messageInfo) => {
			try {
				const res = await axios.get(`https://pinterest.ea-sy.tech/v1/pinterest?s=${query}`);
				const imgUrls = res.data.urls;
				const imgCount = imgUrls.length;

				if (imgCount === 0) {
					api.sendMessage(`No image results found for "${query}"`, event.threadID, event.messageID);
					return;
				}

				const randomIndices = getRandomIndices(imgCount, Math.min(10, imgCount));
				const attachments = [];

				for (let i = 0; i < randomIndices.length; i++) {
					const index = randomIndices[i];
					const url = imgUrls[index];
					const imageResponse = await axios.get(url, { responseType: "arraybuffer" });
					const imagePath = path.join(__dirname, 'cache', `imgsearch_${i}.png`);
					fs.writeFileSync(imagePath, Buffer.from(imageResponse.data));
					attachments.push(fs.createReadStream(imagePath));
				}

				api.sendMessage({
					body: `This is the 10 random Image Result \nTotal Result of ${imgCount}`,
					attachment: attachments,
				}, event.threadID, (err, msgInfo) => {
					if (!err) {
						api.unsendMessage(messageInfo.messageID);
					} else {
						console.error(err);
					}
				});
			} catch (error) {
				console.error(error);
			}
		});
	},
};

function getRandomIndices(max, count) {
	const indices = Array.from({ length: max }, (_, i) => i);
	for (let i = max - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[indices[i], indices[j]] = [indices[j], indices[i]];
	}
	return indices.slice(0, count);
}
