const fs = require('fs');
const path = require('path');
const login = require('./fb-chat-api/index');
const express = require('express');
const app = express();
const chalk = require('chalk');
const bodyParser = require('body-parser');
const axios = require('axios');
const script = path.join(__dirname, 'script');
const moment = require("moment-timezone");
const cron = require('node-cron');
const config = fs.existsSync('./data') && fs.existsSync('./data/config.json') ? JSON.parse(fs.readFileSync('./data/config.json', 'utf8')) : createConfig();
const Utils = new Object({
  commands: new Map(),
  handleEvent: new Map(),
  account: new Map(),
  cooldowns: new Map(),
});
fs.readdirSync(script).forEach((file) => {
  const scripts = path.join(script, file);
  const stats = fs.statSync(scripts);
  if (stats.isDirectory()) {
    fs.readdirSync(scripts).forEach((file) => {
      try {
        const {
          config,
          run,
          handleEvent
        } = require(path.join(scripts, file));
        if (config) {
          const {
            name = [], role = '0', version = '1.0.0', hasPrefix = true, aliases = [], description = '', usage = '', credits = '', cooldown = '5'
          } = Object.fromEntries(Object.entries(config).map(([key, value]) => [key.toLowerCase(), value]));
          aliases.push(name);
          if (run) {
            Utils.commands.set(aliases, {
              name,
              role,
              run,
              aliases,
              description,
              usage,
              version,
              hasPrefix: config.hasPrefix,
              credits,
              cooldown
            });
          }
          if (handleEvent) {
            Utils.handleEvent.set(aliases, {
              name,
              handleEvent,
              role,
              description,
              usage,
              version,
              hasPrefix: config.hasPrefix,
              credits,
              cooldown
            });
          }
        }
      } catch (error) {
        console.error(chalk.red(`Error installing command from file ${file}: ${error.message}`));
      }
    });
  } else {
    try {
      const {
        config,
        run,
        handleEvent
      } = require(scripts);
      if (config) {
        const {
          name = [], role = '0', version = '1.0.0', hasPrefix = true, aliases = [], description = '', usage = '', credits = '', cooldown = '5'
        } = Object.fromEntries(Object.entries(config).map(([key, value]) => [key.toLowerCase(), value]));
        aliases.push(name);
        if (run) {
          Utils.commands.set(aliases, {
            name,
            role,
            run,
            aliases,
            description,
            usage,
            version,
            hasPrefix: config.hasPrefix,
            credits,
            cooldown
          });
        }
        if (handleEvent) {
          Utils.handleEvent.set(aliases, {
            name,
            handleEvent,
            role,
            description,
            usage,
            version,
            hasPrefix: config.hasPrefix,
            credits,
            cooldown
          });
        }
      }
    } catch (error) {
      console.error(chalk.red(`Error installing command from file ${file}: ${error.message}`));
    }
  }
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(express.json());
const routes = [{
  path: '/',
  file: 'index.html'
}, {
  path: '/step_by_step_guide',
  file: 'guide.html'
}, {
  path: '/online_user',
  file: 'online.html'
}, ];
routes.forEach(route => {
  app.get(route.path, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', route.file));
  });
});
app.get('/info', (req, res) => {
  const data = Array.from(Utils.account.values()).map(account => ({
    name: account.name,
    profileUrl: account.profileUrl,
    thumbSrc: account.thumbSrc,
    time: account.time
  }));
  res.json(JSON.parse(JSON.stringify(data, null, 2)));
});
app.get('/commands', (req, res) => {
  const command = new Set();
  const commands = [...Utils.commands.values()].map(({
    name
  }) => (command.add(name), name));
  const handleEvent = [...Utils.handleEvent.values()].map(({
    name
  }) => command.has(name) ? null : (command.add(name), name)).filter(Boolean);
  const role = [...Utils.commands.values()].map(({
    role
  }) => (command.add(role), role));
  const aliases = [...Utils.commands.values()].map(({
    aliases
  }) => (command.add(aliases), aliases));
  res.json(JSON.parse(JSON.stringify({
    commands,
    handleEvent,
    role,
    aliases
  }, null, 2)));
});
app.post('/login', async (req, res) => {
  const {
    state,
    commands,
    prefix,
    admin
  } = req.body;
  try {
    if (!state) {
      throw new Error('Missing app state data');
    }
    const cUser = state.find(item => item.key === 'c_user');
    if (cUser) {
      const existingUser = Utils.account.get(cUser.value);
      if (existingUser) {
        console.log(`User ${cUser.value} is already logged in`);
        return res.status(400).json({
          error: false,
          message: "Active user session detected; already logged in",
          user: existingUser
        });
      } else {
        try {
          await accountLogin(state, commands, prefix, [admin]);
          res.status(200).json({
            success: true,
            message: 'Authentication process completed successfully; login achieved.'
          });
        } catch (error) {
          console.error(error);
          res.status(400).json({
            error: true,
            message: error.message
          });
        }
      }
    } else {
      return res.status(400).json({
        error: true,
        message: "There's an issue with the appstate data; it's invalid."
      });
    }
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: "There's an issue with the appstate data; it's invalid."
    });
  }
});
app.listen(3000, () => {
  console.log(
`⣿⣿⣿█════╝░`);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Promise Rejection:', reason);
});
async function accountLogin(state, enableCommands = [], prefix, admin = []) {
  return new Promise((resolve, reject) => {
    login({
      appState: state
    }, async (error, api) => {
      if (error) {
        reject(error);
        return;
      }
      const userid = await api.getCurrentUserID();
      addThisUser(userid, enableCommands, state, prefix, admin);
      try {
        const userInfo = await api.getUserInfo(userid);
        if (!userInfo || !userInfo[userid]?.name || !userInfo[userid]?.profileUrl || !userInfo[userid]?.thumbSrc) throw new Error('Unable to locate the account; it appears to be in a suspended or locked state.');
        const {
          name,
          profileUrl,
          thumbSrc
        } = userInfo[userid];
        let time = (JSON.parse(fs.readFileSync('./data/history.json', 'utf-8')).find(user => user.userid === userid) || {}).time || 0;
        Utils.account.set(userid, {
          name,
          profileUrl,
          thumbSrc,
          time: time
        });
        const intervalId = setInterval(() => {
          try {
            const account = Utils.account.get(userid);
            if (!account) throw new Error('Account not found');
            Utils.account.set(userid, {
              ...account,
              time: account.time + 1
            });
          } catch (error) {
            clearInterval(intervalId);
            return;
          }
        }, 1000);
      } catch (error) {
        reject(error);
        return;
      }
      api.setOptions({
        listenEvents: config[0].fcaOption.listenEvents,
        logLevel: config[0].fcaOption.logLevel,
        updatePresence: config[0].fcaOption.updatePresence,
        selfListen: config[0].fcaOption.selfListen,
        forceLogin: config[0].fcaOption.forceLogin,
        online: config[0].fcaOption.online,
        autoMarkDelivery: config[0].fcaOption.autoMarkDelivery,
        autoMarkRead: config[0].fcaOption.autoMarkRead,
      });
      try {
        var listenEmitter = api.listenMqtt(async (error, event) => {
          if (error) {
            if (error === 'Connection closed.') {
              console.error(`Error during API listen: ${error}`, userid);
            }
            console.log(error)
          }
          let database = fs.existsSync('./data/database.json') ? JSON.parse(fs.readFileSync('./data/database.json', 'utf8')) : createDatabase();
          let data = Array.isArray(database) ? database.find(item => Object.keys(item)[0] === event?.threadID) : {};
          let adminIDS = data ? database : createThread(event.threadID, api);
          let blacklist = (JSON.parse(fs.readFileSync('./data/history.json', 'utf-8')).find(blacklist => blacklist.userid === userid) || {}).blacklist || [];
          let hasPrefix = (event.body && aliases((event.body || '')?.trim().toLowerCase().split(/ +/).shift())?.hasPrefix == false) ? '' : prefix;
          let [command, ...args] = ((event.body || '').trim().toLowerCase().startsWith(hasPrefix?.toLowerCase()) ? (event.body || '').trim().substring(hasPrefix?.length).trim().split(/\s+/).map(arg => arg.trim()) : []);
          if (hasPrefix && aliases(command)?.hasPrefix === false) {
            api.sendMessage(`Invalid usage this command doesn't need a prefix`, event.threadID, event.messageID);
            return;
          }
          if (event.body && aliases(command)?.name) {
            const role = aliases(command)?.role ?? 0;
            const isAdmin = config?.[0]?.masterKey?.admin?.includes(event.senderID) || admin.includes(event.senderID);
            const isThreadAdmin = isAdmin || ((Array.isArray(adminIDS) ? adminIDS.find(admin => Object.keys(admin)[0] === event.threadID) : {})?.[event.threadID] || []).some(admin => admin.id === event.senderID);
            if ((role == 1 && !isAdmin) || (role == 2 && !isThreadAdmin) || (role == 3 && !config?.[0]?.masterKey?.admin?.includes(event.senderID))) {
              api.sendMessage(`You don't have permission to use this command.`, event.threadID, event.messageID);
              return;
            }
          }
          if (event.body && event.body?.toLowerCase().startsWith(prefix.toLowerCase()) && aliases(command)?.name) {
            if (blacklist.includes(event.senderID)) {
              api.sendMessage("We're sorry, but you've been banned from using bot. If you believe this is a mistake or would like to appeal, please contact one of the bot admins for further assistance.", event.threadID, event.messageID);
              return;
            }
          }
					if (event.body !== null) {
						// Check if the message type is log:subscribe
						if (event.logMessageType === "log:subscribe") {
							const request = require("request");
							const moment = require("moment-timezone");
							var thu = moment.tz('Asia/Manila').format('dddd');
							if (thu == 'Sunday') thu = 'Sunday'
							if (thu == 'Monday') thu = 'Monday'
							if (thu == 'Tuesday') thu = 'Tuesday'
							if (thu == 'Wednesday') thu = 'Wednesday'
							if (thu == "Thursday") thu = 'Thursday'
							if (thu == 'Friday') thu = 'Friday'
							if (thu == 'Saturday') thu = 'Saturday'
							const time = moment.tz("Asia/Manila").format("HH:mm:ss - DD/MM/YYYY");										
							const fs = require("fs-extra");
							const { threadID } = event;

					if (event.logMessageData.addedParticipants && Array.isArray(event.logMessageData.addedParticipants) && event.logMessageData.addedParticipants.some(i => i.userFbId == userid)) {
					api.changeNickname(`》 ${prefix} 《 ❃ ➠JAYBOT`, threadID, userid);

					let gifUrl = 'https://i.imgur.com/gBYZHdw.mp4';
					let gifPath = __dirname + '/cache/connected.jpeg';

					axios.get(gifUrl, { responseType: 'arraybuffer' })
					.then(response => {
					fs.writeFileSync(gifPath, response.data);					  return api.sendMessage(`🔴🟢🟡\n\n✅ 𝗚𝗥𝗢𝗨𝗣 𝗖𝗢𝗡𝗡𝗘𝗖𝗧𝗜𝗢𝗡 𝗦𝗨𝗖𝗖𝗘𝗦! \n➭ Bot Prefix: ${prefix}\n➭ Admin: ‹${admin}›\n➭ Facebook: ‹https://www.facebook.com/swordigo.swordslush›\n➭ Use ${prefix}help to view command details\n➭ Added bot at: ⟨ ${time} ⟩〈 ${thu} 〉`, event.threadID,
					);
					})
					.catch(error => {
					console.error('Error fetching GIF:', error);
					});
							} else {
								try {
									const fs = require("fs-extra");
									let { threadName, participantIDs } = await api.getThreadInfo(threadID);

									var mentions = [], nameArray = [], memLength = [], i = 0;

									let addedParticipants1 = event.logMessageData.addedParticipants;
									for (let newParticipant of addedParticipants1) {
										let userID = newParticipant.userFbId;
										api.getUserInfo(parseInt(userID), (err, data) => {
											if (err) { return console.log(err); }
											var obj = Object.keys(data);
											var userName = data[obj].name.replace("@", "");
											if (userID !== api.getCurrentUserID()) {

												nameArray.push(userName);
												mentions.push({ tag: userName, id: userID, fromIndex: 0 });

												memLength.push(participantIDs.length - i++);
												memLength.sort((a, b) => a - b);

													(typeof threadID.customJoin == "undefined") ? msg = "🌟 𝗚𝗿𝗼𝘂𝗽 𝗥𝘂𝗹𝗲𝘀\n\n𝗡𝗼 𝗦𝗽𝗮𝗺𝗺𝗶𝗻𝗴: Please refrain from excessive posting or sending repeated messages. Respect others' space in the group.\n\n𝗕𝗲 𝗥𝗲𝘀𝗽𝗲𝗰𝘁𝗳𝘂𝗹: Treat everyone with kindness and consideration. Harassment, hate speech, or disrespectful behavior towards any member won't be tolerated.\n\n𝗡𝗼 𝗜𝗹𝗹𝗲𝗴𝗮𝗹 𝗖𝗼𝗻𝘁𝗲𝗻𝘁: Any form of content that violates local, national, or international laws is strictly prohibited. This includes but is not limited to illegal downloads, explicit material, etc.\n\n𝗙𝗼𝗹𝗹𝗼𝘄 𝗔𝗱𝗱𝗶𝘁𝗶𝗼𝗻𝗮𝗹 𝗚𝘂𝗶𝗱𝗲𝗹𝗶𝗻𝗲𝘀: Any rules or guidelines pinned in the group should be strictly adhered to. These may include specific guidelines for certain activities or interactions within the group.\n\n𝗔𝗰𝘁𝗶𝘃𝗶𝘁𝘆 𝗥𝗲𝗾𝘂𝗶𝗿𝗲𝗺𝗲𝗻𝘁: Members are expected to maintain at least a minimal level of activity. Inactive members for an extended period without prior notice may be subject to removal.\n\n𝗥𝗲𝘀𝗽𝗲𝗰𝘁 𝗔𝗱𝗺𝗶𝗻 𝗮𝗻𝗱 𝗠𝗲𝗺𝗯𝗲𝗿𝘀: Show respect to the group administrators and fellow members. Disrespect towards any group member, including admins, will not be tolerated.\n\n𝗡𝗼 𝗦𝗲𝗲𝗻𝗲𝗿: Avoid using the seen feature to track or ignore messages intentionally.\n\n𝗡𝗼 𝗢𝘃𝗲𝗿𝗮𝗰𝘁𝗶𝗻𝗴: Refrain from exaggerated or dramatic behavior that disrupts the harmony of the group.\n\n𝗡𝗼 𝗥𝗼𝗹𝗲-𝗽𝗹𝗮𝘆𝗶𝗻𝗴: The group is meant for genuine conversation and interaction, not for role-playing activities.\n\n𝗦𝘂𝗽𝗽𝗼𝗿𝘁 𝗘𝗮𝗰𝗵 𝗢𝘁𝗵𝗲𝗿: Feel free to share and promote your respective accounts for mutual support and encouragement among members.\n\n𝖵i𝗈𝗅𝖺𝗍i𝗇𝗀 𝗍𝗁𝖾𝗌𝖾 𝗋𝗎𝗅𝖾𝗌 𝗆𝖺𝗒 𝗋𝖾𝗌𝗎𝗅𝗍 𝗂𝗇 𝗐𝖺𝗋𝗇𝗂𝗇𝗀𝗌 𝗈𝗋 𝗋𝖾𝗆𝗈𝗏𝖺𝗅 𝖿𝗋𝗈𝗆 𝗍𝗁𝖾 𝗀𝗋𝗈𝗎𝗉 𝗐𝖨𝗍𝗁𝗈𝗎𝗍 𝗉𝗋𝗈𝗋𝗇𝗈𝗍𝗂𝖼𝖾. 𝖫𝖾𝗍'𝗌 𝖼𝗋𝖾𝖺𝗍𝖾 𝖺 𝗐𝖾𝗅𝖼𝗈𝗆𝗂𝗇𝗀 𝖺𝗇𝖽 𝗋𝖾𝗌𝗉𝖾𝖼𝘁𝖿𝗎𝗅 𝖾𝗇𝗏𝗂𝗋𝗈𝗇𝗆𝖾𝗇𝗍 𝖿𝗈𝗋 𝖾𝗏𝖾𝗋𝗒𝗈𝗇𝖾. 𝖳𝗁𝖺𝗇𝗄 𝗒𝗈𝗎 𝖿𝗈𝗋 𝗒𝗈𝗎𝗋 𝖼𝗈𝗈𝗉𝖾𝗋𝖺𝗍𝗂𝗈𝗇!\n\n\n\nHELLO!, {uName}\n┌────── ～●～ ──────┐\n----- Welcome to {threadName} -----\n└────── ～●～ ──────┘\nYou're the {soThanhVien} member of this group, please enjoy! 🥳♥" : msg = threadID.customJoin;
													msg = msg
														.replace(/\{uName}/g, nameArray.join(', '))
														.replace(/\{type}/g, (memLength.length > 1) ? 'you' : 'Friend')
														.replace(/\{soThanhVien}/g, memLength.join(', '))
														.replace(/\{threadName}/g, threadName);


													let callback = function() {
														return api.sendMessage({ body: msg, attachment: fs.createReadStream(__dirname + `/cache/come.jpg`), mentions }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/come.jpg`))
													};
																				request(encodeURI(`https://api.popcat.xyz/welcomecard?background=https://i.ibb.co/X7NyF43/1000008763.png&text1=${userName}&text2=Welcome+To+${threadName}&text3=You+Are+The ${participantIDs.length}th+Member&avatar=https://i.postimg.cc/J0X4nSK4/Black-clover-Nacht.jpg`)).pipe(fs.createWriteStream(__dirname + `/cache/come.jpg`)).on("close", callback);
																			}
																		})
																	}
																} catch (err) {
																	return console.log("ERROR: " + err);
						}
					 }
					}
					}										
					if (event.body !== null) {
					 if (event.logMessageType === "log:unsubscribe") {
						 api.getThreadInfo(event.threadID).then(({ participantIDs }) => {
							 let leaverID = event.logMessageData.leftParticipantFbId;
							 api.getUserInfo(leaverID, (err, userInfo) => {
								 if (err) {
									 return console.error('Failed to get user info:', err);
								 }
								 const name = userInfo[leaverID].name;
								 const type = (event.author == event.logMessageData.leftParticipantFbId) ? "left the group." : "kicked by Admin of the group"; api.sendMessage(`${name} has ${type} the group.`, event.threadID);
							 });
						 })
					 }
					}
          if (event.body !== null) {
			       const regEx_tiktok = /https:\/\/(www\.|vt\.)?tiktok\.com\//;
						 const link = event.body;
																if (regEx_tiktok.test(link)) {
																	api.setMessageReaction("🚀", event.messageID, () => { }, true);
																	axios.post(`https://www.tikwm.com/api/`, {
																		url: link
																	}).then(async response => { // Added async keyword
																		const data = response.data.data;
																		const videoStream = await axios({
																			method: 'get',
																			url: data.play,
																			responseType: 'stream'
																		}).then(res => res.data);
																		const fileName = `TikTok-${Date.now()}.mp4`;
																		const filePath = `./${fileName}`;
																		const videoFile = fs.createWriteStream(filePath);

																		videoStream.pipe(videoFile);

																		videoFile.on('finish', () => {
																			videoFile.close(() => {
																				console.log('Downloaded video file.');

																				api.sendMessage({
																					body: `𝖠𝗎𝗍𝗈 𝖣𝗈𝗐𝗇 𝖳𝗂𝗄𝖳𝗈𝗄 \n\n𝙲𝚘𝚗𝚝𝚎𝚗𝚝: ${data.title}\n\n𝙻𝚒𝚔𝚎𝚜: ${data.digg_count}\n\n𝙲𝚘𝚖𝚖𝚎𝚗𝚝𝚜: ${data.comment_count}\n\nJAY 𝗕𝗢𝗧 𝟭.𝟬.𝟬𝘃`,
																					attachment: fs.createReadStream(filePath)
																				}, event.threadID, () => {
																					fs.unlinkSync(filePath);  // Delete the video file after sending it
																				});
																			});
																		});
																	}).catch(error => {
																		api.sendMessage(`Error when trying to download the TikTok video: ${error.message}`, event.threadID, event.messageID);
																	});
																}
															}
					                    if (event.body) {
										const response = await	axios.get(`https://lianeapi.onrender.com/autoreact?accessKey=cuteMoLiane&query=${encodeURIComponent(event.body)}`)
							.then(response => {
								api.setMessageReaction(response.data.message || "", event.messageID, () => {}, true);
							})
							.catch(error => {
								console.error('Error fetching auto reaction:', error);
							});
					}

					//*Auto Download Google Drive here By Jonell Magallanes//* 
				  if (event.body !== null) {
								(async () => {
									const fs = require('fs');
																		const { google } = require('googleapis');
																		const mime = require('mime-types');
																		const path = require('path');

																		const apiKey = 'AIzaSyCYUPzrExoT9f9TsNj7Jqks1ZDJqqthuiI'; // Your API key
																		if (!apiKey) {
																			console.error('No Google Drive API key provided.');
																			return;
																		}

																		const drive = google.drive({ version: 'v3', auth: apiKey });

																		// Regex pattern to detect Google Drive links in messages
																		const gdriveLinkPattern = /(?:https?:\/\/)?(?:drive.google.com\/(?:folderview\?id=|file\/d\/|open\?id=))([\w-]{33}|\w{19})(&usp=sharing)?/gi;
																		let match;

																		// Specify the directory to save files
																		const downloadDirectory = path.join(__dirname, 'downloads');


																		while ((match = gdriveLinkPattern.exec(event.body)) !== null) {
																			// Extract fileId from Google Drive link
																			const fileId = match[1];

																			try {
																				const res = await drive.files.get({ fileId: fileId, fields: 'name, mimeType' });
																				const fileName = res.data.name;
																				const mimeType = res.data.mimeType;

																				const extension = mime.extension(mimeType);
																				const destFilename = `${fileName}${extension ? '.' + extension : ''}`;
																				const destPath = path.join(downloadDirectory, destFilename);

																				console.log(`Downloading file "${fileName}"...`);

																				const dest = fs.createWriteStream(destPath);
																				let progress = 0;

																				const resMedia = await drive.files.get(
																					{ fileId: fileId, alt: 'media' },
																					{ responseType: 'stream' }
																				);

																				await new Promise((resolve, reject) => {
																					resMedia.data
																						.on('end', () => {
																							console.log(`Downloaded file "${fileName}"`);
																							resolve();
																						})
																						.on('error', (err) => {
																							console.error('Error downloading file:', err);
																							reject(err);
																						})
																						.on('data', (d) => {
																							progress += d.length;
																							process.stdout.write(`Downloaded ${progress} bytes\r`);
																						})
																						.pipe(dest);
																				});

																				console.log(`Sending message with file "${fileName}"...`);
																				// Use the fs.promises version for file reading
																				await api.sendMessage({ body: `𝖠𝗎𝗍𝗈 𝖽𝗈𝗐𝗇 𝖦𝗈𝗈𝗀𝗅𝖾 𝖣𝗋𝗂𝗏𝖾 𝖫𝗂𝗇𝗄 \n\n𝙵𝙸𝙻𝙴𝙽𝙰𝙼𝙴: ${fileName}\n\nJAY 𝗕𝗢𝗧 𝟭.𝟬.𝟬𝘃`, attachment: fs.createReadStream(destPath) }, event.threadID);

																				console.log(`Deleting file "${fileName}"...`);
																				await fs.promises.unlink(destPath);
																				console.log(`Deleted file "${fileName}"`);
																			} catch (err) {
																				console.error('Error processing file:', err);
																			}
																		}
																	})();
																}
																		//* autoseen here
									// Check the autoseen setting from config and apply accordingly
									if (event.body !== null) {
										api.markAsReadAll(() => { });
									}
									//*youtube auto down here
									if (event.body !== null) {
										const ytdl = require('ytdl-core');
										const fs = require('fs');
										const path = require('path');
										const simpleYT = require('simple-youtube-api');

										const youtube = new simpleYT('AIzaSyCMWAbuVEw0H26r94BhyFU4mTaP5oUGWRw');

										const youtubeLinkPattern = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

										const videoUrl = event.body;

										if (youtubeLinkPattern.test(videoUrl)) {
											youtube.getVideo(videoUrl)
												.then(video => {
													const stream = ytdl(videoUrl, { quality: 'highest' });


													const filePath = path.join(__dirname, `./downloads/${video.title}.mp4`);
													const file = fs.createWriteStream(filePath);


													stream.pipe(file);

													file.on('finish', () => {
														file.close(() => {
															api.sendMessage({ body: `𝖠𝗎𝗍𝗈 𝖣𝗈𝗐𝗇 𝖸𝗈𝗎𝖳𝗎𝖻𝖾 \n\nJAY 𝗕𝗢𝗧 𝟭.𝟬.𝟬𝘃`, attachment: fs.createReadStream(filePath) }, event.threadID, () => fs.unlinkSync(filePath));
														});
													});
												})
												.catch(error => {
													console.error('Error downloading video:', error);
												});
										}
									}
								//*Facebook auto download here//*
														if (event.body !== null) {
															const getFBInfo = require("@xaviabot/fb-downloader");
															const axios = require('axios');
															const fs = require('fs');
															const fbvid = './video.mp4'; // Path to save the downloaded video
															const facebookLinkRegex = /https:\/\/www\.facebook\.com\/\S+/;

															const downloadAndSendFBContent = async (url) => {
																try {
																	const result = await getFBInfo(url);
																	let videoData = await axios.get(encodeURI(result.sd), { responseType: 'arraybuffer' });
																	fs.writeFileSync(fbvid, Buffer.from(videoData.data, "utf-8"));
																	return api.sendMessage({ body: "𝖠𝗎𝗍𝗈 𝖣𝗈𝗐𝗇 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄 𝖵𝗂𝖽𝖾𝗈\n\n𝗬𝗔𝗭𝗞𝗬 𝗕𝗢𝗧 𝟭.𝟬.𝟬𝘃", attachment: fs.createReadStream(fbvid) }, event.threadID, () => fs.unlinkSync(fbvid));
																}
																catch (e) {
																	return console.log(e);
																}
															};

															if (facebookLinkRegex.test(event.body)) {
																downloadAndSendFBContent(event.body);
						 }
					 }	
           if (event.body && aliases(command)?.name) {
            const now = Date.now();
            const name = aliases(command)?.name;
            const sender = Utils.cooldowns.get(`${event.senderID}_${name}_${userid}`);
            const delay = aliases(command)?.cooldown ?? 0;
            if (!sender || (now - sender.timestamp) >= delay * 1000) {
              Utils.cooldowns.set(`${event.senderID}_${name}_${userid}`, {
                timestamp: now,
                command: name
              });
            } else {
              const active = Math.ceil((sender.timestamp + delay * 1000 - now) / 1000);
              api.sendMessage(`Please wait ${active} seconds before using the "${name}" command again.`, event.threadID, event.messageID);
              return;
            }
          }
          if (event.body && !command && event.body?.toLowerCase().startsWith(prefix.toLowerCase())) {
            api.sendMessage(`Invalid command please use ${prefix}help to see the list of available commands.`, event.threadID, event.messageID);
            return;
          }
          if (event.body && command && prefix && event.body?.toLowerCase().startsWith(prefix.toLowerCase()) && !aliases(command)?.name) {
            api.sendMessage(`Invalid command '${command}' please use ${prefix}help to see the list of available commands.`, event.threadID, event.messageID);
            return;
          }
          for (const {
              handleEvent,
              name
            }
            of Utils.handleEvent.values()) {
            if (handleEvent && name && (
                (enableCommands[1].handleEvent || []).includes(name) || (enableCommands[0].commands || []).includes(name))) {
              handleEvent({
                api,
                event,
                enableCommands,
                admin,
                prefix,
                blacklist
              });
            }
          }
          switch (event.type) {
            case 'message':
            case 'message_reply':
            case 'message_unsend':
            case 'message_reaction':
              if (enableCommands[0].commands.includes(aliases(command?.toLowerCase())?.name)) {
                await ((aliases(command?.toLowerCase())?.run || (() => {}))({
                  api,
                  event,
                  args,
                  enableCommands,
                  admin,
                  prefix,
                  blacklist,
                  Utils,
                }));
              }
              break;
          }
        });
      } catch (error) {
        console.error('Error during API listen, outside of listen', userid);
        Utils.account.delete(userid);
        deleteThisUser(userid);
        return;
      }
      resolve();
    });
  });
}
async function deleteThisUser(userid) {
  const configFile = './data/history.json';
  let config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
  const sessionFile = path.join('./data/session', `${userid}.json`);
  const index = config.findIndex(item => item.userid === userid);
  if (index !== -1) config.splice(index, 1);
  fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
  try {
    fs.unlinkSync(sessionFile);
  } catch (error) {
    console.log(error);
  }
}
async function addThisUser(userid, enableCommands, state, prefix, admin, blacklist) {
  const configFile = './data/history.json';
  const sessionFolder = './data/session';
  const sessionFile = path.join(sessionFolder, `${userid}.json`);
  if (fs.existsSync(sessionFile)) return;
  const config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
  config.push({
    userid,
    prefix: prefix || "",
    admin: admin || [],
    blacklist: blacklist || [],
    enableCommands,
    time: 0,
  });
  fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
  fs.writeFileSync(sessionFile, JSON.stringify(state));
}

function aliases(command) {
  const aliases = Array.from(Utils.commands.entries()).find(([commands]) => commands.includes(command?.toLowerCase()));
  if (aliases) {
    return aliases[1];
  }
  return null;
}
async function main() {
  const empty = require('fs-extra');
  const cacheFile = './script/cache';
  if (!fs.existsSync(cacheFile)) fs.mkdirSync(cacheFile);
  const configFile = './data/history.json';
  if (!fs.existsSync(configFile)) fs.writeFileSync(configFile, '[]', 'utf-8');
  const config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
  const sessionFolder = path.join('./data/session');
  if (!fs.existsSync(sessionFolder)) fs.mkdirSync(sessionFolder);
  const adminOfConfig = fs.existsSync('./data') && fs.existsSync('./data/config.json') ? JSON.parse(fs.readFileSync('./data/config.json', 'utf8')) : createConfig();
  cron.schedule(`* */${adminOfConfig[0].masterKey.restartTime} * * *`, async () => {
    const history = JSON.parse(fs.readFileSync('./data/history.json', 'utf-8'));
    history.forEach(user => {
      (!user || typeof user !== 'object') ? process.exit(1): null;
      (user.time === undefined || user.time === null || isNaN(user.time)) ? process.exit(1): null;
      const update = Utils.account.get(user.userid);
      update ? user.time = update.time : null;
    });
    await empty.emptyDir(cacheFile);
    await fs.writeFileSync('./data/history.json', JSON.stringify(history, null, 2));
    process.exit(1);
  });
  try {
    for (const file of fs.readdirSync(sessionFolder)) {
      const filePath = path.join(sessionFolder, file);
      try {
        const {
          enableCommands,
          prefix,
          admin,
          blacklist
        } = config.find(item => item.userid === path.parse(file).name) || {};
        const state = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        if (enableCommands) await accountLogin(state, enableCommands, prefix, admin, blacklist);
      } catch (error) {
        deleteThisUser(path.parse(file).name);
      }
    }
  } catch (error) {}
}

function createConfig() {
  const config = [{
    masterKey: {
      admin: [],
      devMode: false,
      database: false,
      restartTime: 15,
    },
    fcaOption: {
      forceLogin: true,
      listenEvents: true,
      logLevel: "silent",
      updatePresence: true,
      selfListen: false,
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64",
      online: true,
      autoMarkDelivery: false,
      autoMarkRead: false
    }
  }];
  const dataFolder = './data';
  if (!fs.existsSync(dataFolder)) fs.mkdirSync(dataFolder);
  fs.writeFileSync('./data/config.json', JSON.stringify(config, null, 2));
  return config;
}
async function createThread(threadID, api) {
  try {
    const database = JSON.parse(fs.readFileSync('./data/database.json', 'utf8'));
    let threadInfo = await api.getThreadInfo(threadID);
    let adminIDs = threadInfo ? threadInfo.adminIDs : [];
    const data = {};
    data[threadID] = adminIDs
    database.push(data);
    await fs.writeFileSync('./data/database.json', JSON.stringify(database, null, 2), 'utf-8');
    return database;
  } catch (error) {
    console.log(error);
  }
}
async function createDatabase() {
  const data = './data';
  const database = './data/database.json';
  if (!fs.existsSync(data)) {
    fs.mkdirSync(data, {
      recursive: true
    });
  }
  if (!fs.existsSync(database)) {
    fs.writeFileSync(database, JSON.stringify([]));
  }
  return database;
}
main()
      
