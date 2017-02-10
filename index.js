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
//retweets
app.post('/twitter/getretweets', function (req, res) {
	var id = req.body.id;

	//Twitter API is called.
	var data = twitter.getretweets({'id': id, 'count' :10}, function(error, response, body){
		res.status(404).send({
			"error" : "Retweets Not Found"
		});
	}, function(data){
		res.send({
			result : {

				"userData" : data
			}
		});
	});
});
app.post('/twitter/getblocks', function (req, res) {
	var username = req.body.username;

	//Twitter API is called.
	var data = twitter.getblocks({'username': username,'include_entities': false}, function(error, response, body){
		console.log(response);
		res.status(404).send({
			"error" : "blocks Not Found"
		});
	}, function(data){
		console.log(data);
		res.send({
			result : {
				"userData" : data
			}
		});
	});
});
//ends here
app.post('/twitter/saveTweets', function (req, res) {
	//console.log(tweets);
	 var tweets = JSON.stringify(req.body.results.userData);
	//console.log(tweets['userData']);
	var t = JSON.parse(tweets);
	var ob= JSON.parse(t.result.userData);
	var mo = JSON.stringify(ob);
	var test =JSON.parse(mo);
	var n =3;
	//var tweetsFormatted= new Array(n);
	//var tFormatted = new Array(3);
	var obj = {};
	var arr = [];
	for(i=0;i<=9;i++) {

		obj['id']=test.users[i].id;
		//console.log(obj['id']);
		obj['followers_count']=test.users[i].followers_count;
		obj['friends_count']=test.users[i].friends_count;
		arr.push(obj);
		obj = {};
	}
		//console.log(obj.id[1]);
	console.log(arr);
	var tweetsForm = JSON.stringify(arr);
	var d = new Date();
	var fileName = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear()
		+ " " + d.getHours() + " " + d.getMinutes() + "'" + d.getSeconds() + "''" +  ".txt";
	fs.writeFile("/cygwin64/home/tweets/" + fileName, tweetsForm, function(err) {
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
