const { get } = require('axios');
const fs = require('fs');
const path = require('path');

let url = "https://ai-tools.replit.app";
let cacheDir = path.join(__dirname, 'cache');
let filePath = path.join(cacheDir, 'pixart.png');

module.exports.config = {
		name: "pxart",
		version: "1.0.0",
		role: 0,
		hasPrefix: false,
		credits: "Deku",
		description: "Generate image in pixart",
		usages: "[prompt | style]",
		cooldown: 5,
	  aliases: ["px"]
};

module.exports.run = async function({ api, event, args }) {
		function sendMessage(msg) {
				api.sendMessage(msg, event.threadID, event.messageID);
		}

		let styleList = `•——[Style list]——•\n\n1. Cinematic\n2. Photographic\n3. Anime\n4. Manga\n5. Digital Art\n6. Pixel art\n7. Fantasy art\n8. Neonpunk\n9. 3D Model`;

		if (!args[0] || !args[1]) {
				return sendMessage('Missing prompt and style\n\n' + styleList);
		}

		let [prompt, style] = args.join(" ").split("|").map(item => item.trim());

		if (!prompt) {
				return sendMessage('Missing prompt!');
		}
		if (!style) {
				return sendMessage('Missing style!\n\n' + styleList);
		}

		try {
				const response = await get(url + '/pixart', {
						params: {
								prompt: prompt,
								styles: style
						},
						responseType: 'arraybuffer'
				});

				fs.mkdirSync(cacheDir, { recursive: true });
				fs.writeFileSync(filePath, Buffer.from(response.data, "utf8"));

				return sendMessage({ attachment: fs.createReadStream(filePath) });
		} catch (error) {
				return sendMessage(error.message);
		}
}
