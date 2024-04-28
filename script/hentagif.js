const axios = require('axios');

module.exports.config = {
  name: "hentagif",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "joshua Apostol",
  description: "Randomly receive hentai gifs",
  commandCategory: "notes",
  usages: "hentagif",
  cooldowns: 10,
};

async function sendGif(api, threadID) {
  try {
    const response = await axios.get('https://hentai-gif.onrender.com/random-gif');
    const gifUrl = response.data.url;
    api.sendMessage({ attachment: fs.createReadStream(gifUrl) }, threadID, () => fs.unlinkSync(gifUrl));
  } catch (error) {
    console.error('Something went wrong:', error);
    api.sendMessage('An error occurred while fetching from the API. Please try again.', threadID);
  }
}

module.exports.run = async function({ api, event }) {
  // Send a gif when the command is initially invoked
  sendGif(api, event.threadID);
};
