module.exports.config = {
		name: "ai",
		version: "1.0.0",
		role: 0,
		credits: "cliff",
		hasPrefix: false,
		description: "This module provides AI-powered responses using GPT-3.",
		usage: "<question>",
		cooldowns: 5,
	usePrefix: false,
	  hasPermission: 0,
	  usages: "<question>",
		cooldown: 5,
	 commandCategory: "gpt4",
		aliases: ["Gpt3"]
};

module.exports.run = async function ({ api, event, args, _GLOBAL, client}) {
		try {
				const { G4F } = require("g4f");

				function reply(a) {
						api.sendMessage(a, event.threadID, event.messageID);
				}

				const g4f = new G4F();
				const textInput = args.join(' ');
				if (!textInput) return reply('mag provide ka naman ng question tanginamo ka parang dika nag grade 2.');

				const messages = [
						{ role: "user", content: textInput }
				];
				const options = {
						provider: g4f.providers.GPT,
						model: "gpt-3.5-turbo",
						debug: true,
						proxy: `${global.config.UPDATE}`
				};
				const response = await g4f.chatCompletion(messages, options);
				reply(response);
		} catch (e) {
				return reply(e.message);
		}
}
