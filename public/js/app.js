var app = angular.module('airline', ['airlineServices', 'airlineFilters', 'ui.router', 'angularTreeview']);

app.directive('applyChange', function() {
    return {
        link: function(scope, element, attrs) {
            var animatedAttributes = [];
            var selectedState = {};
            //save and delete
            var selectedAttributes = [];

            //save
            var savedStateString = "";
            var savedState = {};

            function findExistingState(currentNode, time) {
                var selectedState = {};
                var animatedAttributes = currentNode.element["animatedAttributes"];
                for (var i = 0; i < animatedAttributes.length; i++) {
                    if (Math.abs(time - animatedAttributes[i].time) < 150) {
                        selectedState = animatedAttributes[i];
                        console.log("existing state");
                    }
                };
                return selectedState;
            }

            document.addEventListener('keydown', function() {
                return function(e) {
                    var newEls = [];
                    console.log(e)
                        //delete
                    if (e.keyCode === 46) {
                        console.log("suppp");
                        selectedAttributes = scope.editTree.currentNode.element["animatedAttributes"];

                        console.log(scope.editTree.currentNode.element["animatedAttributes"]);
                        for (var i = 0; i < selectedAttributes.length; i++) {
                            if (Math.abs(scope.currentTime - selectedAttributes[i].time) < 100) {
                                console.log("found it", i);
                                scope.editTree.currentNode.element["animatedAttributes"].splice(i, 1);
                                // scope.editTree.currentNode.element["animatedAttributes"] = scope.editTree.currentNode.element["animatedAttributes"].splice(i, 1);
                            }
                            // console.log(scope.editTree.currentNode.element["animatedAttributes"]);

                        };
                        console.log(scope.editTree.currentNode.element["animatedAttributes"]);
                        scope.$apply()
                    }
                    //copy c
                    if (e.keyCode === 67) {
                        console.log("copy");
                        selectedAttributes = scope.editTree.currentNode.element["animatedAttributes"];

                        console.log(scope.editTree.currentNode.element["animatedAttributes"]);
                        for (var i = 0; i < selectedAttributes.length; i++) {
                            if (Math.abs(scope.currentTime - selectedAttributes[i].time) < 100) {
                                savedStateString = JSON.stringify(selectedAttributes[i]);
                                // scope.editTree.currentNode.element["animatedAttributes"] = scope.editTree.currentNode.element["animatedAttributes"].splice(i, 1);
                            }
                        };


                    }
                    //copy v
                    if (e.keyCode === 86) {
                        if (savedState) {
                            console.log("paste");
                            savedState = JSON.parse(savedStateString);
                            savedState.time = scope.currentTime;
                            scope.editTree.currentNode.element["animatedAttributes"].push(savedState);
                            scope.$apply()
                        }
                    }
                }
            }(), true);

            // console.log(scope)
            scope.$watch('editTree.currentNode', function(newValue, oldValue) {
                if ((newValue !== undefined) && (newValue !== oldValue)) {

                    scope.$broadcast("selected_in_tree", scope.editTree.currentNode.element);
                }
            });
            scope.$watch('elementsList.length', function(nbrElements) {
                if (nbrElements > 0) {
                    for (var k = 0; k < scope.elementsList.length; k++) {
                        // console.log(scope.elementsList[k])
                        scope.$watch('elementsList[' + k + '].element.attributes.length', function(k) {
                            return function() {
                                for (var i = 0; i < scope.elementsList[k].element.attributes.length; i++) {
                                    scope.$watch('elementsList[' + k + '].element.attributes[' + i + '].value', function(j) {
                                        return function(newAttr, oldAttr) {
                                            var attr = scope.elementsList[k].element.attributes[j];
                                            // console.log(attr.name,attr.value);
                                            if ((attr !== undefined) && (scope.manualChange) && (attr.prefix === null)) {
                                                selectedState = findExistingState(scope.elementsList[k], scope.currentTime)
                                                if (Object.keys(selectedState).length !== 0) {
                                                    // console.log("edit existing state",scope.editTree.currentNode.name);
                                                    selectedState["attributes"][attr.name] = attr.value;
                                                } else {
                                                    // console.log("create new state");
                                                    selectedState = {
                                                        "time": scope.currentTime,
                                                        "attributes": {}
                                                    };
                                                    selectedState["attributes"][attr.name] = attr.value;
                                                    scope.elementsList[k].element["animatedAttributes"].push(selectedState)
                                                }
                                            }
                                        }
                                    }(i));

                                }
                            };
                        }(k));
                    };
                }
            });


        }
    }
});


