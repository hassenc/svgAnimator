app.controller('ImportCtrl', ['$scope', 'Airport',
    function($scope, Airport) {

        $scope.svg = {};
        $scope.stateList = [];
        $scope.attributesName = "attributes_1";
        $scope.previousAttributesName = "attributes_1";

        //state change
        //runs apply attributes
        $scope.state = function(stateNumber) {
            $scope.previousAttributesName = $scope.attributesName;
            $scope.attributesName = "attributes_" + stateNumber;
            $scope.applyNewAttributes($scope.svg[0]);
            console.log("done");
        };


        //create a new State
        //initialise the attributes_n to .attributes
        $scope.createState = function() {
            $scope.stateList.push("attributes_" + ($scope.stateList.length +1));
            var parent =$scope.svg[0];
            var newStateNumber =$scope.stateList.length;
            console.log(parent,newStateNumber);

            function _createState(a,stateNumber) {
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

            _createState(parent,newStateNumber);
        };


        //apply new attributes with d3
        $scope.applyNewAttributes = function(a) {
            // el.element.attributes={}
            var el = a;
            d3.select(el.element).attr(el.element[$scope.attributesName]);
            for (var i = 0; i < el.children.length; i++) {
                $scope.applyNewAttributes(el.children[i]);
            };
        };


        $scope.createTree= function(a) {
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
            document.getElementById("export").insertAdjacentHTML( 'beforeend',$scope.svg[0].element.outerHTML);
            var svgImage=document.getElementById("export").children[0];
            var svgObject=d3.select(svgImage);
            var newSvg=[$scope.createTree(svgObject[0][0])];
            // console.log(newSvg);
            $scope.loadFromObject(newSvg[0],savedStates);
            $scope.animateState(newSvg[0],1,2);

        };


        $scope.animateState = function(a,state1,state2) {
            var el = a;
            // console.log(el.element[$scope.previousAttributesName],el.element["attributes_" + stateNumber]);
            d3.select(el.element).attr(el.element["attributes_" + state1]).transition().attr(el.element["attributes_" + state2]);
            for (var i = 0; i < el.children.length; i++) {
                $scope.animateState(el.children[i],state1,state2);
            };
        };




        $scope.saveStates = function() {
                var parent =$scope.svg[0];

                function _saveStates(a) {
                    var obj = {};
                    for (var i = 0; i < $scope.stateList.length; i++) {
                        obj[$scope.stateList[i]]=JSON.stringify(a.element[$scope.stateList[i]]);
                    };
                    obj.children = [];
                    for (var i = 0; i < a.children.length; i++) {
                        obj.children.push(_saveStates(a.children[i]));
                    };
                    return obj
                };
                $scope.savedObject=_saveStates(parent);
                return _saveStates(parent);
                // return (JSON.parse(JSON.stringify(_saveStates(parent))));
        };


        $scope.loadFromObject = function(parent,savedStates) {
                var savedObject= savedStates;
                // console.log(savedObject);
                var parent = parent;
                var nbStates=Object.keys(savedObject).length-1;
                function _loadStates(a,save) {
                    for (var i = 0; i < nbStates; i++) {
                        a.element["attributes_" +(i+1)]=JSON.parse(save["attributes_" +(i+1)]);
                    };
                    for (var i = 0; i < a.children.length; i++) {
                        _loadStates(a.children[i],save.children[i]);
                    };
                };
                _loadStates(parent,savedObject);
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