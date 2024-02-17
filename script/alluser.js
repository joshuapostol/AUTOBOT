module.exports.config = {
	name: "alluser",
	credits: "cliff",
	version: '1.0.0',
	role: 0,
	cooldown: 0,
	aliases: ['user'],
	hasPrefix: false,
	usage: "",

};
module.exports.run = async function ({ api, event, args, Users }) {

 function reply(d) {
	api.sendMessage(d, event.threadID, event.messageID)
 }
 var ep = event.participantIDs;
 msg = ""
 msgs = ""
 m = 0;
 for (let i of ep) {
	m += 1;
	const name = await Users.getNameUser(i);
	msg += m+". "+name+"\nuser id : "+i+"\nfacebook link: https://facebook.com/"+i+"\n\n";
 }
 msgs += "all users in this group\n\n"+msg;
 reply(msgs)
}