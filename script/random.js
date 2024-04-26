const axios = require("axios");
const path = require("path");
const fs = require("fs");

module.exports.config = {
    name: "random",
    version: "1.0.0",
    credits: "Eugene Aguilar",
    description: "Generate random TikTok girl edit videos",
    hasPermssion: 0,
    commandCategory: "other",
    usages: "[girledit]",
    cooldowns: 5,
    dependencies: [],
    usePrefix: true,
};

module.exports.run = async function ({ api, event }) {
    try {
 api.sendMessage(`video is sending please wait...`, event.threadID, event.messageID);

        const response = await axios.post(`https://random-tiktok-video-api.onrender.com/api/request/f`, { credits: "Eugene Aguilar"});
        const videoUrl = response.data.url;
        const username = response.data.username;
        const nickname = response.data.nickname;


        const videoPath = path.resolve(__dirname, 'girledit_video.mp4');
        const writer = fs.createWriteStream(videoPath);
        const responseStream = await axios({
            url: videoUrl,
            method: 'GET',
            responseType: 'stream'
        });

        responseStream.data.pipe(writer);

        writer.on('finish', () => {
            api.sendMessage({
                body: `Username: ${username}\nNickname: ${nickname}`,
                attachment: fs.createReadStream(videoPath)
            }, event.threadID, () => fs.unlinkSync(videoPath), event.messageID);
        });
    } catch (error) {
  api.sendMessage(`error fetching girl edit api!!\n${error}`, event.threadID, event.messageID);
        console.error('Error:', error.message);
    }
};
