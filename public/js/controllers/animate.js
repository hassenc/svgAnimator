app.controller('AnimationCtrl', ['$scope', 'Airport',
    function($scope, Airport) {

        $scope.durations = [1000, 1000, 1000, 1000, 1000];



        $scope.createTree = function(a) {
            var obj = {};
            obj.element = a;
            obj.name = a.id + ":" + a.tagName;
            obj.children = [];
            // console.log(a);
            for (var i = 0; i < a.children.length; i++) {
                obj.children.push($scope.createTree(a.children[i]));
            };
            return obj
        };

        $scope.loadFromObject = function(parent, savedStates) {
            var savedObject = JSON.parse(savedStates);
            // console.log(savedStates)
            var parent = parent;
            var nbStates = Object.keys(savedObject).length - 1;

            function _loadStates(a, save) {
                // console.log(a, save)
                for (var i = 0; i < nbStates; i++) {
                    if (save) {
                        a.element["attributes_" + (i + 1)] = JSON.parse(save["attributes_" + (i + 1)]);
                    }
                };
                for (var i = 0; i < a.children.length; i++) {
                    _loadStates(a.children[i], save.children[i]);
                };
            };
            // console.log("save")
            _loadStates(parent, savedObject);
        };

        $scope.animateState = function(a, state1, state2, duration) {
            var el = a;
            // console.log(el.element[$scope.previousAttributesName],el.element["attributes_" + stateNumber]);
            d3.select(el.element).attr(el.element["attributes_" + state1]).transition().duration(duration).attr(el.element["attributes_" + state2]);
            for (var i = 0; i < el.children.length; i++) {
                $scope.animateState(el.children[i], state1, state2, duration);
            };
        };


    }
]);
