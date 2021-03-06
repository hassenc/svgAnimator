app.controller('ImportCtrl', ['$scope', 'Airport',
    function($scope, Airport) {

        $scope.svg = {};
        $scope.stateList = [];
        $scope.statesObject = [];

        $scope.stateIcons;
        $scope.stateAxisScale;

        $scope.attributesName = "attributes_1";
        $scope.previousAttributesName = "attributes_1";
        $scope.stateTimes = [];

        //state change
        //runs apply attributes
        $scope.state = function(stateName) {
            $scope.previousAttributesName = $scope.attributesName;
            $scope.attributesName = stateName;
            // console.log($scope.attributesName,stateName)
            $scope.applyNewAttributes($scope.svg[0]);
            // console.log("changed state to", stateName);
        };


        $scope.deleteState = function(stateName) {
            $scope.statesObject[stateName].remove;
            $scope.nbrStates = Object.keys($scope.statesObject).length;
        };


        //create a new State
        //initialise the attributes_n to .attributes
        $scope.createState = function() {
            $scope.stateTimes.push(1000 * $scope.stateList.length);
            $scope.stateList.push("attributes_" + ($scope.stateList.length + 1));
            var parent = $scope.svg[0];
            var newStateNumber = $scope.stateList.length;
            // console.log("add","attributes_" + newStateNumber);
            $scope.statesObject.push({
                "name": "attributes_" + newStateNumber,
                "time": 10000
            });

            $scope.nbrStates = $scope.statesObject.length;


            function _createState(a, stateNumber) {
                //WARNING CAN DELETE ATTRIBUTES ?
                a.element["attributes_" + stateNumber] = {};
                for (var i = 0; i < a.element.attributes.length; i++) {
                    if (a.element.attributes[i].prefix === null) {
                        a.element["attributes_" + stateNumber][a.element.attributes[i].name] = a.element.attributes[i].value;
                    }
                };
                for (var i = 0; i < a.children.length; i++) {
                    _createState(a.children[i], stateNumber);
                };
            }

            _createState(parent, newStateNumber);
        };

        //  //create a new State Icon
        // $scope.addStateIcon = function() {
        //     $scope.stateIcons.append("circle")
        //         .attr("cx",$scope.stateAxisScale(10000))
        //         .attr("cy",10)
        //         .attr("r",3);
        // };


        //apply new attributes with d3
        $scope.applyNewAttributes = function(a) {
            // el.element.attributes={}
            var el = a;
            d3.select(el.element).attr(el.element[$scope.attributesName]);
            for (var i = 0; i < el.children.length; i++) {
                $scope.applyNewAttributes(el.children[i]);
            };
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
            // console.log(savedStates);
            var nbrStates = Object.keys(JSON.parse(savedStates)).length - 1;
            var stateTimes = $scope.stateTimes;

            // if (!document.getElementById("export")) {
            document.getElementById("export").insertAdjacentHTML('beforeend', $scope.svg[0].element.outerHTML);
            // }

            var svgImage = document.getElementById("export").children[0];
            var svgObject = d3.select(svgImage);
            var newSvg = [$scope.createTree(svgObject[0][0])];
            $scope.loadFromObject(newSvg[0], savedStates);



            var statesObject = $scope.statesObject;
            var sortedStatesObject = $scope.statesObject.sort(function(a, b) {
                    return a.time - b.time;
                });
            // console.log(statesObject,sortedStatesObject)



            function getStateTime(name) {
                for (var i = 0; i < statesObject.length; i++) {
                    if (statesObject[i].name === name) {
                        return statesObject[i].time
                    }
                }
                return false;
            };

            for (var i = 0; i < sortedStatesObject.length - 1; i++) {
                setTimeout(function(j) {
                    return function() {
                        $scope.animateState(newSvg[0], j + 1, j + 2, getStateTime(sortedStatesObject[j + 1].name) - getStateTime(sortedStatesObject[j].name));
                    }
                }(i), getStateTime(sortedStatesObject[i].name));
            }
        };




        $scope.animateState = function(a, state1, state2, duration) {
            var el = a;
            // console.log(state1, state2, duration);
            // console.log(el.element[$scope.previousAttributesName],el.element["attributes_" + stateNumber]);
            d3.select(el.element).attr(el.element["attributes_" + state1]).transition().duration(duration).attr(el.element["attributes_" + state2]);
            for (var i = 0; i < el.children.length; i++) {
                $scope.animateState(el.children[i], state1, state2, duration);
            };
        };




        $scope.saveStates = function() {
            var parent = $scope.svg[0];

            function _saveStates(a) {
                var obj = {};
                for (var i = 0; i < $scope.stateList.length; i++) {
                    obj[$scope.stateList[i]] = JSON.stringify(a.element[$scope.stateList[i]]);
                };
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
            $scope.stateList = Object.keys(JSON.parse(savedStates));
            $scope.stateList = $scope.stateList.slice(0, -1);
            // console.log(savedObject);
            var parent = parent;
            var nbStates = Object.keys(savedObject).length - 1;

            function _loadStates(a, save) {
                for (var i = 0; i < nbStates; i++) {
                    a.element["attributes_" + (i + 1)] = JSON.parse(save["attributes_" + (i + 1)]);
                };
                for (var i = 0; i < a.children.length; i++) {
                    _loadStates(a.children[i], save.children[i]);
                };
            };
            _loadStates(parent, savedObject);
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
