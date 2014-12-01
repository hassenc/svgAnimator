app.controller('ImportCtrl', ['$scope', 'Airport',
    function($scope, Airport) {

        $scope.svg = {};
        $scope.savedObject = {};

        $scope.elementsList = [];
        $scope.manualChange = true; //to avoid state creation on tween rendering

        $scope.stateAxisScale;



        $scope.currentTime = 0;



        $scope.initElementStates = function() {
            var newState;
            var parent = $scope.svg[0];

            function _initElementStates(a) {
                //WARNING CAN DELETE ATTRIBUTES ?

                // console.log(a)
                newState = {
                    "time": 0,
                    "attributes": {}
                };
                a.element["animatedAttributes"] = [];

                for (var i = 0; i < a.element.attributes.length; i++) {
                    if (a.element.attributes[i].prefix === null) {
                        newState["attributes"][a.element.attributes[i].name] = a.element.attributes[i].value;
                    }
                };
                a.element["animatedAttributes"].push(newState);

                $scope.elementsList.push(a);

                for (var i = 0; i < a.children.length; i++) {
                    _initElementStates(a.children[i]);
                };
            }

            _initElementStates(parent);
        };

        //  //create a new State Icon
        // $scope.addStateIcon = function() {
        //     $scope.stateIcons.append("circle")
        //         .attr("cx",$scope.stateAxisScale(10000))
        //         .attr("cy",10)
        //         .attr("r",3);
        // };

        $scope.applyTimeAttribues = function(time) {
            var parent = $scope.svg[0];
            //maybe not a very good solution wait 500ms before being able to create states again
            setTimeout(function() {$scope.manualChange = true;},500);

            function _applyTimeAttribues(a) {

                $scope.manualChange = false;
                var q = 0;
                var interpolatedObject = {};

                statesObject = a.element["animatedAttributes"];
                sortedStatesObject = statesObject.sort(function(a, b) {
                    return a.time - b.time;
                });
                a.element["animatedAttributes"] = sortedStatesObject;

                if (sortedStatesObject[sortedStatesObject.length - 1].time <= time) {
                    d3.select(a.element).attr(a.element["animatedAttributes"][sortedStatesObject.length - 1].attributes);

                } else {
                    for (var i = 0; i < sortedStatesObject.length - 1; i++) {
                        if ((sortedStatesObject[i].time <= time) && (time < sortedStatesObject[i + 1].time)) {
                            // console.log(i,time,sortedStatesObject[i + 1].time,sortedStatesObject[i].time )
                            q = (time - sortedStatesObject[i].time) / (sortedStatesObject[i + 1].time - sortedStatesObject[i].time);
                            interpolatedObject = d3.interpolateObject(a.element["animatedAttributes"][i].attributes, a.element["animatedAttributes"][i + 1].attributes)(q);
                            d3.select(a.element).attr(interpolatedObject);
                        }
                    };
                }
                for (var i = 0; i < a.children.length; i++) {
                    _applyTimeAttribues(a.children[i]);
                };
            }

            _applyTimeAttribues(parent);
        };





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

        //creates new dom svg, saves states, creates new tree, loads the attributes into new element
        $scope.export = function(a) {
            var savedStates = $scope.saveStates();

            // if (!document.getElementById("export")) {
            document.getElementById("export").insertAdjacentHTML('beforeend', $scope.svg[0].element.outerHTML);
            // }

            var svgImage = document.getElementById("export").children[0];
            var svgObject = d3.select(svgImage);
            var newSvg = [$scope.createTree(svgObject[0][0])];
            $scope.loadFromObject(newSvg[0], savedStates);

            $scope.animateGlobal(newSvg[0]);
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




        $scope.saveStates = function() {
            var parent = $scope.svg[0];

            function _saveStates(a) {
                var obj = {};
                obj["animatedAttributes"] = JSON.stringify(a.element["animatedAttributes"]);
                obj.children = [];
                for (var i = 0; i < a.children.length; i++) {
                    obj.children.push(_saveStates(a.children[i]));
                };
                return obj
            };
            $scope.savedObject = JSON.stringify(_saveStates(parent));
            return $scope.savedObject;
            // return (JSON.parse(JSON.stringify(_saveStates(parent))));
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


//todo ajouter un attribut sur un etat, le rajouter sur les autres, parce que de toute facon c'est rajoute sur attributs
