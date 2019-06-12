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


            // var copyAttributes1 =JSON.parse(JSON.stringify(a.element["animatedAttributes"][state1].attributes));
            // var copyAttributes2 =JSON.parse(JSON.stringify(a.element["animatedAttributes"][state2].attributes));

            // if (('transform' in a.element["animatedAttributes"][state1].attributes) && ('transform' in a.element["animatedAttributes"][state2].attributes)){
            //     delete copyAttributes1["transform"];
            //     delete copyAttributes2["transform"];
            // }

            // d3.select(a.element).attr(copyAttributes1).transition().duration(duration).attr(copyAttributes2);

            // //faut ptetr trier !!!!!!
            // //TODO trier d'abord
            // if (('transform' in a.element["animatedAttributes"][state1].attributes) && ('transform' in a.element["animatedAttributes"][state2].attributes)){
            //     // console.log(state1,state2,a.element["animatedAttributes"][state1].attributes["transform"],a.element["animatedAttributes"][state2].attributes["transform"]);
            //     // delete copyAttributes1["transform"];
            //     // delete copyAttributes2["transform"];
            // console.log("xxx");
            //     //WARNING if other attributes on g will not work !!!!!!!!!!!!!!
            //     d3.select(a.element).transition()
            //         .duration(duration)
            //         .attrTween("transform", tween);

            //     function tween() {
            //         return d3.interpolateString(a.element["animatedAttributes"][state1].attributes["transform"], a.element["animatedAttributes"][state2].attributes["transform"]);
            //     }

            // }
            // console.log(copyAttributes1,copyAttributes2);

            var t1 = a.element["animatedAttributes"][state1].attributes.transform;
            var t2 = a.element["animatedAttributes"][state2].attributes.transform;
            delete a.element["animatedAttributes"][state1].attributes.transform;
            delete a.element["animatedAttributes"][state2].attributes.transform;
            var ettrs1 = a.element["animatedAttributes"][state1].attributes;
            var ettrs2 = a.element["animatedAttributes"][state2].attributes;
            var keys = Object.keys(ettrs1);
            // for (var i = 0; i < keys.length; i++) {
            //     console.log(ettrs2[keys[i]])
                    
            //     d3.select(a.element).transition()
            //         .duration(duration)
            //         .attrTween(keys[i],function() {return d3.interpolate(ettrs1[keys[i]], ettrs2[keys[i]])});
            // };
                d3.select(a.element)
                    .attr(ettrs1)
                    .transition()
                    .duration(duration)
                    .ease("linear")
                    .attr(ettrs2)
                    .attrTween("transform",function() { if (t1 && t2) {return d3.interpolate(t1, t2)} });
            
             a.element["animatedAttributes"][state2].attributes.transform =t2;       
             a.element["animatedAttributes"][state1].attributes.transform =t1;       
                // d3.select(a.element).transition()
                //     .duration(duration)
                //     .attrTween(keys[i],function() {return d3.interpolate(ettrs1[keys[i]], ettrs2[keys[i]])});

                // d3.select(a.element)
                //     .attr({"fill":"red","opacity":0.5})
                //     .transition()
                //     .duration(duration)
                //     .attr({"fill":"blue","opacity":1})
            
            


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