app.directive('statesAxis', function() {
    return {
        link: function(scope, element, attrs) {
            var h = 20;
            var axisWidth = 1000;
            var axisXTranslate = 5;
            // X scale will fit all values from data[] within pixels 0-w
            scope.stateAxisScale = d3.scale.linear().domain([0, 10000]).range([0, axisWidth]);
            var invStateAxisScale = d3.scale.linear().domain([0, axisWidth]).range([0, 10000]);
            // Add the x-axis.

            scope.$watch('elementsList.length', function(newValue) {
                if (newValue > 0) {

                    var len = scope.elementsList.length;
                    var xAxis = d3.svg.axis().scale(scope.stateAxisScale).tickSize(-h * len).tickSubdivide(true);
                    var axis = d3.select(element[0]).append("svg")
                        .attr("class", "axis")
                        .attr("width", 1200)
                        .attr("height", len * h + 30);
                    var xaxis = axis.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(" + axisXTranslate + "," + (h * len + 5) + ")")
                        .call(xAxis);
                    axis.on("click", function() {
                        console.log('time timeline', invStateAxisScale(d3.mouse(this)[0] - axisXTranslate))
                        scope.currentTime = invStateAxisScale(d3.mouse(this)[0] - axisXTranslate);
                        scope.applyTimeAttribues(scope.currentTime);
                        scope.$apply();
                    })


                    var elementsStates = axis.append("g").attr("class", "elementsStates");
                    var statesGroups = elementsStates.selectAll("g").data(scope.elementsList).enter().append("g").attr("class", "aa");
                    console.log(statesGroups);
                    var bindedStates = {};
                    for (var i = 0; i < scope.elementsList.length; i++) {
                        var dragstart = 0
                        var drag = d3.behavior.drag()
                            .origin(function() {
                                var t = d3.select(this);
                                return {
                                    x: t.attr("x"),
                                    y: t.attr("y")
                                };
                            })
                            .on("dragstart", dragstarted)
                            .on("drag", dragged)
                            .on("dragend", dragended);

                        bindedStates['' + i + ''] = d3.select(statesGroups[0][i]).selectAll("circle")
                            .data(function(d) {
                                return d.element["animatedAttributes"];
                            });



                        bindedStates['' + i + ''].enter()
                            .append("circle")
                            .attr("cx", function(d) {
                                console.log('nnn', d.time, scope.stateAxisScale(d.time) + axisXTranslate);
                                return (scope.stateAxisScale(d.time) + axisXTranslate)
                            })
                            .attr("cy", function(d, x, j) {
                                return (i + 1) * h;
                            })
                            .attr("r", 3)
                            .style("cursor", "pointer")
                            .on("click", function(d) {
                                console.log('time state', d.time)
                                scope.currentTime = d.time;
                                //render this time
                                scope.editTree.currentNode = scope.elementsList[i];
                                statesGroups.selectAll("circle").style("fill", "black");
                                d3.select(this).style("fill", "red");
                            }).call(drag);




                        function dragstarted(d) {
                            dragstart = parseInt(d3.select(this).attr("cx"));
                            d3.event.sourceEvent.stopPropagation();
                            d3.select(this).classed("dragging", true);
                        }

                        function dragged(d) {
                            d3.select(this).attr("cx", dragstart + d3.event.x);
                            d.time = invStateAxisScale(dragstart + d3.event.x);
                            scope.currentTime = d.time;
                            scope.$apply();
                            // console.log(scope.statesObject);
                        }

                        function dragended(d) {
                            statesGroups.selectAll("circle").style("fill", "black");
                            d3.select(this).style("fill", "red");
                            d3.select(this).classed("dragging", false);

                            scope.$apply();
                        }
                        scope.$watch('elementsList[' + i + '].element["animatedAttributes"].length', function(i) {
                            return function(newValue, oldValue) {

                                bindedStates['' + i + ''] = d3.select(statesGroups[0][i]).selectAll("circle")
                                    .data(function(d) {
                                        return d.element["animatedAttributes"];
                                    })

                                bindedStates['' + i + ''].exit().remove();

                                bindedStates['' + i + ''].enter().append("circle")
                                    .attr("cx", function(d) {
                                        return (scope.stateAxisScale(d.time) + axisXTranslate)
                                    })
                                    .attr("cy", function(d, x, j) {
                                        return (i + 1) * h;
                                    })
                                    .attr("r", 3)
                                    .style("cursor", "pointer")
                                    .on("click", function(d) {
                                        console.log('time state', 'aaaaaaaaaaaaaa', d.time)
                                        scope.currentTime = d.time;
                                        //render this time
                                        scope.editTree.currentNode = scope.elementsList[i];
                                        statesGroups.selectAll("circle").style("fill", "black");
                                        d3.select(this).style("fill", "red");
                                    }).call(drag);


                                bindedStates['' + i + ''] = d3.select(statesGroups[0][i]).selectAll("circle")
                                    .data(function(d) {
                                        return d.element["animatedAttributes"];
                                    })
                                    .attr("cx", function(d) {
                                        return (scope.stateAxisScale(d.time) + axisXTranslate)
                                    });


                            }
                        }(i));
                    };

                }
            });

        }
    }
});


