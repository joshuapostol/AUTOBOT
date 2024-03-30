   const axios = require('axios');

   module.exports.config = {
     name: "ai",
     version: "1.0.0",
     hasPermssion: 0,
     credits: "Eugene Aguilar",
     description: "Interacts with a GPT-4 API",
     usePrefix: false,
     commandCategory: "ai",
     usages: "[question]",
     cooldowns: 5,
     dependencies: {
       "axios": ""
     }
   };

module.exports.handleEvent = async function ({ api, event }) {
     const lowerBody = event.body.toLowerCase();
     if (!(lowerBody.startsWith("eurix") || lowerBody.startsWith("ai"))) return;

     const args = event.body.split(/\s+/);
     args.shift();

     const question = args.join(" ");
     if (!question) {
       api.sendMessage("please provide your question", event.threadID, event.messageID);
       return;
     }

     api.sendMessage(`Answering your question...`, event.threadID, event.messageID);

     const apiUrl = `https://eurix-api.replit.app/gpt4?ask=${encodeURIComponent(question)}`;

     try {
       const response = await axios.get(apiUrl);
       const answer = response.data.answer;

       api.sendMessage(answer, event.threadID, event.messageID);
     } catch (error) {
       console.error("Error fetching AI response:", error);
       api.sendMessage("Error fetching AI response", event.threadID, event.messageID);
     }
   };
