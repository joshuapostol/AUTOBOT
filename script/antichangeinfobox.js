const fs = require('fs');

module.exports.config = {
	name: "antichangeinfobox",
	version: "1.8",
	credits: "NTKhang",
	cooldown: 5,
	role: 2,
	hasPrefix: false,
	aliases: ["anti-change"],
	description: {
		vi: "Chống đổi thông tin box chat",
		en: "Anti change info box"
	},
	usage: {
		vi: "   {pn} avt [on | off]: chống đổi avatar box chat"
			+ "\n   {pn} name [on | off]: chống đổi tên box chat"
			+ "\n   {pn} nickname [on | off]: chống đổi nickname trong box chat"
			+ "\n   {pn} theme [on | off]: chống đổi theme (chủ đề) box chat"
			+ "\n   {pn} emoji [on | off]: chống đổi trạng emoji box chat",
		en: "   {pn} avt [on | off]: anti change avatar box chat"
			+ "\n   {pn} name [on | off]: anti change name box chat"
			+ "\n   {pn} nickname [on | off]: anti change nickname in box chat"
			+ "\n   {pn} theme [on | off]: anti change theme (chủ đề)! box chat"
			+ "\n   {pn} emoji [on | off]: anti change emoji box chat"
	}
};

const langs = {
	vi: {
		antiChangeAvatarOn: "Đã bật chức năng chống đổi avatar box chat",
		antiChangeAvatarOff: "Đã tắt chức năng chống đổi avatar box chat",
		missingAvt: "Bạn chưa đặt avatar cho box chat",
		antiChangeNameOn: "Đã bật chức năng chống đổi tên box chat",
		antiChangeNameOff: "Đã tắt chức năng chống đổi tên box chat",
		antiChangeNicknameOn: "Đã bật chức năng chống đổi nickname box chat",
		antiChangeNicknameOff: "Đã tắt chức năng chống đổi nickname box chat",
		antiChangeThemeOn: "Đã bật chức năng chống đổi theme (chủ đề) box chat",
		antiChangeThemeOff: "Đã tắt chức năng chống đổi theme (chủ đề) box chat",
		antiChangeEmojiOn: "Đã bật chức năng chống đổi emoji box chat",
		antiChangeEmojiOff: "Đã tắt chức năng chống đổi emoji box chat",
		antiChangeAvatarAlreadyOn: "Hiện tại box chat của bạn đang bật chức năng cấm thành viên đổi avatar",
		antiChangeAvatarAlreadyOnButMissingAvt: "Hiện tại box chat của bạn đang bật chức năng cấm thành viên đổi avatar box chat chưa được đặt avatar",
		antiChangeNameAlreadyOn: "Hiện tại box chat của bạn đang bật chức năng cấm thành viên đổi tên",
		antiChangeNicknameAlreadyOn: "Hiện tại box chat của bạn đang bật chức năng cấm thành viên đổi nickname",
		antiChangeThemeAlreadyOn: "Hiện tại box chat của bạn đang bật chức năng cấm thành viên đổi theme (chủ đề)",
		antiChangeEmojiAlreadyOn: "Hiện tại box chat của bạn đang bật chức năng cấm thành viên đổi emoji"
	},
	en: {
		antiChangeAvatarOn: "Turn on anti change avatar box chat",
		antiChangeAvatarOff: "Turn off anti change avatar box chat",
		missingAvt: "You have not set avatar for box chat",
		antiChangeNameOn: "Turn on anti change name box chat",
		antiChangeNameOff: "Turn off anti change name box chat",
		antiChangeNicknameOn: "Turn on anti change nickname box chat",
		antiChangeNicknameOff: "Turn off anti change nickname box chat",
		antiChangeThemeOn: "Turn on anti change theme box chat",
		antiChangeThemeOff: "Turn off anti change theme box chat",
		antiChangeEmojiOn: "Turn on anti change emoji box chat",
		antiChangeEmojiOff: "Turn off anti change emoji box chat",
		antiChangeAvatarAlreadyOn: "Your box chat is currently on anti change avatar",
		antiChangeAvatarAlreadyOnButMissingAvt: "Your box chat is currently on anti change avatar but your box chat has not set avatar",
		antiChangeNameAlreadyOn: "Your box chat is currently on anti change name",
		antiChangeNicknameAlreadyOn: "Your box chat is currently on anti change nickname",
		antiChangeThemeAlreadyOn: "Your box chat is currently on anti change theme",
		antiChangeEmojiAlreadyOn: "Your box chat is currently on anti change emoji"
	}
};

