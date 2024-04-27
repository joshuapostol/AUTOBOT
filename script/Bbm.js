const { createCanvas, loadImage } = require('canvas');
const fs = require('fs-extra');
const axios = require('axios');

module.exports.config = {
    name: "bbm",
    version: "1.0.0",
    role: 0,
    credits: "Hinata",
    hasPrefix: true,
    description: "bbm memes",
    commandCategory: "memes",
    usage: "bbm",
    cooldowns: 1
};

module.exports.run = async function ({ api, event, args, Users }) {
    const pathImg = __dirname + `/cache/meme.jpg`;

    try {
        const getImage = (await axios.get(encodeURI(`https://i.imgflip.com/8nihc7.jpg`), {
            responseType: "arraybuffer",
        })).data;
        fs.writeFileSync(pathImg, Buffer.from(getImage, "utf-8"));

        const baseImage = await loadImage(pathImg);
        const canvas = createCanvas(baseImage.width, baseImage.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

        const imageBuffer = canvas.toBuffer();
        fs.writeFileSync(pathImg, imageBuffer);
        return api.sendMessage(
            { attachment: fs.createReadStream(pathImg) },
            event.threadID,
            () => fs.unlinkSync(pathImg),
            event.messageID
        );
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while processing the command", event.threadID, event.messageID);
    }
};
