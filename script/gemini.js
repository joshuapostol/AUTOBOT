const axios = require("axios");
let fontEnabled = true;

module.exports.config = {
  name: "gemini",
  version: "6.2",
  permission: 0,
  credits: "Hazeyy",
  description: "( 𝙶𝚎𝚖𝚒𝚗𝚒 𝙿𝚛𝚘 𝚅𝚒𝚜𝚒𝚘𝚗 )",
  commandCategory: "𝚗𝚘 𝚙𝚛𝚎𝚏𝚒𝚡",
  usage: "( 𝙼𝚘𝚍𝚎𝚕 - 𝙶𝚎𝚖𝚒𝚗𝚒 𝙿𝚛𝚘 𝚅𝚒𝚜𝚒𝚘𝚗 )",
  cooldown: 3,
};

async function convertImageToCaption(imageURL, api, event, inputText) {
  try {
    api.sendMessage("🕟 | 𝙶𝚎𝚖𝚒𝚗𝚒 𝙰𝙸 𝚁𝚎𝚌𝚘𝚐𝚗𝚒𝚣𝚒𝚗𝚐 𝙸𝚖𝚊𝚐𝚎, 𝚙𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝...", event.threadID, event.messageID);

    const response = await axios.get(`https://hazee-gemini-pro-vision-12174af6c652.herokuapp.com/gemini-vision?text=${encodeURIComponent(inputText)}&image_url=${encodeURIComponent(imageURL)}`);
    const caption = response.data.response;

    if (caption) {
      const formattedCaption = formatFont(caption);
      api.sendMessage(`🎓 𝐆𝐞𝐦𝐢𝐧𝐢 𝐏-𝐕𝐢𝐬𝐢𝐨𝐧 ( 𝐀𝐈 )\n\n🖋️ 𝙰𝚜𝚔: '${inputText}'\n\n${formattedCaption}`, event.threadID, event.messageID);
    } else {
      api.sendMessage("🤖 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚛𝚎𝚌𝚘𝚐𝚗𝚒𝚣𝚎𝚍 𝚝𝚑𝚎 𝚒𝚖𝚊𝚐𝚎𝚜.", event.threadID, event.messageID);
    }
  } catch (error) {
    console.error("🤖 𝙴𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚎𝚍 𝚠𝚑𝚒𝚕𝚎 𝚛𝚎𝚌𝚘𝚐𝚗𝚒𝚣𝚒𝚗𝚐 𝚒𝚖𝚊𝚐𝚎:", error);
    api.sendMessage("🤖 𝙰𝚗 𝙴𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚎𝚍 𝚠𝚑𝚒𝚕𝚎 𝚛𝚎𝚌𝚘𝚐𝚗𝚒𝚣𝚒𝚗𝚐 𝚒𝚖𝚊𝚐𝚎.", event.threadID, event.messageID);
  }
}

