"use strict";
var nodemailer = require('nodemailer');

var mail_user, mail_pass, mail_host, mail_port, mail_from, mail_secure, use_credentials;

function init() {
	
	//mail settings (if any)
	use_credentials = Homey.manager('settings').get('use_credentials');
	
	//backwards compatibility
	if (typeof use_credentials == undefined || typeof use_credentials == 'undefined') {
		use_credentials = true;
		Homey.manager('settings').set( 'use_credentials', true);
	}
	
	mail_user = Homey.manager('settings').get('mail_user');
	mail_pass = Homey.manager('settings').get('mail_password');
	mail_host = Homey.manager('settings').get('mail_host');
	mail_port = Homey.manager('settings').get('mail_port');
	mail_from = Homey.manager('settings').get('mail_from');
	mail_secure = Homey.manager('settings').get('mail_secure');

	Homey.log('Backend settings updated');

}

//module.exports.testmail = testmail;
module.exports.init = init;

Homey.manager('settings').on('set', function (name) {

	Homey.log('variable ' + name + ' has been set');
	init();
	
});

// flow action handlers
Homey.manager('flow').on('action.sendmail', function (callback, args) {
	
	if ( typeof mail_user !== 'undefined' && typeof mail_pass !== 'undefined' && typeof mail_host !== 'undefined' && typeof mail_port !== 'undefined' && typeof mail_from !== 'undefined') {
	
			if (typeof use_credentials == undefined) use_credentials = true;

			if (use_credentials) {
				var transporter = nodemailer.createTransport(
				{
					host: mail_host,
					port: mail_port,
					secure: mail_secure,
					auth: {
						user: mail_user,
						pass: mail_pass
					},
					tls: {rejectUnauthorized: false} 
				});
			} else {
				// Don't use authentication. Not supported by all providers
				var transporter = nodemailer.createTransport(
				{
					host: mail_host,
					port: mail_port,
					secure: mail_secure,
					tls: {rejectUnauthorized: false} 
				});
			}
		    
		    var mailOptions = {
				
				from: 'Homey <' + mail_from + '>',
			    to: args.mailto,
			    subject: args.subject,
			    text: args.body,
				html: args.body
		    }
		    
		    transporter.sendMail(mailOptions, function(error, info){
			    if(error){
				    callback (error, false);
			        return Homey.log(error);
			    }
			    Homey.log('Message sent: ' + info.response);
			    callback (null, true);
			});
			
		} else {
			
			Homey.log('Not all required variables for mailing have been set');
		    
			callback ('Not all required variables for mailing have been set', false);
			
		}
	
});

Homey.manager('flow').on('action.sendimage', function (callback, args) {
	
	if ( typeof mail_user !== 'undefined' && typeof mail_pass !== 'undefined' && typeof mail_host !== 'undefined' && typeof mail_port !== 'undefined' && typeof mail_from !== 'undefined') {
	
			if (typeof use_credentials == undefined) use_credentials = true;

			if (use_credentials) {
				var transporter = nodemailer.createTransport(
				{
					host: mail_host,
					port: mail_port,
					secure: mail_secure,
					auth: {
						user: mail_user,
						pass: mail_pass
					},
					tls: {rejectUnauthorized: false} 
				});
			} else {
				// Don't use authentication. Not supported by all providers
				var transporter = nodemailer.createTransport(
				{
					host: mail_host,
					port: mail_port,
					secure: mail_secure,
					tls: {rejectUnauthorized: false} 
				});
			}
			
			//var body = '';
			//body.append('photo', new Buffer(args.body, 'base64'),{contentType: 'image/jpeg', filename: 'x.jpg'})
			
		    
		    var mailOptions = {
				
				from: 'Homey <' + mail_from + '>',
			    to: args.mailto,
			    subject: args.subject,
			    //text: body,
				//html: body
				attachments:[{
				 filename: "x.jpg",
				 content: args.body,
				 encoding: 'base64'
				}]
		    }
		    
		    transporter.sendMail(mailOptions, function(error, info){
			    if(error){
				    callback (error, false);
			        return Homey.log(error);
			    }
			    Homey.log('Message sent: ' + info.response);
			    callback (null, true);
			});
			
		} else {
			
			Homey.log('Not all required variables for mailing have been set');
		    
			callback ('Not all required variables for mailing have been set', false);
			
		}
	
});