const req = require("./req");

class TempMail {
  constructor(username, domain = "1secmail.com", onready = null) {
    this.username = username;
    this.domain = domain;

    this.onready = onready || (() => {});

    this._autoFetch = false;

    this.domainsCache = [];
    this.phpsessid = "";

    this.getDomains().then((domains) => {
      this.domainsCache = domains;

      if (domains.includes(domain)) {
        req(
          `https://www.1secmail.com/?login=${this.username}&domain=${this.domain}`
        ).then((resp) => {
          if (resp.headers["set-cookie"]) {
            const m = (
              typeof resp.headers["set-cookie"] == "string"
                ? [resp.headers["set-cookie"]]
                : resp.headers["set-cookie"]
            )[0].match(/PHPSESSID=([^;]+)/);

            if (m && m[1]) this.phpsessid = m[1];
          }

          this.onready();
        });
      } else
        throw new Error(
          `Invalid domain "${domain}". Available domains are ${domains}`
        );
    });
  }

  autoFetch(flag = true) {
    this._autoFetch = flag;
  }

  onReady(callback) {
    if (callback) this.onready = callback;
  }

  static async getRandomAddress(count = 1) {
    let resp = await req(
      `https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=${count}`
    );

    let addresses = resp.data.map((address) => {
      return address.split("@").slice(0, 2);
    });

    return addresses;
  }

  async getDomains() {
    return (await req("https://www.1secmail.com/api/v1/?action=getDomainList"))
      .data;
  }

  async getMail() {
    let emails = (
      await req(
        `https://www.1secmail.com/api/v1/?action=getMessages&login=${this.username}&domain=${this.domain}`
      )
    ).data;

    emails = emails.map(
      (email) =>
        new Email(email.id, email.from, email.subject, email.date, this)
    );

    if (this._autoFetch)
      for (let i = 0; i < emails.length; i++) {
        const resp = await emails[i].getMail();

        emails[i].attachments = resp.attachments;
        emails[i].body = resp.body;
        emails[i].textBody = resp.textBody;
        emails[i].htmlBody = resp.htmlBody;
      }

    return emails;
  }

  async getMessage(id) {
    return (
      await req(
        `https://www.1secmail.com/api/v1/?action=readMessage&login=${this.username}&domain=${this.domain}&id=${id}`
      )
    ).data;
  }

  async getAttachment(id, file) {
    return (
      await req(
        `https://www.1secmail.com/api/v1/?action=download&login=${this.username}&domain=${this.domain}&id=${id}&file=${file}`
      )
    ).data;
  }

  async fetchEmail(id) {
    return (
      await req(
        `https://www.1secmail.com/api/v1/?action=readMessage&login=${this.username}&domain=${this.domain}&id=${id}`
      )
    ).data;
  }

  async deleteMail() {
    return (
      await req(`https://www.1secmail.com/mailbox`, {
        method: "POST",
        data: `action=deleteMailbox&login=${this.username}&domain=${this.domain}`,
        headers: {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          origin: "https://www.1secmail.com",
          referer: `https://www.1secmail.com/?login=${this.username}&domain=${this.domain}`,
          "x-requested-with": "XMLHttpRequest",
          cookie: `PHPSESSID=${this.phpsessid}`,
        },
      })
    ).data;
  }

  get address() {
    return `${this.username}@${this.domain}`;
  }
}

class Email {
  constructor(id, from, subject, date, client) {
    this.id = id;
    this.from = from;
    this.subject = subject;
    this.date = date;

    this.attachments = [];
    this.body = "";
    this.textBody = "";
    this.htmlBody = "";

    this.client = client;
  }

  async getMail() {
    return await this.client.fetchEmail(this.id);
  }
}

module.exports = {
  TempMail,
  Email,
};
