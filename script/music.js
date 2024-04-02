const path = require('path');
const fs = require('fs-extra');
const ytdl = require('@distube/ytdl-core');
const ytsr = require('ytsr');

module.exports = {
  name: "music",
  version: "1.0.0",
  role: 0,
  hasPrefix: true,
  aliases: ['play'],
  usage: 'Music [prompt]',
  description: 'Search music on YouTube',
  credits: 'Developer',
  cooldown: 5,
  execute: async function({ api, event, args }) {
    function byte2mb(bytes) {
      const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      let l = 0, n = parseInt(bytes, 10) || 0;
      while (n >= 1024 && ++l) n = n / 1024;
      return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`;
    }

    const musicName = args.join(' ');
    if (!musicName) {
      api.sendMessage(`To get started, type music and the title of the song you want.`, event.threadID, event.messageID);
      return;
    }
    try {
      api.sendMessage(`Searching for "${musicName}"...`, event.threadID, event.messageID);
      const searchResults = await ytsr(musicName, { limit: 1 });
      if (!searchResults.items.length) {
        return api.sendMessage("Can't find the search.", event.threadID, event.messageID);
      } else {
        const music = searchResults.items[0];
        const musicUrl = music.url;
        const stream = ytdl(musicUrl, { filter: "audioonly" });
        const time = new Date();
        const timestamp = time.toISOString().replace(/[:.]/g, "-");
        const filePath = path.join(__dirname, 'cache', `${timestamp}_music.mp3`);
        stream.pipe(fs.createWriteStream(filePath));
        stream.on('response', () => {});
        stream.on('info', (info) => {});
        stream.on('end', () => {
          if (fs.statSync(filePath).size > 26214400) {
            fs.unlinkSync(filePath);
            return api.sendMessage('The file could not be sent because it is larger than 25MB.', event.threadID);
          }
          const message = {
            body: `${music.title}`,
            attachment: fs.createReadStream(filePath)
          };
          api.sendMessage(message, event.threadID, () => {
            fs.unlinkSync(filePath);
          }, event.messageID);
        });
      }
    } catch (error) {
      api.sendMessage('An error occurred while processing your request.', event.threadID, event.messageID);
    }
  }
};
