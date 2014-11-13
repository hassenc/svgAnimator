app.controller('ImportCtrl', ['$scope', 'Airport',
    function($scope, Airport) {

        $scope.svg = {};
        $scope.attributesName = "attributes_1";
        $scope.state = function(stateNumber) {
            $scope.attributesName = "attributes_" + stateNumber;
            $scope.applyAttributes($scope.svg[0]);
            console.log("done")
        };


        $scope.applyAttributes = function(a) {
            var el = a;
            console.log(el.element[$scope.attributesName])
            d3.select(el).attr($scope.attributesOfObject(el.element));
            for (var i = 0; i < el.children.length; i++) {
                $scope.applyAttributes(el.children[i]);
            };
        };


        $scope.attributesOfObject= function(a) {
            obj = {};
            console.log(a[$scope.attributesName]);
            for (var i = 0; i < a[$scope.attributesName].length; i++) {
                obj[a[$scope.attributesName][i].name] = a[$scope.attributesName][i].value;
            };
            console.log(obj)
            return obj;
        };

    }
]);
