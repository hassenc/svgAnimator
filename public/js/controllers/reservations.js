function ReservationsCtrl ($scope, Reservations) {
	$scope.setActive('reservations');

	$scope.reservations = Reservations.query();

	$scope.reserveFlight = function  () {
		Reservations.save($scope.reserve, function (data) {
			$scope.reserve.origin = '';
			$scope.reserve.destination = '';

			$scope.reservations.push(data);
		});
	}
}