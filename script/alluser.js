const axios = require("axios");

module.exports.config = {
  name: "allmember",
  version: "1.0.1",
  role: 0,
  credits: "joshua",
  description: "Count all members in the current group chat, display their names, and optionally include the group's name and picture.",
  commandCategory: "Group Chat",
  usages: "",
  cooldowns: 0,
  hasPrefix: false
};

module.exports.run = async function({ api, event, args }) {
  try {
    // Get the current group chat information
    const groupInfo = await api.getThreadInfo(event.threadID);

    if (!groupInfo) {
      api.sendMessage('Invalid group chat. Please try again later.', event.threadID);
      return;
    }

    // Count the number of members in the group chat
    const memberCount = groupInfo.participantIDs.length;

    // Get the names of all members in the group chat
    const memberNames = [];
    for (const participantID of groupInfo.participantIDs) {
      const participantInfo = await api.getUserInfo(participantID);
      if (participantInfo) {
        memberNames.push(participantInfo.name);
      }
    }

    // Optionally, get the group's picture
    let groupPicture;
    if (groupInfo.imageSrc) {
      groupPicture = groupInfo.imageSrc;
    }

    // Send the result to the user
    const message = `Group Chat: ${groupInfo.threadName}\n\nMember Count: ${memberCount}${groupPicture ? `\nGroup Picture: ${groupPicture}` : ''}`;
    api.sendMessage(message, event.threadID);
  } catch (error) {
    console.error("Error counting group chat members", error);
    api.sendMessage('An error occurred while counting the group chat members.\nPlease try again later.', event.threadID);
  }
};
