function FlightsCtrl ($scope, Flights) {
	$scope.setActive('flights');
	$scope.flights = Flights.query();
}