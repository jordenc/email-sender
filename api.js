module.exports = [
    {
        description:		'Test email',
        method: 		'PUT',
        path:			'/testmail/',
        fn: function( callback, args ){
            //var result = Homey.app.updateSomething( args.params.id, args.body );
            
           var nodemailer = require('nodemailer');
			
			var use_credentials = args.body.use_credentials;
			if (typeof use_credentials == undefined) use_credentials = true;

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
			        return Homey.log(error);
			    }
			    Homey.log('Message sent: ' + info.response);
			    callback ('Message sent: ' + info.response, true);
			});
			
        }
    }
]