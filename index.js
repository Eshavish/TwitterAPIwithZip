module.exports = require('./node_modules/twitter-js-client/lib/Twitter');

var fs = require('fs');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var error = function (err, response, body) {
	console.log('ERROR [%s]', JSON.stringify(err));
};
var success = function (data) {
	console.log('Data [%s]', data);
};

var config = {
	"consumerKey": "0R4GuYAgbwLNsp9dr53WBjZZd",
	"consumerSecret": "Jhvssqkgi71iKaIQds27GNR9Vo8psQDi3c3m8YAhqnk2hKWfLo",
	"accessToken": "708675904633835520-tXPDGxIr4RlLxjJ0f8kZw7WC282fvSP",
	"accessTokenSecret": "QQRxk3wKipwpfjfEBquV9tQ0CW9RU7o11UhM1BbtDfumK"
};

//Twitter client object is created based on your configurations.
var twitter = new module.exports.Twitter(config);

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
}));

/*
 * To connect to a front end app (i.e. AngularJS) store all your files you will *
 * statically store in declared below (i.e. ./public) *
 */

app.use(express.static('public'));

//Get search tweets
app.post('/twitter/searchTweets', function (req, res) {
	var zip = req.body.zip;
	var searchQuery = req.body.query;
	console.log("calling twitter api with query", searchQuery);
	console.log("calling twitter api with zip", zip);

	//Twitter API is called.
	var data = twitter.getSearch({'q': searchQuery ,'count': 10, 'geocode': zip}, function(error, response, body){
		res.status(404).send({
			"error" : "Tweets Not Found"
		});
	}, function(data){
		res.send({
			result : {
				"searchTweetsData" : data
			}
		});
	});
});


//Save searched tweets
app.post('/twitter/saveTweets', function (req, res) {
	var tweets = req.body.results.extractedTweets;
	var d = new Date();
	var fileName = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " " +
		d.getHours() + d.getMinutes() + d.getSeconds() + ".txt";
	fs.writeFile("/cygwin64/home/savedtweets/" + fileName, tweets, function(err) {
		if(err) {
			res.send({
				result : {
					"success" : false
				}
			});
		}
		else {
			res.send({
				result : {
					"success" : true
				}
			});
		}
	});
});

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;
});