var request = require('request'),
    username = "username",
    password = "password",
    url = "https://nm-web.maine.edu/nm/nm.cgi",
    auth = "Basic " + new Buffer(username + ":" + password).toString("base64");

var cookieJar = request.jar();

request({ url : url, headers : { "Authorization" : auth }, jar: cookieJar }, function (error, response, body) {
        // Do more stuff with 'body' here
        console.log(cookieJar);
        request.get({
                url : "https://nm-web.maine.edu/nm/nm.cgi/hosts/new", 
                jar : cookieJar
            }, function (error, response, body) {
            
           console.log(body);
        }); 
    }
);