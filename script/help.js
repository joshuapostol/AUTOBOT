module.exports.config = {
    name: 'help',
    version: '1.0.0',
    role: 0,
    hasPrefix: false,
    aliases: ['help'],
    description: "Beginner's guide",
    usage: "Help [page] or [command]",
    credits: 'Developer',
};

module.exports.run = async function({
    api,
    event,
    enableCommands,
    args,
    Utils,
    prefix
}) {
    const input = args.join(' ');
    try {
        const eventCommands = enableCommands[1].handleEvent;
        const commands = enableCommands[0].commands;
        const yourName = "CHURCHILL"; // Replace "CHURCHILL" with your actual name
        const fbLink = "https://www.facebook.com/profile.php?id=100087212564100";
        
        if (!input) {
            const pages = 999;
            let page = 1;
            let start = (page - 1) * pages;
            let end = start + pages;
            let helpMessage = `🔴🟢🟡\n\n====『 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗟𝗜𝗦𝗧: 』====\n
            ▱▱▱▱▱▱▱▱▱▱▱▱▱\n\n`;
            for (let i = start; i < Math.min(end, commands.length); i++) {
                helpMessage += `╭─╮\n |\t『 ${i + 1}.』  ${prefix}${commands[i]}\n╰─────────────ꔪ\n`;
            }
            helpMessage += '\n====『 𝗘𝗩𝗘𝗡𝗧 𝗟𝗜𝗦T: 』====\n▱▱▱▱▱▱▱▱▱▱▱▱▱\n\n';
            eventCommands.forEach((eventCommand, index) => {
                helpMessage += `╭─────────────────╮\n |\t『 ${index + 1}.』  ${prefix}${eventCommand}\n╰─────────────────╯ \n`;
            });
            helpMessage += `\nPage ${page}/${Math.ceil(commands.length / pages)}. To view the next page, type '${prefix}help page number'. To view information about a specific command, type '${prefix}help command name'.\n\n`;
            helpMessage += `Developer: ${yourName}\nFacebook: ${fbLink}`;
            api.sendMessage(helpMessage, event.threadID, event.messageID);
        } else if (!isNaN(input)) {
            // Remaining code remains unchanged
        } else {
            // Remaining code remains unchanged
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports.handleEvent = async function({
    api,
    event,
    prefix
}) {
    const {
        threadID,
        messageID,
        body
    } = event;
    const message = prefix ? 'This is my prefix: ' + prefix : "Sorry i don't have prefix";
    if (body?.toLowerCase().startsWith('prefix')) {
        api.sendMessage(message, threadID, messageID);
    }
}
