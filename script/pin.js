const axios = require("axios");
const request = require("request");

module.exports.config = {
  name: "pinterest",
  version: "0.0.1",
  role: 0,
  aliases: ['pin', 'picture', 'photo']
};

module.exports.run = async function ({ api, event, args }) {
  const name = args.join(" ").trim().split("-")[0];
  const number = parseInt(args.join(" ").trim().split("-")[1]) || 5;
  if (number > 8) {
    return api.sendMessage("Number of limit exceeds maximum allowed (8)!", event.threadID);
  } else {
    api.sendMessage(`Sending ${number} Pinterest Pictures....\nPlease Wait few seconds!`, event.threadID);
  }
  
  const headers = {
    'authority': 'www.pinterest.com',
    'cache-control': 'max-age=0',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
    'sec-gpc': '1',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-mode': 'same-origin',
    'sec-fetch-dest': 'empty',
    'accept-language': 'en-US,en;q=0.9',
    'cookie': 'csrftoken=92c7c57416496066c4cd5a47a2448e28; g_state={"i_l":0}; _auth=1; _pinterest_sess=TWc9PSZBMEhrWHJZbHhCVW1OSzE1MW0zSkVid1o4Uk1laXRzdmNwYll3eEFQV0lDSGNRaDBPTGNNUk5JQTBhczFOM0ZJZ1ZJbEpQYlIyUmFkNzlBV2kyaDRiWTI4THFVUWhpNUpRYjR4M2dxblJCRFhESlBIaGMwbjFQWFc2NHRtL3RUcTZna1c3K0VjVTgyejFDa1VqdXQ2ZEQ3NG91L1JTRHZwZHNIcDZraEp1L0lCbkJWUytvRis2ckdrVlNTVytzOFp3ZlpTdWtCOURnbGc3SHhQOWJPTzArY3BhMVEwOTZDVzg5VDQ3S1NxYXZGUEEwOTZBR21LNC9VZXRFTkErYmtIOW9OOEU3ektvY3ZhU0hZWVcxS0VXT3dTaFpVWXNuOHhiQWdZdS9vY24wMnRvdjBGYWo4SDY3MEYwSEtBV2JxYisxMVVsV01McmpKY0VOQ3NYSUt2ZDJaWld6T0RacUd6WktITkRpZzRCaWlCTjRtVXNMcGZaNG9QcC80Ty9ZZWFjZkVGNURNZWVoNTY4elMyd2wySWhtdWFvS2dQcktqMmVUYmlNODBxT29XRWx5dWZSc1FDY0ZONlZJdE9yUGY5L0p3M1JXYkRTUDAralduQ2xxR3VTZzBveUc2Ykx3VW5CQ0FQeVo5VE8wTEVmamhwWkxwMy9SaTNlRUpoQmNQaHREbjMxRlRrOWtwTVI5MXl6cmN1K2NOTFNyU1cyMjREN1ZFSHpHY0ZCR1RocWRjVFZVWG9VcVpwbXNGdlptVzRUSkNadVc1TnlBTVNGQmFmUmtrNHNkVEhXZytLQjNUTURlZXBUMG9GZ3YwQnVNcERDak16Nlp0Tk13dmNsWG82U2xIKyt5WFhSMm1QUktYYmhYSDNhWnB3RWxTUUttQklEeGpCdE4wQlNNOVRzRXE2NkVjUDFKcndvUzNMM2pMT2dGM05WalV2QStmMC9iT055djFsYVBKZjRFTkRtMGZZcWFYSEYvNFJrYTZSbVRGOXVISER1blA5L2psdURIbkFxcTZLT3RGeGswSnRHdGNpN29KdGFlWUxtdHNpSjNXQVorTjR2NGVTZWkwPSZzd3cwOXZNV3VpZlprR0VBempKdjZqS00ybWM9; _b="AV+pPg4VpvlGtL+qN4q0j+vNT7JhUErvp+4TyMybo+d7CIZ9QFohXDj6+jQlg9uD6Zc="; _routing_id="d5da9818-8ce2-442"'
  };

  const options = {
    url: 'https://www.pinterest.com/search/pins/?q=' + encodeURIComponent(name) + '&rs=typed&term_meta[]=' + encodeURIComponent(name) + '%7Ctyped',
    headers: headers
  };

  function callback(error, response, body) {
    if (error) {
      console.error(error);
      return api.sendMessage("Error Occured! try again later.", event.threadID);
    }

    if (response.statusCode === 200) {
      const arrMatch = body.match(/https:\/\/i\.pinimg\.com\/originals\/[^.]+\.jpg/g);
      const imgabc = [];

      for (let i = 0; i < number && i < arrMatch.length; i++) {
        imgabc.push(axios.get(arrMatch[i], { responseType: "stream" }).then(res => res.data));
      }

      Promise.all(imgabc)
        .then(images => {
          const msg = {
            body: `<Pinterest|Pictures>\n\n${name} - ${number}`,
            attachment: images
          };
          api.sendMessage(msg, event.threadID, (error, messageInfo) => {
            if (error) {
              console.error(error);
            } else {
              setTimeout(() => {
                api.unsendMessage(messageInfo.messageID);
              }, 60000); // 1 minute = 60,000 milliseconds
            }
          });
        })
        .catch(err => {
          console.error(err);
          api.sendMessage("error ovcured please try again!", event.threadID);
        });
    } else {
      console.error(`Request failed with status code ${response.statusCode}`);
      api.sendMessage("api is unavailable at this moment!", event.threadID);
    }
  }

  request(options, callback);
};
