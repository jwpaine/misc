var request = require('request').defaults({
  followRedirect: true,
  followAllRedirects: true
});

var S = require('string');
var prompt = require('prompt');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

var cookieJar = request.jar()
var authentication = 'https://identity.maine.edu/cas/login'
var REST = "https://rt.maine.edu/REST/1.0/"

function login(user, passwd, cb) {
	/* get form authorization token and use as value in form data submitted */
	
	request.get({url : authentication, jar: cookieJar}, function (error, response, body) {
			
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
  			url: authentication,
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
				/* return true if HTML body contains "Success" */
			
					cb(body.indexOf("Success") !== -1);
				
			})
	});
};

function ticketInfo(id, callback) {

	request.get({
		url : REST + "ticket/" + id + "/show", 
		jar: cookieJar
	}, function (error, response, body) {
			
		if (error) {
			console.log('error:', error); // Print the error if one occurred
			cb(error);
		}
		console.log(body)
	

	});
};

function getNew(queue, cb) {

	request.get({
		url : REST + "search/ticket?query=(Status='open' OR Status='new') AND (Queue='UM - Campus Services') AND Owner='Nobody'&orderby=+Created&format=l&fields=Subject,Status,Created",
		jar: cookieJar
	}, function (error, response, body) {
			
		if (error) {
			console.log('error:', error); // Print the error if one occurred
			cb(error);
		}
		
		console.log(body)
	});

}

function createTicket(queue, email, subject, text, callback) {
	console.log("post:"+ REST + "ticket/new/")
	var postData = {

    	'content': 	"Queue: Techsupport\nRequestor: john.paine@maine.edu\nSubject: test\nOwner: john.paine\nAdminCc: \nText: This is a test\n"
    		/*			
			'id': 'ticket/new',
            'Owner': 'Nobody',
            'Requestors': email,
            'Subject': subject,
            'Text': text,
            'Queue': queue
            */


		
  			
	}
	request.post({
			
  			url: REST + "ticket/new",
  			jar: cookieJar,
  			form: postData,
  			json: true 
			},  function (err, httpResponse, body) { 
				// return true if HTML body contains "Success"
				console.log(body)
			})

}


prompt.start();
prompt.get(['username', 'password'], function (err, result) {

    login(result.username, result.password, function(cb) {

	if (!cb) {
		console.log("Invalid username or password");
		return;
	}

	console.log("Successful login");
	
	});
  });




