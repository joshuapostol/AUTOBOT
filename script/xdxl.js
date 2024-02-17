const { get } = require('axios');
const fs = require('fs');

let url = "https://ai-tools.replit.app";
let f = __dirname+'/cache/sdxl.png';

module.exports.config = {
		name: "sdxl",
		version: "1.0.0",
		role: 0,
		credits: "Deku",
		description: "Generate image in sdxl",
		hasPrefix: false,
		usages: "[prompt | style]",
		cooldown: 0,
    aliases: ["sd"]	  
};

module.exports.run = async function({ api, event, args }) {
		function r(msg) {
				api.sendMessage(msg, event.threadID, event.messageID);
		}

		let g = `•——[Style list]——•\n\n1. Cinematic\n2. Photographic\n3. Anime\n4. Manga\n5. Digital Art\n6. Pixel art\n7. Fantasy art\n8. Neonpunk\n9. 3D Model`;

		if (!args[0]) return r('Missing prompt and style\n\n' + g);

		const [prompt, style] = args.join(" ").split("|").map(item => item.trim());

		if (!prompt) return r('Missing prompt!');
		if (!style) return r('Missing style!\n\n' + g);

		try {
				const response = await get(`${url}/sdxl?prompt=${encodeURIComponent(prompt)}&styles=${encodeURIComponent(style)}`, {
						responseType: 'arraybuffer'
				});

				fs.writeFileSync(f, Buffer.from(response.data, "utf8"));

				return r({ attachment: fs.createReadStream(f, () => fs.unlinkSync(f)) });
		} catch (e) {
				return r(e.message);
		}
};
