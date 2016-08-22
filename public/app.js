var app = angular.module('myApp', []);

// This is your controller. In MVC. The C in MVC.
app.controller('myCtrl', function($scope, TwitterService){
	//$scope is the Modal in MVC.
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
					$scope.results = { extractedTweets: tweets, searchTweetsData: searchTweetsDataJSON }
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
					$scope.results = { searchResultsLocally : data.result.searchLocallyTweets }
				}
			})
			.catch(function(error){
				console.error('there was an error retrieving data: ', error);
			})
	}
});

app.factory('TwitterService', function($http, $q){

	var saveTweets = function(results){
		var d = $q.defer();
		$http.post('/twitter/saveTweets', { results: results })
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
		$http.post('/twitter/searchTweets',{zip : zip, query : query})
			.success(function(data){
				return d.resolve(data);
			})
			.error(function(error){
				return d.reject(error);
			});
		return d.promise;
	};

	return {
		getSearchTweets : getSearchTweets , saveTweets : saveTweets , searchLocallyTweets : searchLocallyTweets
	};
});
