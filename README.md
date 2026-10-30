# Email.sender

Send out e-mails using Homey flows.

**Want to show your appreciation for this app? A donation is possible via http://www.d2c.nl **

If you wish to send through Gmail SMTP servers, turn on 2-step verification and create an app password via https://myaccount.google.com/apppasswords. Use that app password instead of your normal password.

Use your complete @gmail.com mail address as the username, smtp.gmail.com as the SMTP server and SMTP port 465 with an encrypted connection.

# Changelog

**Version 1.2.0**
- Runs on Node.js 22 (Homey v12.9.0 or newer) with the latest nodemailer
- New action card "Send an HTML mail"
- The image card can include an optional text and shows the image inside the mail
- Fixed: changed settings were not always used after saving
- Setting to accept self-signed or invalid certificates (on by default, as before)

**Version 0.2.4** 
- Support for new Homey 2.2.0 Image SDK

**Version 0.2.3**
- Improved settings page for Homey 2.0

**Version 0.2.2**
- Crash fix

**Version 0.2.1**
- Support for API sendmail 

**Version 0.2.0**
- Support for official Homey image tokens
- Homey SDK v2 version

**Version 0.1.6**
- New action card for "textonly" email. This will support \n as linebreaks/newlines.

**Version 0.1.5**
- Now supports "Image tokens" (for example, the ones created by Synology Surveillance Station or ImageGrabber) in the new action card "Send Image Token"

**Version 0.1.4**
- Fixed previously introduced bug with use_credentials

**Version 0.1.3**
- Add option in settings to enable/disable authentication (Error: 503 AUTH command used when not advertised)

**Version 0.1.2**
- Settings page now has a 'Use encrypted connection' setting that you can use if your mail provider supports (or requires) it.

**Version 0.1.1**
- Initial release
