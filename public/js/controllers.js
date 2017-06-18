var app = angular.module('controllerModule', ['serviceModule', 'ngRoute'])



app.controller('restaurantCtrl', ['$scope', '$http', 'restaurantService', function ($scope, $http, restaurantService) {
	$scope.restaurants = []


	// get the list of all restaurants
	$scope.getAllRestaurants = function () {
		restaurantService.listRestaurants().then(function (res) {
			$scope.restaurants = res.data
		})
	}

	// initialize 
	$scope.getAllRestaurants()


	$scope.particular = []
	$scope.editRestaurant = function (id) {
		console.log('From Edit: ', id)
		restaurantService.listRestaurants(id).then(function (success) {
			$scope.particular = success.data
			console.log('particualar Restaurant is:\n', $scope.particular)
		})

	}

	// save one restaurant
	$scope.saveRestaurant = function (info) {

		// data for a particualar restaurant
		var data = angular.extend(info, { "tables": $scope.tables }, { "reviews": [{ "name": 'Anonymous', "reviews": "ok" }] }, {"bookings":[{"name": $scope.tables[0]['id'], "date": new Date()}]})

		console.log('data before add', data)

		restaurantService.addRestaurant(data).then(function (success) {

			// call to get the updated listing after addition
			$scope.getAllRestaurants()
		})

		// empty the fields to make ready for a new insert
		$scope.tables = []
		$scope.name = ''
		$scope.capacity = ''
		$scope.restaurantInfo = {}
	}



	// add tables to a restaurant
	$scope.tables = []
	$scope.addTable = function (mode) {
		$scope.tables.push({ "id": $scope.name || $scope.nameEdit, "capacity": $scope.capacity || $scope.capacityEdit })
		console.log($scope.tables)
	}


	// delete a restaurant
	$scope.deleteRestaurant = function (id) {
		console.log('from delete: --> ', id)
		restaurantService.deleteRestaurant(id).then(function (success) {
			$scope.getAllRestaurants()
		})
	}

	// tablesModified contains both modified/ deleted values
	$scope.tablesModified = {}

	// change capacity of tables
	$scope.changeTable = function (id) {
		var value = document.getElementById(id).value
		$scope.tablesModified[id] = { "capacity": value }

	}
	// delete a table
	$scope.deleteTable = function (id) {
		var value = document.getElementById(id).value
		$scope.tablesModified[id] = ''
	}

	// save all the modification to tables so far
	$scope.saveTable = function (restId) {
		var tablesUltimate = []

		var keys = Object.keys($scope.tablesModified)

		// for tables which are modified
		for (var i = 0; i < keys.length; i++) {

			if ($scope.tablesModified[keys[i]] !== '') {
				tablesUltimate.push({ "id": keys[i], "capacity": $scope.tablesModified[keys[i]]['capacity'] })
			}

		}

		// for tables which are added
		for (var j = 0; j < $scope.tables.length; j++) {
			tablesUltimate.push($scope.tables[j])
		}
		console.log('rest id', restId)
		console.log('tables last view: ', tablesUltimate)

		restaurantService.updateRestaurant(restId, tablesUltimate).then(function (success) {

			// call to see the updated data
			$scope.getAllRestaurants()
		})

		$scope.particular = {}
		$scope.nameEdit = ''
		$scope.capacityEdit = ''
		$scope.tables = []
	}
}])


