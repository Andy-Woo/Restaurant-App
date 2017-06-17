
var app = angular.module('app', [])

app.controller('appCtrl', ['$scope', '$http', 'storeData', function ($scope, $http, storeData) {

	$scope.searched = []
	$scope.showSearch = false
	$scope.showLoginBox = true
	// user info and token
	$scope.username = ''
	$scope.userId = ''
	$scope.token = ''

	$scope.validate = function () {
		console.log($scope.username)
		$scope.showSearch = true
		
		$http({
			method: 'GET',
			url: '/find/' + $scope.username
		}).success(function (data, status, headers, config) {

			// get the values of userId, username and token
			var userId = data['userId']
			$scope.user = data['username']
			var token = headers('token')

			$scope.getSearchedData(userId, token)

		}).error(function (err) {
			console.log('unable to get the data')
		})
	}

	$scope.getSearchedData = function (userId, token) {
		$http({
			method: 'GET',
			url: '/findall/' + userId,
			headers: { "Authorization": 'Bearer ' + token }
		}).then(function (success) {
			for (var i = 0; i < success.data.length; i++) {

				$scope.searched[i] = success.data[i]
			}
		})
	}

	$scope.locationSearch = function () {
		$scope.validate()
		google.maps.event.addDomListener(window, 'load', function () {

			// get data from Google Api
			$scope.places = new google.maps.places.Autocomplete(document.getElementById('searchPlaces'));
			google.maps.event.addListener($scope.places, 'place_changed', function () {

				// set the corresponding field 
				$scope.place = $scope.places.getPlace();
				$scope.address = $scope.place.formatted_address;
				$scope.latitude = $scope.place.geometry.location.lat();
				$scope.longitude = $scope.place.geometry.location.lng();
				$scope.place = { "userId": $scope.username, "place": $scope.address, "latitude": $scope.latitude, "longitude": $scope.longitude }

				// call the service				
				storeData.putData($scope.place)
					.then(function (success) {
						$scope.validate()
					})

			})
		})
	}
}])

app.service('storeData', ['$http', function ($http) {
	this.putData = function (place) {
		return $http({
			method: 'POST',
			url: '/store',
			data: place
		})
	}
}])