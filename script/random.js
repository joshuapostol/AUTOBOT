  const fs = require("fs");
  const axios = require("axios");
  const path = require("path");

  module.exports.config = {
      name: "random",
      version: "1.9.0",
      hasPermssion: 0,
      credits: "Anonymous",//modified by joshua Apostol
      description: "Generate random tiktok video videos",
      commandCategory: "other",
      usages: "[random]",
      cooldowns: 9,
     usePrefix: true,
    };
  module.exports.run = async function ({ api, event }) {
      try {
        api.sendMessage(`random tiktok is sending please wait...`, event.threadID, event.messageID);
        const response = await axios.post(`https://random-video-girl-api.onrender.com/api/request/f`);
        const video = response.data.url;
        const username = response.data.username;
        const nickname = response.data.nickname;
const title = response.data.title;

        let codmPath = path.join(__dirname, "cache", "girledit.mp4");

        const dl = await axios.get(video, { responseType: "arraybuffer" });

        fs.writeFileSync(codmPath, Buffer.from(dl.data, "utf-8"));

        api.sendMessage({
          body: `random tiktok video\n\nUsername: ${username}\nNickname: ${nickname}\nTitle: ${title}`,
          attachment: fs.createReadStream(codmPath)
        }, event.threadID, event.messageID);
      } catch (err) {
        console.error(err);
        api.sendMessage(`Error occurred while processing your request.`, event.threadID, event.messageID);
      }
  };
