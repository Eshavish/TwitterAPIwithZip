var app = angular.module('myApp', []);
//var mymap = L.map('mapid').setView([51.505, -0.09], 13);
app.controller('myCtrl', function($scope, TwitterService){
	/*$scope.getSearchTweets = function(zip,username){
		TwitterService.getSearchTweets(zip,username)
			.then(function(data){
				if(data.error){
					var errorData = JSON.parse(data.error.data);
					$scope.twitterErrors = errorData.errors[0].message;
				} else if (data.result){
					$scope.twitterErrors = undefined;
					var searchTweetsDataJSON = JSON.parse(data.result.searchTweetsData);
					var tweets = []; //Declare an empty array
					//statuses is an array. Running a for loop here.
					searchTweetsDataJSON.statuses.forEach(function(status) {
						tweets.push(status.text);
					});
					$scope.results = { extractedTweets: tweets }
				}
			})
			.catch(function(error){
				console.error('there was an error retrieving data: ', error);
			})
	};*/


	$scope.getretweets = function(id){
		console.log("username entered ", id);
		TwitterService.getretweets(id)
			.then(function(data){

				if(data.error){
					var errorData = JSON.parse(data.error.data);
					$scope.twitterErrors = errorData.errors[0].message;
				} else if (data.result){
					$scope.twitterErrors = undefined;
					console.log('yay');
					$scope.results = {userData : data};
				}
			})
			.catch(function(error){
				console.error('there was an error retrieving data: ', error);
			})
	};
	$scope.getblocks = function(username){
		console.log("username entered ", username);
		TwitterService.getblocks(username)
			.then(function(data){
				console.log(data);
				if(data.error){
					var errorData = JSON.parse(data.error.data);
					$scope.twitterErrors = errorData.errors[0].message;
				} else if (data.result){
					$scope.twitterErrors = undefined;
					console.log('yay');
					$scope.results = JSON.parse(data.result.userData);
				}
			})
			.catch(function(error){
				console.error('there was an error retrieving data: ', error);
			})
	};




	//ends here

	//save tweets
	$scope.saveTweets = function(results){
		TwitterService.saveTweets(results)
			.then(function(data){
				if(data.error){
					var errorData = JSON.parse(data.error.data);
					$scope.twitterErrors = errorData.errors[0].message;
				} else if (data.result){
					if (data.result.success == false) {
						$scope.twitterErrors = "Unable to save tweets to flat file";
					}
					else {
						$scope.results = { status: "Successfully saved!" };
					}
				}
			})
			.catch(function(error){
				console.error('there was an error retrieving data: ', error);
			})
	};
});
/*L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	maxZoom: 18,
	id: 'your.mapbox.project.id',
	accessToken: 'your.mapbox.public.access.token'
}).addTo(mymap);
*/
app.factory('TwitterService', function($http, $q){


//starts here
	/*var getSearchTweets = function(zip,username){
		var d = $q.defer();
		var result1;
		console.log(zip);
		// var latlong=geocode of zip
		function geoCode(zip) {

			// var UserInput = document.getElementById('UserInput').valueOf();
			var xmlhttp = new XMLHttpRequest();
			var ApiKey = 'AIzaSyAWsQWSA9PUkA61qjcE4YEsfV-bXCMchf0';
			var myArr;

			var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + zip + '&key=' + ApiKey;

			var xhr = new XMLHttpRequest();
			xhr.open('GET', url, true);
			xhr.send();

			xhr.onreadystatechange = processRequest;

			function processRequest() {
				if (xhr.readyState == 4 && xhr.status == 200) {
					var response = JSON.parse(xhr.responseText);
					var miles=5;
					result1= response.results[0].geometry.location.lat + "," + response.results[0].geometry.location.lng +","+ miles +"mi";
					//console.log(username);
					$http.post('/twitter/searchTweets',{zip : result1, username : username})
						.success(function(data){
							return d.resolve(data);
						})
						.error(function(error){
							return d.reject(error);
						});
				}
			}
		}
		geoCode(zip);


		return d.promise;
	};*/
	//ends here

	/*var getUser = function(username){
		var d = $q.defer();
		$http.post('/twitter/user', {username : username})
			.success(function(data){
				return d.resolve(data);
			})
			.error(function(error){
				return d.reject(error);
			});
		return d.promise;
	};*/


	var getretweets = function(id){
		var d = $q.defer();
		$http.post('/twitter/getretweets',{id : id})
			.success(function(data){
				return d.resolve(data);
			})
			.error(function(error){
				return d.reject(error);
			});
		return d.promise;
	}

	var getblocks = function(username){
		var d = $q.defer();
		$http.post('/twitter/getblocks',{username : username})
			.success(function(data){
				return d.resolve(data);
			})
			.error(function(error){
				return d.reject(error);
			});
		return d.promise;
	}
	//ends here
	//save tweets
	var saveTweets = function(results){
		var d = $q.defer();
		$http.post('/twitter/saveTweets', { results: results})
			.success(function(data){
				return d.resolve(data);
			})
			.error(function(error){
				return d.reject(error);
			});
		return d.promise;
	};


	return {
		getretweets : getretweets, saveTweets : saveTweets , getblocks : getblocks
	};
});
