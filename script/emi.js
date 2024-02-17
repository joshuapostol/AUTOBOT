const { get } = require('axios');
const fs = require('fs');
const path = require('path');

let url = "https://ai-tools.replit.app";
let f = path.join(__dirname, 'cache', 'emi.png');

module.exports.config = {
		name: "emi",
		version: "1.0.0",
		role: 0,
	  hasPrefix: false,
		credits: "Deku",
		description: "Generate image in emi",
		usages: "[prompt]",
		cooldown: 5,
		aliases: ["em"]
};

module.exports.run = async function ({ api, event, args }) {
		function r(msg) {
				api.sendMessage(msg, event.threadID, event.messageID);
		}

		if (!args[0]) return r('Missing prompt!');

		const a = args.join(" ");
		if (!a) return r('Missing prompt!');
		try {
				const d = (await get(url + '/emi?prompt=' + encodeURIComponent(a), {
						responseType: 'arraybuffer'
				})).data;
				fs.writeFileSync(f, Buffer.from(d, "utf8"));
				return r({ attachment: fs.createReadStream(f) });
		} catch (e) {
				return r(e.message);
		}
};
