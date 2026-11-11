'use strict';

const mailer = require('./lib/mailer');

module.exports = {

	// Uses the settings from the form instead of the stored settings, so they can be tested before saving
	async testmail({homey, body}) {

		const settings = {
			use_credentials: body.use_credentials !== false,
			mail_user: body.mail_user,
			mail_password: body.mail_password,
			mail_host: body.mail_host,
			mail_port: body.mail_port,
			mail_from: body.mail_from,
			sendername: body.sendername,
			mail_secure: body.mail_secure === true,
			allow_invalid_certificates: body.allow_invalid_certificates !== false
		};

		let result;

		try {
			result = await mailer.send_mail(settings, {
				to: settings.mail_from,
				subject: 'Testmail',
				text: 'This is a testmail from your Homey.',
				html: '<p>This is a <b>testmail</b> from your Homey.</p>'
			});
		} catch (err) {
			homey.app.error('Testmail failed: ' + (err.message || err));
			throw err;
		}

		homey.app.log('Testmail sent: ' + result.response);

		return {response: result.response};
	},

	// The last log lines of the app, oldest first
	async logs({homey}) {
		return homey.app.get_log_lines();
	}

};
