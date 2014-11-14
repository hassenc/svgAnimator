app.controller('ImportCtrl', ['$scope', 'Airport',
    function($scope, Airport) {

        $scope.svg = {};
        $scope.attributesName = "attributes_1";
        $scope.state = function(stateNumber) {
            $scope.attributesName = "attributes_" + stateNumber;
            $scope.applyNewAttributes($scope.svg[0]);
            console.log("done")
        };


        $scope.applyNewAttributes = function(a) {
            var el = a;
            d3.select(el.element).attr(el.element[$scope.attributesName]);
            for (var i = 0; i < el.children.length; i++) {
                $scope.applyAttributes(el.children[i]);
            };
        };


        $scope.applyChange = function() {
            scope.$watch('svg', function(newValue, oldValue) {
              console.log(newValue, oldValue);
            });
        };


        // $scope.attributesOfObject= function(a) {
        //     obj = {};
        //     console.log(a[$scope.attributesName]);
        //     for (var i = 0; i < a[$scope.attributesName].length; i++) {
        //         obj[a[$scope.attributesName][i].name] = a[$scope.attributesName][i].value;
        //     };
        //     console.log(obj)
        //     return obj;
        // };

    }
]);


//todo ajouter un attribut sur un etat, le rajouter sur les autres, parce que de toute facon c'est rajoute sur attributs