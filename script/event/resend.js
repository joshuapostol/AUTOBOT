module.exports.config = {
    name: "resend",
    version: "1.0.0",
};

var msgData = {};

module.exports.handleEvent = async function ({ api, event }) {
    if (event.type == 'message') {
        msgData[event.messageID] = {
            body: event.body,
            attachments: event.attachments,
            senderID: event.senderID
        };
    }

    if (event.type == "message_unsend" && msgData.hasOwnProperty(event.messageID)) {
        const info = await api.getUserInfo(msgData[event.messageID].senderID);
        const name = info[msgData[event.messageID].senderID].name;
        const axios = require('axios');
        const fs = require("fs");

        if (msgData[event.messageID].attachments.length === 0) {
            api.sendMessage(`Unsend kapa ha: ${name} inunsend ${msgData[event.messageID].body}`, event.threadID);
        } else {
            for (const item of msgData[event.messageID].attachments) {
                let { data } = await axios.get(item.url, { responseType: "arraybuffer" });
                fs.writeFileSync(`./script/cache/${item.filename}`, Buffer.from(data));
                const attachment = fs.createReadStream(`./script/cache/${item.filename}`);
                api.sendMessage({ body: `Unsend kapa ha: ${name} inunsend ${msgData[event.messageID].body}`, attachment }, event.threadID, () => {
                    fs.unlinkSync(`./script/cache/${item.filename}`);
                });
            }
        }
    }
};
