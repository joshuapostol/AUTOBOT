module.exports.config = {
  name: "ai",
  version: "30.0.0",
  hasPermssion: 0,
  credits: "Choru TikTokers",
  description: "ChatGpt",
  commandCategory: "Other",
  usages: "query",
  hasPrefix: false,
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => { 
  const { gpt } = require("gpti");
  let query = args.join(" ");
  gpt.v1({
      prompt: query,
      model: "GPT-4",
      markdown: false
  }, (err, data) => {
      if(err != null){
          console.log(err);
      } else {
          api.sendMessage(data.gpt, event.threadID, event.messageID);
      }
  });
};
