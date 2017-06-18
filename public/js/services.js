var app = angular.module('serviceModule', [])

app.service('restaurantService', ['$http', function ($http) {
	var baseUrl = 'http://localhost:3000'



	this.listRestaurants = function (id) {
		return $http({
			method: 'GET',
			url: (id) ? baseUrl + '/restaurants/' + id : baseUrl + '/restaurants'
		})
	}

	this.addRestaurant = function (data) {
		return $http({
			method: 'POST',
			url: baseUrl + '/addrestaurant',
			data: data
		})
	}

	this.deleteRestaurant = function (id) {
		return $http({
			method: 'DELETE',
			url: baseUrl + '/deleterestaurant/' + id
		})
	}

	this.updateRestaurant = function (id, data) {
		return $http({
			method: 'PUT',
			url: baseUrl + '/updaterestaurant/' + id,
			data: data
		})
	}
}])

app.service('customerService', ['$http', function ($http) {
	var baseUrl = 'http://localhost:3000'


	this.findRestaurants = function (value) {
		return $http({
			method: 'GET',
			url: baseUrl + '/search/' + value

		})
	}
	this.sendReview = function (id, data) {
		return $http({
			method: 'PUT',
			url: baseUrl + '/review/' + id,
			data: data
		})
	}

}])