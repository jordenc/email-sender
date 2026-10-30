'use strict';

const nodemailer = require('nodemailer');

const IMAGE_CID = 'homey-image@email.sender';

const IMAGE_EXTENSIONS = {
	'image/jpeg': 'jpg',
	'image/jpg': 'jpg',
	'image/png': 'png',
	'image/gif': 'gif',
	'image/webp': 'webp',
	'image/bmp': 'bmp'
};

// Settings are read on every send, so changes on the settings page apply immediately.
// Unset booleans keep the behaviour of earlier versions: credentials on, self-signed certificates allowed.
function get_settings(homey) {
	return {
		use_credentials: homey.settings.get('use_credentials') !== false,
		mail_user: homey.settings.get('mail_user'),
		mail_password: homey.settings.get('mail_password'),
		mail_host: homey.settings.get('mail_host'),
		mail_port: homey.settings.get('mail_port'),
		mail_from: homey.settings.get('mail_from'),
		sendername: homey.settings.get('sendername'),
		mail_secure: homey.settings.get('mail_secure') === true,
		allow_invalid_certificates: homey.settings.get('allow_invalid_certificates') !== false
	};
}

function is_empty(value) {
	return value === null || typeof value === 'undefined' || String(value).trim() === '';
}

function check_settings(settings) {
	const required = ['mail_host', 'mail_port', 'mail_from'];

	if (settings.use_credentials) required.push('mail_user', 'mail_password');

	const missing = required.filter(key => is_empty(settings[key]));

	if (missing.length > 0) {
		throw new Error('Not all required mail settings have been set (missing: ' + missing.join(', ') + '). Open the app settings to complete them.');
	}
}

function create_transport(settings) {
	const options = {
		host: String(settings.mail_host).trim(),
		port: Number(settings.mail_port),
		secure: settings.mail_secure,
		tls: {rejectUnauthorized: !settings.allow_invalid_certificates}
	};

	if (settings.use_credentials) {
		options.auth = {
			user: settings.mail_user,
			pass: settings.mail_password
		};
	}

	return nodemailer.createTransport(options);
}

async function send_mail(settings, mail_options) {
	check_settings(settings);

	const sendername = is_empty(settings.sendername) ? 'Homey' : settings.sendername;

	const transporter = create_transport(settings);

	try {
		return await transporter.sendMail({
			from: {name: sendername, address: String(settings.mail_from).trim()},
			...mail_options
		});
	} finally {
		transporter.close();
	}
}

function escape_html(text) {
	return String(text)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

// Line breaks from a flow text field become <br>, HTML tags in the text are kept as they are
function text_to_html(text) {
	return String(text || '').replace(/\r?\n/g, '<br>\n');
}

// Plain text alternative for HTML mails, for clients that don't show HTML
function html_to_text(html) {
	return String(html || '')
		.replace(/<(script|style|head)[^>]*>[\s\S]*?<\/\1>/gi, '')
		.replace(/<a\s[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (match, href, label) => {
			const label_text = label.replace(/<[^>]+>/g, '').trim();
			return label_text && label_text !== href ? label_text + ' (' + href + ')' : href;
		})
		.replace(/<br\s*\/?>/gi, '\n')
		.replace(/<li[^>]*>/gi, '- ')
		.replace(/<\/(p|div|h[1-6]|li|tr|table|ul|ol|blockquote)>/gi, '\n')
		.replace(/<[^>]+>/g, '')
		.replace(/&nbsp;/gi, ' ')
		.replace(/&lt;/gi, '<')
		.replace(/&gt;/gi, '>')
		.replace(/&quot;/gi, '"')
		.replace(/&#39;/gi, "'")
		.replace(/&amp;/gi, '&')
		.replace(/[ \t]+\n/g, '\n')
		.replace(/\n{3,}/g, '\n\n')
		.trim();
}

// Builds the mail parts for an image token: the image is shown inline in the body and can also be saved as attachment
async function image_mail_options(image, body) {
	const stream = await image.getStream();

	const content_type = String(stream.contentType || '').toLowerCase();
	const extension = IMAGE_EXTENSIONS[content_type] || 'jpg';
	const filename = stream.filename || 'image.' + extension;

	const text = is_empty(body) ? '' : String(body);
	const html_text = text === '' ? '' : '<p>' + text_to_html(text) + '</p>\n';

	return {
		text: text,
		html: html_text + '<p><img src="cid:' + IMAGE_CID + '" alt="' + escape_html(filename) + '" style="max-width: 100%; height: auto;"></p>',
		attachments: [{
			filename: filename,
			content: stream,
			contentType: content_type || 'image/jpeg',
			cid: IMAGE_CID
		}]
	};
}

module.exports = {
	get_settings,
	send_mail,
	text_to_html,
	html_to_text,
	image_mail_options
};
