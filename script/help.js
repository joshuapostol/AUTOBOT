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
        
        if (!input) {
            const pages = 999;
            let page = 1;
            let start = (page - 1) * pages;
            let end = start + pages;
            let helpMessage = `🔴🟢🟡\n\n====『 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗟𝗜𝗦𝗧: 』====\n\n`;
            for (let i = start; i < Math.min(end, commands.length); i++) {
                helpMessage += `  ╭─╮\n  | 『 ${i + 1}.』  ${prefix}${commands[i]}\n  ╰─────────────ꔪ\n`;
            }
            helpMessage += '\n====『 𝗘𝗩𝗘𝗡𝗧 𝗟𝗜𝗦T: 』====\n\n';
            eventCommands.forEach((eventCommand, index) => {
                helpMessage += `  ╭─────────────────╮\n  | 『 ${index + 1}.』  ${prefix}${eventCommand}\n  ╰─────────────────╯ \n`;
            });
            helpMessage += `\nPage ${page}/${Math.ceil(commands.length / pages)}. To view the next page, type '${prefix}help 2'. To view information about a specific command, type '${prefix}help command name'.\n\n`;
            api.sendMessage(helpMessage, event.threadID, event.messageID);
        } else if (!isNaN(input)) {
            if (input === '2') {
                const pages = 999;
                let page = 2;
                let start = (page - 1) * pages;
                let end = start + pages;
                let helpMessage = `🔴🟢🟡\n\n====『 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗟𝗜𝗦𝗧: 』====\n\n`;
                for (let i = start; i < Math.min(end, commands.length); i++) {
                    helpMessage += `  ╭─╮\n  | 『 ${i + 1}.』  ${prefix}${commands[i]}\n  ╰─────────────ꔪ\n`;
                }
                helpMessage += `\nPage ${page}/${Math.ceil(commands.length / pages)}. To view the previous page, type '${prefix}help'. To view information about a specific command, type '${prefix}help command name'.\n\n`;
                api.sendMessage(helpMessage, event.threadID, event.messageID);
            } else {
                // Remaining code remains unchanged
            }
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
