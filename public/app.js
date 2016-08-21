var app = angular.module('myApp', []);

// This is your controller. In MVC. The C in MVC.
app.controller('myCtrl', function($scope, TwitterService){
	$scope.getSearchTweets = function(zip,query){
		console.log("Query entered ", query);
		console.log("zip code entered", zip);
		zip = "37.781157,-122.398720,1mi";
		query = "#wow"

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
	}
});

app.factory('TwitterService', function($http, $q){

	var getSearchTweets = function(zip,query){
		console.log("Query: ", query);
		console.log("Zip: ", zip);

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
		getSearchTweets : getSearchTweets
	};
});