module.exports.handleEvent = async function ({ api, event }) {
  if (!(event.body.toLowerCase().startsWith("gemini"))) return;

  const args = event.body.split(/\s+/);
  args.shift();

  if (event.type === "message_reply") {
    if (event.messageReply.attachments[0]) {
      const attachment = event.messageReply.attachments[0];

       if (attachment.type === "photo") {
        const imageURL = attachment.url;
        convertImageToCaption(imageURL, api, event, args.join(' '));
        return;
      }
    }
  }

  const inputText = args.join(' ');

  if (!inputText) {
    return api.sendMessage("🐱 𝙷𝚎𝚕𝚕𝚘 𝙸 𝚊𝚖 𝙶𝚎𝚖𝚒𝚗𝚒 𝙿𝚛𝚘 𝚅𝚒𝚜𝚒𝚘𝚗 𝚝𝚛𝚊𝚒𝚗𝚎𝚍 𝚋𝚢 𝙶𝚘𝚘𝚐𝚕𝚎\n\n𝙷𝚘𝚠 𝚖𝚊𝚢 𝚒 𝚊𝚜𝚜𝚒𝚜𝚝 𝚢𝚘𝚞 𝚝𝚘𝚍𝚊𝚢?", event.threadID, event.messageID);
  }

  if (args[0] === "on") {
    fontEnabled = true;
    api.sendMessage({ body: "🎓 𝐆𝐞𝐦𝐢𝐧𝐢 𝐏-𝐕𝐢𝐬𝐢𝐨𝐧 ( 𝐀𝐈 )\n\n» 🟢 𝙵𝚘𝚗𝚝 𝙵𝚘𝚛𝚖𝚊𝚝𝚝𝚒𝚗𝚐 𝚒𝚜 𝚗𝚘𝚠 𝙴𝚗𝚊𝚋𝚕𝚎𝚍 «" }, event.threadID, event.messageID);
    return;
  }

  if (args[0] === "off") {
    fontEnabled = false;
    api.sendMessage({ body: "🎓 𝐆𝐞𝐦𝐢𝐧𝐢 𝐏-𝐕𝐢𝐬𝐢𝐨𝐧 ( 𝐀𝐈 )\n\n» 🔴 𝙵𝚘𝚗𝚝 𝙵𝚘𝚛𝚖𝚊𝚝𝚝𝚒𝚗𝚐 𝚒𝚜 𝚗𝚘𝚠 𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍 «" }, event.threadID, event.messageID);
    return;
  }

  api.sendMessage("🗨️ | 𝙶𝚎𝚖𝚒𝚗𝚒 𝙰𝙸 𝚒𝚜 𝚝𝚑𝚒𝚗𝚔𝚒𝚗𝚐, 𝙿𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝...", event.threadID, event.messageID);

  try {
    const response = await axios.get(`https://hazee-gemini-pro-vision-12174af6c652.herokuapp.com/gemini-vision?text=${encodeURIComponent(inputText)}`);
    if (response.status === 200 && response.data.response) {
    const formattedResponse = formatFont(response.data.response);
      api.sendMessage(`🎓 𝐆𝐞𝐦𝐢𝐧𝐢 𝐏-𝐕𝐢𝐬𝐢𝐨𝐧 ( 𝐀𝐈 )\n\n🖋️ 𝙰𝚜𝚔: '${inputText}'\n\n${formattedResponse}`, event.threadID, event.messageID);
    } else {
      console.error("🤖 𝙴𝚛𝚛𝚘𝚛 𝚐𝚎𝚗𝚎𝚛𝚊𝚝𝚒𝚗𝚐 𝚛𝚎𝚜𝚙𝚘𝚗𝚜𝚎 𝙵𝚛𝚘𝚖 𝙶𝚎𝚖𝚒𝚗𝚒 𝙰𝙿𝙸.");
    }
  } catch (error) {
    console.error("🤖 𝙴𝚛𝚛𝚘𝚛:", error);
    api.sendMessage("🤖 𝙰𝚗 𝚎𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚎𝚍 𝚠𝚑𝚒𝚕𝚎 𝚙𝚛𝚘𝚌𝚎𝚜𝚜𝚒𝚗𝚐 𝙶𝚎𝚖𝚒𝚗𝚒 𝙰𝙿𝙸.", event.threadID, event.messageID);
  }
};

function formatFont(text) {
  const fontMapping = {
    a: "𝚊", b: "𝚋", c: "𝚌", d: "𝚍", e: "𝚎", f: "𝚏", g: "𝚐", h: "𝚑", i: "𝚒", j: "𝚓", k: "𝚔", l: "𝚕", m: "𝚖",
    n: "𝚗", o: "𝚘", p: "𝚙", q: "𝚚", r: "𝚛", s: "𝚜", t: "𝚝", u: "𝚞", v: "𝚟", w: "𝚠", x: "𝚡", y: "𝚢", z: "𝚣",
    A: "𝙰", B: "𝙱", C: "𝙲", D: "𝙳", E: "𝙴", F: "𝙵", G: "𝙶", H: "𝙷", I: "𝙸", J: "𝙹", K: "𝙺", L: "𝙻", M: "𝙼",
    N: "𝙽", O: "𝙾", P: "𝙿", Q: "𝚀", R: "𝚁", S: "𝚂", T: "𝚃", U: "𝚄", V: "𝚅", W: "𝚆", X: "𝚇", Y: "𝚈", Z: "𝚉"
  };

  let formattedText = "";
  for (const char of text) {
    if (char === ' ') {
      formattedText += ' '; 
    } else if (char in fontMapping) {
      formattedText += fontMapping[char];
    } else {
      formattedText += char;
    }
  }

  return formattedText;
}

module.exports.run = async function ({ api, event }) {};
