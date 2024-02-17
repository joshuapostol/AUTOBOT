# 1secmail-api

A NodeJS API for [1secmail.com](https://1secmail.com)

## Examples and usage

The below example creates an email account at `exampleAccount@1secmail.com` and fetches emails every 10 seconds.

```javascript
const { TempMail } = require("1secmail-api");

// Create email account
const mail = new TempMail("exampleAccount");

// Enable auto-fetching full emails
mail.autoFetch();

// Wait until the client is ready
mail.onReady(() => {
  // Should show: exampleAccount@1secmail.com
  console.log("Email ready! Address:", mail.address);

  // Get emails every 10 seconds
  const fetch = () => {
    mail.getMail().then((mails) => {
      console.log(mails);

      mail.deleteMail();
    });
  };

  fetch();
  setInterval(fetch, 10 * 1000);
});
```

You can also chose different domains by passing an extra argument to the `TempMail` constructor:

```javascript
// john@esiix.com
const mail = new TempMail("john", "esiix.com");
```

To generate random email addresses use `mail`

```javascript
mail.getRandomAddress();
```

To download an attachment use `mail.getAttachment(id, file)` and pass the email ID and the file name.