module.exports.run = async function ({ message, event, args }) {
	if (!["on", "off"].includes(args[1]))
		return message.SyntaxError();
	const { threadID } = event;
	const dataAntiChangeInfoBox = JSON.parse(fs.readFileSync(`./data/${threadID}.json`, 'utf8'));
	async function checkAndSaveData(key, data) {
		if (args[1] === "off")
			delete dataAntiChangeInfoBox[key];
		else
			dataAntiChangeInfoBox[key] = data;

		fs.writeFileSync(`./data/${threadID}.json`, JSON.stringify(dataAntiChangeInfoBox), 'utf8');
		message.reply(langs[getLang()][`antiChange${key.slice(0, 1).toUpperCase()}${key.slice(1)}${args[1].slice(0, 1).toUpperCase()}${args[1].slice(1)}`]);
	}
	switch (args[0]) {
		case "avt":
		case "avatar":
		case "image": {
			if (!fs.existsSync(`./data/${threadID}_imageSrc.json`))
				return message.reply(langs[getLang()]["missingAvt"]);
			const imageSrc = JSON.parse(fs.readFileSync(`./data/${threadID}_imageSrc.json`, 'utf8'));
			const newImageSrc = await uploadImgbb(imageSrc);
			await checkAndSaveData("avatar", newImageSrc.image.url);
			break;
		}
		case "name": {
			const threadName = JSON.parse(fs.readFileSync(`./data/${threadID}_threadName.json`, 'utf8'));
			await checkAndSaveData("name", threadName);
			break;
		}
		case "nickname": {
			const members = JSON.parse(fs.readFileSync(`./data/${threadID}_members.json`, 'utf8'));
			await checkAndSaveData("nickname", members.map(user => ({ [user.userID]: user.nickname })).reduce((a, b) => ({ ...a, ...b }), {}));
			break;
		}
		case "theme": {
			const threadThemeID = JSON.parse(fs.readFileSync(`./data/${threadID}_threadThemeID.json`, 'utf8'));
			await checkAndSaveData("theme", threadThemeID);
			break;
		}
		case "emoji": {
			const emoji = JSON.parse(fs.readFileSync(`./data/${threadID}_emoji.json`, 'utf8'));
			await checkAndSaveData("emoji", emoji);
			break;
		}
		default: {
			return message.SyntaxError();
		}
	}
};

module.exports.handleEvent = async function ({ message, event }) {
	const { threadID, logMessageType, logMessageData, author } = event;
	switch (logMessageType) {
		case "log:thread-image": {
			const dataAntiChange = JSON.parse(fs.readFileSync(`./data/${threadID}_dataAntiChangeInfoBox.json`, 'utf8'));
			if (!dataAntiChange.avatar && role < 1)
				return;
			return async function () {
				if (role < 1 && api.getCurrentUserID() !== author) {
					if (dataAntiChange.avatar != "REMOVE") {
						message.reply(langs[getLang()]["antiChangeAvatarAlreadyOn"]);
						api.changeGroupImage(await getStreamFromURL(dataAntiChange.avatar), threadID);
					}
					else {
						message.reply(langs[getLang()]["antiChangeAvatarAlreadyOnButMissingAvt"]);
					}
				}
				else {
					const imageSrc = logMessageData.url;
					if (!imageSrc)
						return fs.writeFileSync(`./data/${threadID}_dataAntiChangeInfoBox.json`, JSON.stringify("REMOVE"), 'utf8');

					const newImageSrc = await uploadImgbb(imageSrc);
					fs.writeFileSync(`./data/${threadID}_dataAntiChangeInfoBox.json`, JSON.stringify(newImageSrc.image.url), 'utf8');
				}
			};
		}
		// Handle other log types similarly
	}
};
