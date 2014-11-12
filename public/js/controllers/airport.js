function AirportCtrl ($scope, $routeParams, Airport) {
	$scope.currentAirport = Airport.get({
		airportCode: $routeParams.airportCode
	});
}