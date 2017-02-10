var app = angular.module('myApp', []);
//var mymap = L.map('mapid').setView([51.505, -0.09], 13);
app.controller('myCtrl', function($scope, TwitterService){
	$scope.getfriendships = function(username,name2){
		//console.log("username entered ", username);
		TwitterService.getfriendships(username,name2)
			.then(function(data){

				if(data.error){
					var errorData = JSON.parse(data.error.data);
					$scope.twitterErrors = errorData.errors[0].message;
				} else if (data.result){
					$scope.twitterErrors = undefined;
					$scope.results = JSON.parse(data.result.userData);
				}
			})
			.catch(function(error){
				console.error('there was an error retrieving data: ', error);
			})
	};
});
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	maxZoom: 18,
	id: 'your.mapbox.project.id',
	accessToken: 'your.mapbox.public.access.token'
}).addTo(mymap);

app.factory('TwitterService', function($http, $q){


//starts here
	var getfriendships = function(username,name2){
		var d = $q.defer();
		$http.post('/twitter/friendships', {username : username, name2 : name2})
			.success(function(data){
				return d.resolve(data);
			})
			.error(function(error){
				return d.reject(error);
			});
		return d.promise;
	}
	var getSearchTweets = function(zip,username){
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
	};
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
	}; */


	return {
		getfriendships : getfriendships
	};
});
