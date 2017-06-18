var app = angular.module('customerModule', ['serviceModule'])

app.controller('customerCtrl', ['$scope', 'customerService', function ($scope, customerService) {


	$scope.search = function () {
		console.log('search function reached...')

		$scope.searchedResults = []
		customerService.findRestaurants($scope.searchName).then(function (success) {
			$scope.searchedResults = success.data
		})

		$scope.reviewRestaurant = ''
		$scope.restaurantId = ''
		$scope.reviews = []

		$scope.bookings = []

		$scope.getReview = function (result) {
			console.log(result)
			$scope.restaurantId = result._id
			$scope.reviews = result.reviews
			$scope.bookings = result.bookings

			console.log('Reviews present', $scope.reviews)
			$scope.reviewRestaurant = result.name
		}

		// submit reviews to save it in db
		$scope.submitReview = function () {
			var data = {
				"name": ($scope.reviewerName !== '') ? $scope.reviewerName : 'Anonymous  ',
				"reviews": ' said: ' + $scope.review
			}
			$scope.reviews.push(data)

			console.log('review is: ', $scope.reviews)
			customerService.sendReview($scope.restaurantId, $scope.reviews)
		}

		$scope.bookTable = function () {
			$scope.bookings.push({ "name": $scope.tableName, "date": new Date() })
			console.log($scope.bookings)
		}

		$scope.cancelBooking = function (index) {
			$scope.bookings.splice(index, 1)
		}
	}
}])


