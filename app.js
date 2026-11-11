'use strict';

const Homey = require('homey');
const mailer = require('./lib/mailer');

// Number of log lines kept in memory for the settings page
const LOG_SIZE = 25;

class App extends Homey.App {

	log_lines = [];

	async onInit() {

		this.register_action('sendmail', async (args) => {
			await this.send(args.mailto, args.subject, {
				text: args.body,
				html: mailer.text_to_html(args.body)
			});
		});

		this.register_action('sendascii', async (args) => {
			await this.send(args.mailto, args.subject, {
				text: args.body
			});
		});

		this.register_action('sendhtml', async (args) => {
			await this.send(args.mailto, args.subject, {
				text: mailer.html_to_text(args.body),
				html: args.body
			});
		});

		this.register_action('sendimage', async (args) => {
			if (!args.droptoken) throw new Error('No image was given');

			await this.send(args.mailto, args.subject, await mailer.image_mail_options(args.droptoken, args.body, args.image_mode));
		});

		this.log('Email sender has been initialized');
	}

	// Logs a failing card before the error goes back to the flow, so it also shows up on the settings page
	register_action(id, listener) {
		this.homey.flow.getActionCard(id)
			.registerRunListener(async (args) => {
				try {
					return await listener(args);
				} catch (err) {
					this.error('Card "' + id + '" to ' + args.mailto + ' failed: ' + (err.message || err));
					throw err;
				}
			});
	}

	async send(mailto, subject, content) {
		const result = await mailer.send_mail(mailer.get_settings(this.homey), {
			to: mailto,
			subject: subject,
			...content
		});

		this.log('Mail sent to ' + mailto + ': ' + result.response);
	}

	log(...args) {
		this.add_log_line('info', args);
		super.log(...args);
	}

	error(...args) {
		this.add_log_line('error', args);
		super.error(...args);
	}

	add_log_line(level, args) {
		const message = args.map(arg => {
			if (arg instanceof Error) return arg.message;
			if (typeof arg === 'object' && arg !== null) {
				try {
					return JSON.stringify(arg);
				} catch (err) {
					return String(arg);
				}
			}
			return String(arg);
		}).join(' ');

		this.log_lines.push({time: Date.now(), level: level, message: message});

		if (this.log_lines.length > LOG_SIZE) this.log_lines.splice(0, this.log_lines.length - LOG_SIZE);
	}

	get_log_lines() {
		return this.log_lines.slice();
	}

}

module.exports = App;
