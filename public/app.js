var app = angular.module('myApp', []);

// This is your controller. In MVC. The C in MVC.
app.controller('myCtrl', function($scope, TwitterService){
	//$scope is the Modal in MVC.
//copied
	// copied
	$scope.getSearchTweets = function(zip,query){
		TwitterService.getSearchTweets(zip,query)
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
	};

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
	}
	$scope.searchLocalTweets = function(results){
		TwitterService.searchLocallyTweets(results)
			.then(function(data){
				if(data.error)                        {
					var errorData = JSON.parse(data.error.data);
					$scope.twitterErrors = errorData.errors[0].message;
				} else if (data.result){
					$scope.twitterErrors = undefined;
					console.log(data.result);
					$scope.results = { localSearchResults : data.result.searchLocallyTweets }
				}
			})
			.catch(function(error){
				console.error('there was an error retrieving data: ', error);
			})
	}
});

//TwitterService has all the logic to make calls to backed index.js server code.
app.factory('TwitterService', function($http, $q){



	var saveTweets = function(results){
		var d = $q.defer();
		$http.post('/twitter/saveTweets', { address: address })
			.success(function(data){
				return d.resolve(data);
			})
			.error(function(error){
				return d.reject(error);
			});
		return d.promise;
	};

	var searchLocallyTweets = function(keyword){
		var d = $q.defer();
		$http.post('/twitter/searchLocallyTweets', { keyword : keyword })
			.success(function(data){
				return d.resolve(data);
			})
			.error(function(error){
				return d.reject(error);
			});
		return d.promise;
	};

	var getSearchTweets = function(zip,query){
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
					var miles=20;
					result1= response.results[0].geometry.location.lat + "," + response.results[0].geometry.location.lng +","+ miles +"mi";
					console.log(query);
					$http.post('/twitter/searchTweets',{zip : result1, query : query})
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
	};

	return {
		getSearchTweets : getSearchTweets , saveTweets : saveTweets , searchLocallyTweets : searchLocallyTweets };
});
