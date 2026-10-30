'use strict';

const Homey = require('homey');
const mailer = require('./lib/mailer');

class App extends Homey.App {

	async onInit() {

		this.homey.flow.getActionCard('sendmail')
			.registerRunListener(async (args) => {
				await this.send(args.mailto, args.subject, {
					text: args.body,
					html: mailer.text_to_html(args.body)
				});
			});

		this.homey.flow.getActionCard('sendascii')
			.registerRunListener(async (args) => {
				await this.send(args.mailto, args.subject, {
					text: args.body
				});
			});

		this.homey.flow.getActionCard('sendhtml')
			.registerRunListener(async (args) => {
				await this.send(args.mailto, args.subject, {
					text: mailer.html_to_text(args.body),
					html: args.body
				});
			});

		this.homey.flow.getActionCard('sendimage')
			.registerRunListener(async (args) => {
				if (!args.droptoken) throw new Error('No image was given');

				await this.send(args.mailto, args.subject, await mailer.image_mail_options(args.droptoken, args.body));
			});

		this.log('Email sender has been initialized');
	}

	async send(mailto, subject, content) {
		const result = await mailer.send_mail(mailer.get_settings(this.homey), {
			to: mailto,
			subject: subject,
			...content
		});

		this.log('Mail sent to ' + mailto + ': ' + result.response);
	}

}

module.exports = App;
