var request = require('request').defaults({
  followRedirect: true,
  followAllRedirects: true
});

var S = require('string');
var prompt = require('prompt');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

var cookieJar = request.jar()

function login(user, passwd, cb) {
	/* get form authorization token and use as value in form data submitted */
	var url = 'https://identity.maine.edu/cas/login'
	request.get({url : url, jar: cookieJar}, function (error, response, body) {
			
		if (error) {
			console.log('error:', error); // Print the error if one occurred
			cb(error);
		}
			
		var phrase = S(body);
		var sub = "LT-";
		var pos = phrase.indexOf(sub);
		var token = phrase.substr(pos, 41).toString();

		console.log("Logging in: " + user + "...");

	  	request.post({
  			url: url,
  			jar: cookieJar,
  			form: {
    			username: user,
				password: passwd,
				lt: token,
				execution: "e1s1",
				_eventId: "submit",
				submit: "LOGIN"
  				}
			}, function (err, httpResponse, body) { 

				cb(body);
		})
	});
};

prompt.start();
prompt.get(['username', 'password'], function (err, result) {

    login(result.username, result.password, function(cb) {

	if (cb.indexOf("Success") == -1) {
		console.log("Invalid username or password");
		return;
	}

	console.log("Successful login");
	
	});
  });