app.directive('importSvg', ['$rootScope', function($rootScope) {
    return {
        templateUrl: function(elem, attrs) {
            return attrs.templateUrl || '/img/contactSmiley-5.svg'
        },
        link: function(scope, element, attrs) {
            var svgImage = element[0].children[0];
            var container = element[0];

            var curConfig = {
                canvasName: 'default',
                canvas_expansion: 3,
                dimensions: [800, 400],
                initFill: {
                    color: 'FF0000', // solid red
                    opacity: 1
                },
                initStroke: {
                    width: 5,
                    color: '000000', // solid black
                    opacity: 1
                },
                initOpacity: 1,
                imgPath: 'images/',
                langPath: 'locale/',
                extPath: 'extensions/',
                jGraduatePath: 'jgraduate/images/',
                extensions: ['ext-markers.js', 'ext-connector.js', 'ext-eyedropper.js', 'ext-shapes.js', 'ext-imagelib.js', 'ext-grid.js'],
                initTool: 'select',
                wireframe: false,
                colorPickerCSS: null,
                gridSnapping: false,
                gridColor: "#000",
                baseUnit: 'px',
                snappingStep: 10,
                showRulers: false
            }
            var svgCanvas = new $.SvgCanvas(container, curConfig, scope);



            svgCanvas.customImport(svgImage);
            scope.$on("selected_in_canvas", function(event, args) {
                // console.log("selected_in_canvas")
                selectedNode = scope.createTree(args[0])
                    //remove highlight from previous node
                if (scope.editTree.currentNode && scope.editTree.currentNode.selected) {
                    scope.editTree.currentNode.selected = undefined;
                }

                //set highlight to selected node
                selectedNode.selected = 'selected';

                //set currentNode
                scope.editTree.currentNode = selectedNode;
                // console.log(args[0])
            })
            scope.$on("selected_in_tree", function(event, args) {
                // console.log("selected_in_tree")
                svgCanvas.selectOnly([args]);
            })
            var gObject = d3.select(svgImage);


            scope.svg = [scope.createTree(gObject[0][0])];
            scope.initElementStates();

            console.log(scope.svg);
            // gObject.select("circle").attr({"opacity":"1"}).transition().delay(2000).duration(5000).attr({"opacity":"0.5"});
            // console.log(scope.svg);

        }
    }
}]);


app.directive('animationResult', ['$rootScope', function($rootScope) {
    return {
        templateUrl: function(elem, attrs) {
            return attrs.templateUrl || '/img/contactSmiley-5.svg'
        },
        link: function(scope, element, attrs) {
            var svgImage = element[0].children[0];
            var container = element[0];

            var savedStates = '';

            function readTextFile(file) {
                var rawFile = new XMLHttpRequest();
                rawFile.open("GET", file, false);
                rawFile.onreadystatechange = function() {
                    if (rawFile.readyState === 4) {
                        if (rawFile.status === 200 || rawFile.status == 0) {

                            var allText = rawFile.responseText;

                            savedStates = allText;
                            // console.log(allText);
                            var nbrStates = Object.keys(JSON.parse(savedStates)).length - 1;

                            var svgObject = d3.select(svgImage);


                            var newSvg = [scope.createTree(svgObject[0][0])];
                            scope.loadFromObject(newSvg[0], savedStates);

                            svgObject.style("width", attrs.width);
                            svgObject.style("height", attrs.height);

                            scope.loadFromObject(newSvg[0], savedStates);

                            function repeat() {
                              scope.animateGlobal(newSvg[0]);
                            }

                            repeat();
                            setInterval(repeat, 5300);
                        }
                    }
                }
                rawFile.send(null);
            };
            // console.log(attrs.animationObject);
            readTextFile(attrs.animationObject);
        }
    }
}]);


app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$locationProvider',
    function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {
        $stateProvider.
        state('home', {
            url: '/',
            templateUrl: 'partials/import.html',
            controller: 'ImportCtrl',
            // onEnter: ['$state', 'Account', function($state, Account) {
            //     if (Account.hasRole('user')) {
            //         $state.go('profile');
            //     };
            // }]
        }).state('animation', {
            url: '/animation',
            templateUrl: 'partials/animation.html',
            controller: 'AnimationCtrl',
            // onEnter: ['$state', 'Account', function($state, Account) {
            //     if (Account.hasRole('user')) {
            //         $state.go('profile');
            //     };
            // }]
        });

        $locationProvider.html5Mode(true); // remove the ugly # in the url
    }
]);

angular.module('airlineFilters', [])
    .filter('originTitle', function() {
        return function(input) {
            return input.origin + ' - ' + input.originFullName;
        };
    })
    .filter('destinationTitle', function() {
        return function(input) {
            return input.destination + ' - ' + input.destinationFullName;
        };
    });
