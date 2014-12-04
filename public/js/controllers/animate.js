app.controller('AnimationCtrl', ['$scope', 'Airport',
    function($scope, Airport) {

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


        $scope.animateElement = function(a, state1, state2, duration) {
            //faut ptetr trier !!!!!!
            //TODO trier d'abord
            d3.select(a.element).attr(a.element["animatedAttributes"][state1].attributes).transition().duration(duration).attr(a.element["animatedAttributes"][state2].attributes);
        };

        $scope.animateGlobal = function(parent) {
            var statesObject, sortedStatesObject

            function _animateGlobal(a) {
                statesObject = a.element["animatedAttributes"];
                sortedStatesObject = statesObject.sort(function(a, b) {
                    return a.time - b.time;
                });
                a.element["animatedAttributes"] = sortedStatesObject;
                for (var i = 0; i < sortedStatesObject.length - 1; i++) {
                    setTimeout(function(j, sortedStatesObject) {
                        return function() {
                            $scope.animateElement(a, j, (j + 1), (sortedStatesObject[j + 1].time - sortedStatesObject[j].time));
                        }
                    }(i, sortedStatesObject), sortedStatesObject[i].time);
                };

                for (var i = 0; i < a.children.length; i++) {
                    _animateGlobal(a.children[i]);
                };
            };
            _animateGlobal(parent);
        };


        $scope.loadFromObject = function(parent, savedStates) {
            var savedObject = JSON.parse(savedStates);

            var parent = parent;

            function _loadStates(a, save) {
                a.element["animatedAttributes"] = JSON.parse(save["animatedAttributes"]);
                for (var i = 0; i < a.children.length; i++) {
                    _loadStates(a.children[i], save.children[i]);
                };
            };
            _loadStates(parent, savedObject);
        };


    }
]);
