const axios = require("axios");
const fs = require('fs')
module.exports = {
  config: {
    name: "stalk" ,
    usePrefix: true,
     credits:"1SOY DEV",
     usage:`stalk @user`,
    description: "stalk the tag user",
    permission: 1, 
  },
  run: async function({ api, event, args, commandModules }) {
 try{
if (Object.keys(event.mentions).length === 0) {
  api.sendMessage('Please Mention A User', event.threadID, event.messageID);
} else {
  for (var i = 0; i < Object.keys(event.mentions).length; i++) {
    const mentionedUID = Object.keys(event.mentions)[i];
    const userInfo = await api.getUserInfo(mentionedUID);
    const fname = userInfo[mentionedUID].name;
const acculr = userInfo[mentionedUID].profileUrl;
    const gendernum = userInfo[mentionedUID].gender;
    let gender = "";
    const Avatar = (await axios.get(
      `https://graph.facebook.com/${mentionedUID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      { responseType: 'arraybuffer' }
    )).data;
if(gendernum == 2){
gender = "Male";
}
    else if(gendernum ==1){
      gender = "Female";
    }
    if(mentionedUID == 100039366339941){
      gender= "Bading";
    }
    fs.writeFileSync('cache/avt.png', Buffer.from(Avatar, 'binary'));

    const formattedMention = {
      body: `Name: ${fname}\nUID: ${mentionedUID} \n profile URL: ${acculr} \n Gender: ${gender}`,
      attachment: fs.createReadStream('cache/avt.png')
    };

    api.sendMessage(formattedMention, event.threadID);
  }
}
          }catch(error){
            console.log(error);
          }
  },////////////////
};
