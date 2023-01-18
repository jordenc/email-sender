const Homey 	=	require('homey');

module.exports =
{
	async testmail({homey, body}) {

		let nodemailer = require('nodemailer');

		if (typeof body.use_credentials == undefined) use_credentials = true; else use_credentials = body.use_credentials;

		if (use_credentials) {
			var transporter = nodemailer.createTransport(
			{
				host: body.mail_host,
				port: body.mail_port,
				secure: body.mail_secure,
				auth: {
					user: body.mail_user,
					pass: body.mail_password
				},
				tls: {rejectUnauthorized: false}
			});
		} else {
			// Don't use authentication. Not supported by all providers
			var transporter = nodemailer.createTransport(
			{
				host: body.mail_host,
				port: body.mail_port,
				secure: body.mail_secure,
				tls: {rejectUnauthorized: false}
			});
		}

		var mailOptions = {

			from: 'Homey <' + body.mail_from + '>',
			to: body.mail_from,
			subject: 'Testmail',
			text: 'This is a testmail',
			html: 'This is a testmail'
		}

		const result = await transporter.sendMail(mailOptions);
		console.log('return terugsturen = ', result);
		return result;
	}
}
