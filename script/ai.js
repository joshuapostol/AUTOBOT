const axios = require("axios");
const Prefixes = ["Ai", "Beb", "Coco", "ai", "Bot", "Aiai", "AiBot", "Chill", "Wow"];

module.exports = {
    config: {
        name: "ai",
        version: 1,
        author: "OtinXSandip",
        longDescription: "AI",
        category: "ai",
        guide: { en: "/ai <question>: Ask the AI" }
    },

    onChat: async function ({ api, event, args, message }) {
        try {
            const prefix = Prefixes.find(prefix => event.body && event.body.toLowerCase().startsWith(prefix.toLowerCase()));
            if (!prefix) return;

            const question = event.body.substring(prefix.length).trim();
            if (!question) {
                await message.send("Hey I'm your virtual assistant 🤖, ask me a question and I'll do my best to answer it.");
                return;
            }

            const response = await axios.get(`https://sandipbaruwa.com/gpt?prompt=${encodeURIComponent(question)}`);
            const answer = response.data.answer;

            const botInfo = "This bot was created by Churchill. Check out his Facebook profile: https://www.facebook.com/profile.php?id=100087212564100";
            const finalAnswer = `${answer}\n\n- ${botInfo}`;

            await message.reply(finalAnswer);
        } catch (error) {
            console.error("Error:", error);
        }
    }
};
