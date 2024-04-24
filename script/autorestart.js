module.exports.config = {
    name: "autorestart",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "Deku",
    description: "auto restart every hour",
  usePrefix: true,
    commandCategory: "System",
    cooldowns: 0
}
module.exports.handleEvent = async function({ api, event, args, Users,Threads }) {
  const moment = require("moment-timezone");
  var timeNow = moment.tz("Asia/Manila").format("HH:mm:ss");
  var idad = global.config.ADMINBOT;
  console.log(timeNow)
  var seconds = moment.tz("Asia/Manila").format("ss");
  var timeRestart1 = `01:00:${seconds}`
  var timeRestart2 = `02:00:${seconds}`
  var timeRestart3 = `03:00:${seconds}`
  var timeRestart4 = `04:00:${seconds}`
  var timeRestart5 = `05:00:${seconds}`
  var timeRestart6 = `06:00:${seconds}`
  var timeRestart7 = `07:00:${seconds}`
  var timeRestart8 = `08:00:${seconds}`
  var timeRestart9 = `09:00:${seconds}`
  var timeRestart10 = `10:00:${seconds}`
  var timeRestart11 = `11:00:${seconds}`
  var timeRestart12 = `12:00:${seconds}`
  var timeRestart13 = `13:00:${seconds}`
  var timeRestart14 = `14:00:${seconds}`
  var timeRestart15 = `15:00:${seconds}`
  var timeRestart16 = `16:00:${seconds}`
  var timeRestart17 = `17:00:${seconds}`
  var timeRestart18 = `18:00:${seconds}`
  var timeRestart19 = `19:00:${seconds}`
  var timeRestart20 = `20:00:${seconds}`
  var timeRestart21 = `21:00:${seconds}`
  var timeRestart22 = `22:00:${seconds}`
  var timeRestart23 = `23:00:${seconds}`
  var timeRestart24 = `24:00:${seconds}`
  //console.log(timeNowRestart)
  if ((timeNow == timeRestart1 || timeNow == timeRestart2 || timeNow == timeRestart3|| timeNow == timeRestart4|| timeNow == timeRestart5|| timeNow == timeRestart6 || timeNow == timeRestart7|| timeNow == timeRestart8 || timeNow == timeRestart9 || timeNow == timeRestart10 || timeNow == timeRestart11 || timeNow == timeRestart12 || timeNow == timeRestart13 || timeNow == timeRestart14 || timeNow == timeRestart15 || timeNow == timeRestart16) && seconds < 6 ) {
    for( let ad of idad) {
  setTimeout(() =>
          api.sendMessage(`Now: ${timeNow}\nThe bot will proceed to reboot`,ad, () =>process.exit(1)), 1000);
    }
    }
}
module.exports.run = async  ({ api, event, args }) => {
      const moment = require("moment-timezone");
      var timeNow = moment.tz("Asia/Manila").format("HH:mm:ss");
api.sendMessage(`${timeNow}`, event.threadID)
}
