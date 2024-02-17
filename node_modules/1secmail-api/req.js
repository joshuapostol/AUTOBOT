const http = require("http");
const https = require("https");

function req(url, options = {}) {
  let parsed = new URL(url);

  if (options.json) {
    if (!options.headers["content-type"])
      options.headers["content-type"] = "application/json";

    options.json = JSON.stringify(options.json);

    if (!options.headers["content-length"])
      options.headers["content-length"] = Buffer.byteLength(options.json);
  } else if (options.data) {
    if (!options.headers["content-length"])
      options.headers["content-length"] = Buffer.byteLength(options.data);
  }

  return new Promise((resolve, reject) => {
    let r = (url.startsWith("https:") ? https : http).request(
      url,
      options,
      (resp) => {
        let str = "";
        let json = null;

        resp.on("data", (chunk) => {
          str += chunk;
        });

        resp.on("end", () => {
          try {
            json = JSON.parse(str);
          } catch (err) {
            json = false;
          }

          const rsv = {
            ...resp,
            headers: resp.headers,
            status: resp.statusCode,
            data: json || str,
          };

          resolve(rsv);
        });
      }
    );

    if (options.json) r.write(options.json);
    else if (options.data) r.write(options.data);

    r.end();
  });
}

module.exports = req;
