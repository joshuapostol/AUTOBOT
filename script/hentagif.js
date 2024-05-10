module.exports.config = {
    name: "hentagif",
    version: "1.0.0",
    hasPrefix: true,
    hasPermission: 0,
    credits: "Joshua Apostol",
    description: "Get a random gif",
    commandCategory: "media",
    cooldowns: 5,
    dependencies: {
        "axios": ""
    }
};

const axios = require("axios");
const fs = require("fs");

module.exports.run = async function({ api, event, args, client }) {
    try {
        api.sendMessage("⏱️ | Fetching random gif. Please wait...", event.threadID, event.messageID);
        
        const response = await axios.get('https://hentagif-api.onrender.com/random-gif');
        const gifData = response.data;

        if (gifData && gifData.url) {
            const filePath = __dirname + "/cache/random.gif";
            const gifStream = fs.createWriteStream(filePath);

            const gifResponse = await axios.get(gifData.url, { responseType: 'stream' });
            gifResponse.data.pipe(gifStream);

            await new Promise((resolve, reject) => {
                gifStream.on('finish', resolve);
                gifStream.on('error', reject);
            });

            api.sendMessage({
                body: `Here's your random gif:`,
                attachment: fs.createReadStream(filePath)
            }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
        } else {
            throw new Error("Failed to retrieve gif.");
        }
    } catch (error) {
        console.error(error);
        api.sendMessage("Error fetching gif.", event.threadID, event.messageID);
    }
};
