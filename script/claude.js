const axios = require("axios");
const moment = require("moment-timezone");

const FONT_ENABLED = true;
const FONT_MAPPING = {
  a: "𝚊", b: "𝚋", c: "𝚌", d: "𝚍", e: "𝚎", f: "𝚏", g: "𝚐", h: "𝚑", i: "𝚒", j: "𝚓", k: "𝚔", l: "𝚕", m: "𝚖",
  n: "𝚗", o: "𝚘", p: "𝚙", q: "𝚚", r: "𝚛", s: "𝚜", t: "𝚝", u: "𝚞", v: "𝚟", w: "𝚠", x: "𝚡", y: "𝚢", z: "𝚣",
  A: "𝙰", B: "𝙱", C: "𝙲", D: "𝙳", E: "𝙴", F: "𝙵", G: "𝙶", H: "𝙷", I: "𝙸", J: "𝙹", K: "𝙺", L: "𝙻", M: "𝙼",
  N: "𝙽", O: "𝙾", P: "𝙿", Q: "𝚀", R: "𝚁", S: "𝚂", T: "𝚃", U: "𝚄", V: "𝚅", W: "𝚆", X: "𝚇", Y: "𝚈", Z: "𝚉"
};

module.exports.config = {
  name: "claude",
  version: "4.2",
  permission: 0,
  credits: "Hazeyy",
  description: "( 𝙲𝚕𝚊𝚞𝚍𝚎 𝙰𝙸 )",
  commandCategory: "𝚗𝚘 𝚙𝚛𝚎𝚏𝚒𝚡",
  usages: "( 𝙼𝚘𝚍𝚎𝚕 - 𝙲𝚕𝚊𝚞𝚍𝚎 𝚋𝚢 𝙰𝚗𝚝𝚑𝚛𝚘𝚙𝚒𝚌 )",
  cooldown: 3,
};

async function convertImageToCaption(imageURL, api, event, message) {
  try {
    api.sendMessage("🕟 | 𝙲𝚕𝚊𝚞𝚍𝚎 𝙰𝙸 𝙴𝚡𝚝𝚛𝚊𝚌𝚝𝚒𝚗𝚐 𝚒𝚖𝚊𝚐𝚎, 𝚙𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝...", event.threadID, event.messageID);

    const response = await axios.get(`https://hazee-claude-vision-58d1b0764a61.herokuapp.com/claude-vision?message=${encodeURIComponent(message)}&image_url=${encodeURIComponent(imageURL)}`);

    if (response.data && response.data.content && response.data.content.length > 0) {
      const caption = response.data.content[0].text;
      const formattedCaption = formatFont(caption);
      api.sendMessage(`🎓 𝐂𝐥𝐚𝐮𝐝𝐞 𝐕𝐢𝐬𝐢𝐨𝐧 ( 𝐀𝐈 )\n\n🖋️ 𝙰𝚜𝚔: '${message}'\n\n${formattedCaption}`, event.threadID, event.messageID);
    } else {
      api.sendMessage("🤖 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚛𝚎𝚌𝚘𝚐𝚗𝚒𝚣𝚎𝚍 𝚝𝚑𝚎 𝚒𝚖𝚊𝚐𝚎𝚜.", event.threadID, event.messageID);
    }
  } catch (error) {
    console.error("🤖 𝙴𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚎𝚍 𝚠𝚑𝚒𝚕𝚎 𝚛𝚎𝚌𝚘𝚐𝚗𝚒𝚣𝚒𝚗𝚐 𝚒𝚖𝚊𝚐𝚎:", error);
    api.sendMessage("🤖 𝙰𝚗 𝙴𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚎𝚍 𝚠𝚑𝚒𝚕𝚎 𝚛𝚎𝚌𝚘𝚐𝚗𝚒𝚣𝚒𝚗𝚐 𝚒𝚖𝚊𝚐𝚎.", event.threadID, event.messageID);
  }
}

module.exports.handleEvent = async function ({ api, event }) {
  if (!(event.body.indexOf("claude") === 0 || event.body.indexOf("Claude") === 0)) return;

  const args = event.body.split(/\s+/);
  args.shift();

  if (event.type === "message_reply") {
    if (event.messageReply.attachments[0] && event.messageReply.attachments[0].type === "photo") {
      const imageURL = event.messageReply.attachments[0].url;
      convertImageToCaption(imageURL, api, event, args.join(' '));
      return;
    }
  }

  if (args.length === 0) {
    api.sendMessage("🎓 𝙷𝚎𝚕𝚕𝚘 𝙸 𝚊𝚖 𝙲𝚕𝚊𝚞𝚍𝚎 𝙰𝙸 𝚋𝚢 𝙰𝚗𝚝𝚑𝚛𝚘𝚙𝚒𝚌\n\n𝙷𝚘𝚠 𝚖𝚊𝚢 𝚒 𝚊𝚜𝚜𝚒𝚜𝚝 𝚢𝚘𝚞 𝚝𝚘𝚍𝚊𝚢?", event.threadID, event.messageID);
    return;
  }

  api.sendMessage("🗨️ | 𝙲𝚕𝚊𝚞𝚍𝚎 𝙰𝙸 𝚒𝚜 𝚜𝚎𝚊𝚛𝚌𝚑𝚒𝚗𝚐, 𝙿𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝...", event.threadID, event.messageID);

  try {
    const query = args.join(' ');
    const response = await axios.get(`https://hazee-claude-ai-5b3176a38696.herokuapp.com/claude?q=${encodeURIComponent(query)}`);

    const responseText = response.data.response[0].text;
    const currentTimePH = moment().tz('Asia/Manila').format('hh:mm:ss A');

    const formattedResponse = `🎓 𝐂𝐥𝐚𝐮𝐝𝐞 ( 𝐀𝐈 )\n\n🖋️ 𝚀𝚞𝚎𝚛𝚢: '${query}'\n\n${formatFont(responseText)}\n\n» ⏰ 𝚃𝚒𝚖𝚎: .⋅ ۵ ${currentTimePH} ۵ ⋅. «`;

    api.sendMessage(formattedResponse, event.threadID, event.messageID);
  } catch (error) {
    console.error(error);
    api.sendMessage("🤖 𝙾𝚘𝚙𝚜! 𝙸 𝚎𝚗𝚌𝚘𝚞𝚗𝚝𝚎𝚛𝚎𝚍 𝚊𝚗 𝚎𝚛𝚛𝚘𝚛 𝚠𝚑𝚒𝚕𝚎 𝚏𝚎𝚝𝚌𝚑𝚒𝚗𝚐 𝚛𝚎𝚜𝚙𝚘𝚗𝚜𝚎 𝚝𝚘 𝙲𝚕𝚊𝚞𝚍𝚎 𝙰𝙿𝙸. 𝙿𝚕𝚎𝚊𝚜𝚎 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚕𝚊𝚝𝚎𝚛.", event.threadID, event.messageID);
  }
};

function formatFont(text) {
  let formattedOutput = "";
  for (const char of text) {
    if (FONT_ENABLED && char in FONT_MAPPING) {
      formattedOutput += FONT_MAPPING[char];
    } else {
      formattedOutput += char;
    }
  }
  return formattedOutput;
}

module.exports.run = async function ({ api, event }) {};
