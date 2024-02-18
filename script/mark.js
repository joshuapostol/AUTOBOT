module.exports.config = {
 name: "mark",
 version: "1.0.1",
 role: 0,
 credits: "MewMew mod By hungdz30cm",
 description: "Comment on the board",
 usages: "[text]",
 hasPrefix: false,
 cooldown: 5,
};

module.exports.wrapText = (text, maxWidth) => {
 return new Promise(resolve => {
	const words = text.split(' ');
	const lines = [];
	let line = '';
	while (words.length > 0) {
	 let split = false;
	 while (words[0].length > maxWidth) {
		if (split) words[1] = `${words[0].slice(-1)}${words[1]}`;
		else {
		 split = true;
		 words.splice(1, 0, words[0].slice(-1));
		}
		words[0] = words[0].slice(0, -1);
	 }
	 if ((`${line}${words[0]}`).length <= maxWidth) line += `${words.shift()} `;
	 else {
		lines.push(line.trim());
		line = '';
	 }
	 if (words.length === 0) lines.push(line.trim());
	}
	return resolve(lines);
 });
} 

module.exports.run = async function({ api, event, args }) {
 const { senderID, threadID, messageID } = event;
 const fs = require("fs-extra");
 const axios = require("axios");
 const sharp = require("sharp");
 const pathImg = __dirname + '/cache/markngu.png';
 const text = args.join(" ");
 if (!text) return api.sendMessage("Enter the content of the comment on the board", threadID, messageID);
 const getPorn = await axios.get(`https://i.imgur.com/3j4GPdy.jpg`, { responseType: 'arraybuffer' });
 fs.writeFileSync(pathImg, Buffer.from(getPorn.data, 'utf-8'));
 const imageBuffer = await sharp(pathImg)
		.toBuffer()
		.catch(err => console.log(err));
 const fontSize = 45;
 const lines = await this.wrapText(text, 440);
 const wrappedText = lines.join('\n');
 const editedImage = await sharp(imageBuffer)
		.resize({ width: 800, height: 600 }) // adjust dimensions as needed
		.jpeg() // or .png() or any other supported format
		.composite([{ input: Buffer.from(`caption:${wrappedText}`), gravity: 'northwest' }])
		.toBuffer();
 fs.writeFileSync(pathImg, editedImage);
 api.sendMessage({ attachment: fs.createReadStream(pathImg) }, threadID, () => fs.unlinkSync(pathImg), messageID);        
}
