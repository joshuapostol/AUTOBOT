const axios = require('axios');

module.exports = {
    name: 'randomhugot',
    version: '1.0.0',
    author: 'Your Name',
    description: 'Get a random hugot quote',
    permissions: {
        '*': '2'
    },
    cooldown: 5,
    dependencies: {
        'axios': ''
    },
    usePrefix: true,

    execute: async function({ args, api, event }) {
        try {
            if (args.length !== 0) {
                api.sendMessage('⏱️ | Fetching random hugot quote. Please wait...', event.threadID, event.messageID);

                const response = await axios.get('https://joshua09.pythonanywhere.com/hugot');

                if (response && response.status === 200 && response.data && response.data.message) {
                    api.sendMessage(response.data.message, event.threadID);
                } else {
                    api.sendMessage('Failed to retrieve a hugot quote.', event.threadID);
                }
            } else {
                api.sendMessage('Invalid command usage. Usage: /randomhugot', event.threadID, event.messageID);
            }
        } catch (error) {
            console.error(error);
            api.sendMessage('Error fetching hugot quote.', event.threadID);
        }
    }
};
