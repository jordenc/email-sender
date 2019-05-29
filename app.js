"use strict";
const Homey = require('homey');
let nodemailer = require('nodemailer');

let mail_user, mail_pass, mail_host, mail_port, mail_from, mail_secure, use_credentials;

class EmailApp extends Homey.App {
	
	onInit() {
	
		//mail settings (if any)
		use_credentials = Homey.ManagerSettings.get('use_credentials');
	
		//backwards compatibility
		if (typeof use_credentials == undefined || typeof use_credentials == 'undefined') {
			use_credentials = true;
			Homey.manager('settings').set( 'use_credentials', true);
		}
	
		mail_user = Homey.ManagerSettings.get('mail_user');
		mail_pass = Homey.ManagerSettings.get('mail_password');
		mail_host = Homey.ManagerSettings.get('mail_host');
		mail_port = Homey.ManagerSettings.get('mail_port');
		mail_from = Homey.ManagerSettings.get('mail_from');
		mail_secure = Homey.ManagerSettings.get('mail_secure');
	
		this.log('Backend settings updated');
		
		let sendMessage = new Homey.FlowCardAction('sendmail');
		sendMessage
		    .register()
		    .registerRunListener(( args, state ) => {
		
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
						    //return this.error(error);
						    console.log ("Error: " + error);
						    return Promise.resolve (false);
						    
					    }
					    console.log('Message sent: ' + info.response);
					    return Promise.resolve (true);
					    
					});
		
				} else {
		
					this.log('Not all required variables for mailing have been set');
		
					return callback ('Not all required variables for mailing have been set', false);
		
				}
				
		    })
	        
	        
	    let sendascii = new Homey.FlowCardAction('sendascii');
		sendascii
		    .register()
		    .registerRunListener(( args, state ) => {
		
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
					    text: args.body
				    }
		
				    transporter.sendMail(mailOptions, function(error, info){
					    if(error){
						    
						    console.log(error);
						    
						    return Promise.resolve (false);
					    }
					    console.log('Message sent: ' + info.response);
					    return Promise.resolve (true);
					    
					});
		
				} else {
		
					this.log('Not all required variables for mailing have been set');
		
					callback ('Not all required variables for mailing have been set', false);
		
				}
				
		    })
	        
	    let sendimage = new Homey.FlowCardAction('sendimage');
		sendimage
		    .register()
		    .registerRunListener(( args, state ) => {
		
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
					
					let image = args.droptoken;
					
					if (image.getStream) {
						
						//image.getStream()
						//.then( buf => {
							
							
							//const stream = await image.getStream();
					
							if (image.contentType == "jpg") {
								
								var filename = "x.jpg";
							
							} else if (image.contentType == "gif") {
								
								var filename = "x.gif";
								
							} else if (image.contentType == "png") {
								
								var filename = "x.png";
								
							}
							
						    var mailOptions = {
		
								from: 'Homey <' + mail_from + '>',
							    to: args.mailto,
							    subject: args.subject,
							    //text: body,
								//html: body
								attachments:[{
								 filename: image.filename,
								 content: image.contentType
								}]
						    }
				
						    transporter.sendMail(mailOptions, function(error, info){
							    if(error){
								    
								    console.log(error);
							    
									return Promise.resolve (false);
							    
							    }
							    console.log('Message sent: ' + info.response);
							    return Promise.resolve (true);
							    
							});
						
						/*
						})
						.catch ( err => {
							console.error (err);	
						});
						*/
						
					} else {
						//Pre Homey 2.2.0
					
						image.getBuffer()
						.then( buf => {
							
							if (image.getFormat() == "jpg") {
								
								var filename = "x.jpg";
							
							} else if (image.getFormat() == "gif") {
								
								var filename = "x.gif";
								
							} else if (image.getFormat() == "png") {
								
								var filename = "x.png";
								
							}
							
						    var mailOptions = {
		
								from: 'Homey <' + mail_from + '>',
							    to: args.mailto,
							    subject: args.subject,
							    //text: body,
								//html: body
								attachments:[{
								 filename: filename,
								 content: buf
								}]
						    }
				
						    transporter.sendMail(mailOptions, function(error, info){
							    if(error){
								    
								    console.log(error);
							    
									return Promise.resolve (false);
							    
							    }
							    console.log('Message sent: ' + info.response);
							    return Promise.resolve (true);
							    
							});
							
						})
						.catch ( err => {
							console.error (err);	
						});
						
					}
							
				} else {
		
					this.log('Not all required variables for mailing have been set');
		
					callback ('Not all required variables for mailing have been set', false);
		
				}
				
		    })
	        
	}

}

module.exports = EmailApp;