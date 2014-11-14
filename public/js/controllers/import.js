app.controller('ImportCtrl', ['$scope', 'Airport',
    function($scope, Airport) {

        $scope.svg = {};
        $scope.attributesName = "attributes_1";
        $scope.previousAttributesName = "attributes_1";
        $scope.state = function(stateNumber) {
            $scope.previousAttributesName = $scope.attributesName;
            $scope.attributesName = "attributes_" + stateNumber;
            $scope.applyNewAttributes($scope.svg[0]);
            console.log("done");
        };


        $scope.applyNewAttributes = function(a) {
            // el.element.attributes={}
            var el = a;
            d3.select(el.element).attr(el.element[$scope.attributesName]);
            for (var i = 0; i < el.children.length; i++) {
                $scope.applyNewAttributes(el.children[i]);
            };
        };


        $scope.animateState = function(a,state1,state2) {
            var el = a;
            // console.log(el.element[$scope.previousAttributesName],el.element["attributes_" + stateNumber]);
            d3.select(el.element).attr(el.element["attributes_" + state1]).transition().attr(el.element["attributes_" + state2]);
            for (var i = 0; i < el.children.length; i++) {
                $scope.animateState(el.children[i],state1,state2);
            };
        };

        //todo reload the value in the form



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