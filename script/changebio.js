module.exports.config = {
    name: "changebio",
    version: "1.0.0",
    role: 2,
    credits: "Kenneth Aceberos", //mamalasin ka kapag palitan mo ito
    description: "Change a bio on a bot.",
    usePrefix: true,
    usages: "Reply a text. type, {p}changebio",
    cooldown: 0
};

module.exports.run = async function ({ api, event }) {

  if (event.type !== "message_reply"){
    return api.sendMessage("❌ No text detected. Reply the chat that you want to change your bio.", event.threadID, event.messageID);
  }
  
  const txt = event.messageReply.body;
  
    if (txt && txt.length > 101){
      return api.sendMessage(`❌ Max limit is 101 characters`, event.threadID, event.messageID); 
    }
    try {
       api.setMessageReaction("⏳", event.messageID, () => {}, true);
       api.sendMessage("⏳ Please wait...", event.threadID, event.messageID);

      api.changeBio(txt, true, (err, data) => {
        if (err){
          api.setMessageReaction("🤷", event.messageID, () => {}, true);
          return api.sendMessage("Failed to change bio", event.threadID, event.messageID);
        }
      api.setMessageReaction("✅", event.messageID, () => {}, true);
         api.sendMessage(`✅ Bio is changed\n\nTry to stalk the bot's profile.`, event.threadID, event.messageID);

      });

    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while processing your request.", event.threadID);
    }
};
