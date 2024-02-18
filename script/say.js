const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
	name: "say",
	version: "1.0.0",
	role: 0,
	credits: "Yan Maglinte",
	description: "text to voice speech messages",
	hasPrefix: true, //SWITCH TO "false" IF YOU WANT TO DISABLE PREFIX
	usages: `Text to speech messages`,
	cooldown: 5,
};

module.exports.run = async function({ api, event, args }) {
	try {
		const { createReadStream, unlinkSync } = fs;
		const { resolve } = path;

		var content = (event.type == "message_reply") ? event.messageReply.body : args.join(" ");
		var languageToSay = (["ru", "en", "ko", "ja", "tl"].some(item => content.indexOf(item) == 0)) ? content.slice(0, content.indexOf(" ")) : this.config.language;
		var msg = (languageToSay != this.config.language) ? content.slice(3, content.length) : content;

		const filePath = resolve(__dirname, 'cache', `${event.threadID}_${event.senderID}.mp3`);
		await downloadFile(`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(msg)}&tl=${languageToSay}&client=tw-ob`, filePath);

		return api.sendMessage({ attachment: createReadStream(filePath) }, event.threadID, () => unlinkSync(filePath), event.messageID);
	} catch (e) {
		console.error(e);
	}
};

async function downloadFile(url, filePath) {
	const axios = require("axios");
	const writer = fs.createWriteStream(filePath);
	const response = await axios({
		url,
		method: 'GET',
		responseType: 'stream'
	});
	response.data.pipe(writer);
	return new Promise((resolve, reject) => {
		writer.on('finish', resolve);
		writer.on('error', reject);
	});
}
