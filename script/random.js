const fs = require("fs");
const axios = require("axios");
const path = require("path");

module.exports.config = {
    name: "random",
    version: "1.9.0",
    hasPermission: 0,
    credits: "Anonymous", // modified by Joshua Apostol
    description: "Generate random tiktok videos",
    commandCategory: "other",
    usages: "[random]",
    cooldowns: 9,
    usePrefix: true,
};

module.exports.run = async function ({ api, event }) {
    try {
        api.sendMessage(`Random tiktok video is being sent, please wait...`, event.threadID, event.messageID);
        const response = await axios.post(`https://random-video-girl-api.onrender.com/api/request/f`);
        const video = response.data.url;
        const username = response.data.username;
        const nickname = response.data.nickname;
        const title = response.data.title;

        let randomPath = path.join(__dirname, "cache", "girledit.mp4");

        const dl = await axios.get(video, { responseType: "arraybuffer" });

        fs.writeFileSync(randomPath, Buffer.from(dl.data, "utf-8"));

        api.sendMessage({
            body: `Random tiktok video\n\nUsername: ${username}\nNickname: ${nickname}\nTitle: ${title}`,
            attachment: fs.createReadStream(randomPath)
        }, event.threadID, event.messageID);
    } catch (err) {
        console.error(err);
        api.sendMessage(`An error occurred while processing your request.`, event.threadID, event.messageID);
    }
};
