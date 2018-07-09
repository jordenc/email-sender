const Homey 	=	require('homey');

module.exports = [
    {
        description:		'Test email',
        method: 		'PUT',
        path:			'/testmail/',
        fn: function(args, callback){
	        
           var nodemailer = require('nodemailer');
			
			console.log('POST = ' + JSON.stringify(args));
			
			var use_credentials = args.body.use_credentials;
			if (typeof use_credentials == undefined) use_credentials = true;
			
			console.log ('use_credentials=' + use_credentials);

			if (use_credentials) {
				var transporter = nodemailer.createTransport(
				{
					host: args.body.mail_host,
					port: args.body.mail_port,
					secure: args.body.mail_secure,
					auth: {
						user: args.body.mail_user,
						pass: args.body.mail_password
					},
					tls: {rejectUnauthorized: false} 
				});
			} else {
				// Don't use authentication. Not supported by all providers
				var transporter = nodemailer.createTransport(
				{
					host: args.body.mail_host,
					port: args.body.mail_port,
					secure: args.body.mail_secure,
					tls: {rejectUnauthorized: false} 
				});
			}
		    
		    var mailOptions = {
				
				from: 'Homey <' + args.body.mail_from + '>',
			    to: args.body.mail_from,
			    subject: 'Testmail',
			    text: 'This is a testmail',
			    html: 'This is a testmail'
			}
		    
		    transporter.sendMail(mailOptions, function(error, info){
			    if(error){
				    callback (error, false);
			        return console.log(error);
			    }
			    console.log('Message sent: ' + info.response);
			    callback ('Message sent: ' + info.response, true);
			});
			
        }
    },
    /* Required GET input: mailto (e-mail address), subject, body (message) */
    {
	    
	    description:		'API Send Email',
        method: 		'GET',
        path:			'/sendmail/',
        fn: function(args, callback){
	        
	        var nodemailer = require('nodemailer');
			
			mail_user = Homey.ManagerSettings.get('mail_user');
			mail_pass = Homey.ManagerSettings.get('mail_password');
			mail_host = Homey.ManagerSettings.get('mail_host');
			mail_port = Homey.ManagerSettings.get('mail_port');
			mail_from = Homey.ManagerSettings.get('mail_from');
			mail_secure = Homey.ManagerSettings.get('mail_secure');
		
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
				    to: args.query.mailto,
				    subject: args.query.subject,
				    text: args.query.body,
					  html: args.query.body
			    }
	
			    transporter.sendMail(mailOptions, function(error, info){
				    if(error){
					    return this.error(error);
				    }
				    console.log('Message sent: ' + info.response);
				    return Promise.resolve (true);
				    
				});
	
			} else {
	
				this.log('Not all required variables for mailing have been set');
	
				callback ('Not all required variables for mailing have been set', false);
	
			}
	    
	    }
	    
    }
]