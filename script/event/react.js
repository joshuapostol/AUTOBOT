const fs = require("fs");

module.exports.config = {
	name: "autoreact",
	version: "1.1.1",
};

module.exports.handleEvent = function({ api, event }) {
	var { threadID, messageID } = event;
	let react = event.body.toLowerCase();

	if (
		react.includes("hahaha") || react.includes("haha") || react.includes("pakyu") || react.includes("bobo") ||
		react.includes("gago") || react.includes("tangina") || react.includes("tang") || react.includes("pak") ||
		react.includes("shit") || react.includes("amp") || react.includes("lol") || react.includes("ulol") ||
		react.includes("walang utak") || react.includes("suntukan") || react.includes("stupid") || react.includes("fuck") ||
		react.includes("fuckyou") || react.includes("sapak") || react.includes("bold") || react.includes("am") ||
		react.includes("bisaya") || react.includes("gagi") || react.includes("bastos") || react.includes("deputa") ||
		react.includes("puta") || react.includes("pota") || react.includes("baboy") || react.includes("kababuyan") ||
		react.includes("😆") || react.includes("😂") || react.includes(":)") || react.includes("🙂") || react.includes("😹") ||
		react.includes("🤣") || react.includes("mabaho") || react.includes("mapanghi") || react.includes("suntukan") ||
		react.includes("nigga") || react.includes("script kiddie") || react.includes("trash") || react.includes("kingina") ||
		react.includes("hindot") || react.includes("jesus") || react.includes("abno") || react.includes("lmao") || 
		react.includes("xd") || react.includes("biot") || react.includes("bayot") || react.includes("bakla") || 
		react.includes("bading") || react.includes("poor")
	) {
		var msg = { body: "" };
		api.sendMessage(msg, threadID, messageID);
		api.setMessageReaction("😆", event.messageID, (err) => {}, true);
	}

	if (
		react.includes("mahal") || react.includes("love") || react.includes("lab") || react.includes("😊") || 
		react.includes("ilove") || react.includes("ilab") || react.includes("labyu") || react.includes("kiss") ||
		react.includes("yie") || react.includes("kwass") || react.includes("krass") || react.includes("crush") ||
		react.includes("ligawan") || react.includes("kilig") || react.includes("😗") || react.includes("😙") ||
		react.includes("😘") || react.includes("😚") || react.includes("ugh") || react.includes("sige pa") ||
		react.includes("sarap") || react.includes("sex") || react.includes("☺") || react.includes("porn") || 
		react.includes("kantotan") || react.includes("iyotan") || react.includes("pasend") || react.includes("iyut") ||
		react.includes("iyot") || react.includes("eut") || react.includes("😍") || react.includes("shet") ||
		react.includes("send") || react.includes("baby") || react.includes("babe") || react.includes("babi") || 
		react.includes("bby") || react.includes("kantot") || react.includes("manyak") || react.includes("libog") || 
		react.includes("horn") || react.includes("malibog") || react.includes("labs") || react.includes("pekpek") || 
		react.includes("pepe") || react.includes("🤭") || react.includes("🥰") || react.includes("puke") || react.includes("bilat") ||
		react.includes("puday") || react.includes("finger") || react.includes("fifinger") || react.includes("pipinger") ||
		react.includes("pinger") || react.includes("mwah") || react.includes("mwuah") || react.includes("halikan") ||
		react.includes("marry") || react.includes("😇") || react.includes("🤡")
	) {
		var lab = { body: "" };
		api.sendMessage(lab, threadID, messageID);
		api.setMessageReaction("😍", event.messageID, (err) => {}, true);
	}

	if (
		react.includes("sakit") || react.includes("saket") || react.includes("peyn") || react.includes("pain") || 
		react.includes("mamatay") || react.includes("ayaw ko na") || react.includes("saktan") || react.includes("sad") || 
		react.includes("malungkot") || react.includes("😥") || react.includes("😰") || react.includes("😨") || 
		react.includes("😢") || react.includes(":(") || react.includes("😔") || react.includes("😞") || react.includes("depress") || 
		react.includes("stress") || react.includes("kalungkutan") || react.includes("😭")
	) {
		var sad = { body: "" };
		api.sendMessage(sad, threadID, messageID);
		api.setMessageReaction("😢", event.messageID, (err) => {}, true);
	}

	if (
		react.includes("eve") || react.includes("morning") || react.includes("afternoon") || react.includes("evening") || 
		react.includes("eat") || react.includes("night") || react.includes("nyt")
	) {
		var heart = { body: "" };
		api.sendMessage(heart, threadID, messageID);
		api.setMessageReaction("❤", event.messageID, (err) => {}, true);
	}
};

module.exports.run = function() {};

