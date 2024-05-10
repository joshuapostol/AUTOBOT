module.exports.config = {
    name: "hentagif",
    version: "1.0.0",
    hasPermission: 0,
    credits: "joshua apostol",
    description: "Get a random gif",
    commandCategory: "media",
    cooldowns: 5,
    hasPrefix: true,
    dependencies: {
        "node-fetch": ""
    }
};

const fetch = require("node-fetch");
const fs = require("fs");

module.exports.run = async function({ api, event, args, client }) {
    try {
        api.sendMessage("⏱️ | Fetching random gif. Please wait...", event.threadID, event.messageID);
        
        const response = await fetch('https://hentagif-api.onrender.com/random-gif');
        const gifData = await response.json();

        if (gifData && gifData.url) {
            const filePath = __dirname + "/cache/random.gif";
            const gifStream = fs.createWriteStream(filePath);

            await new Promise((resolve, reject) => {
                gifStream.on('finish', resolve);
                gifStream.on('error', reject);
                fetch(gifData.url).then(response => {
                    response.body.pipe(gifStream);
                });
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
