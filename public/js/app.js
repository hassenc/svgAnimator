var app = angular.module('airline', ['airlineServices', 'airlineFilters', 'ui.router', 'angularTreeview']);

app.directive('applyChange', function() {
    return {
        link: function(scope, element, attrs) {

            scope.$watch('editTree.currentNode', function(newValue, oldValue) {
                if ((newValue !== undefined) && (newValue !== oldValue)) {
                    scope.$broadcast("selected_in_tree", scope.editTree.currentNode.element);
                    // var x = svgedit.path.getPath_(scope.editTree.currentNode.element);
                    // console.log(x);
                    for (var i = 0; i < scope.editTree.currentNode.element.attributes.length; i++) {
                        scope.$watch('editTree.currentNode.element.attributes[' + i + '].value', function(j) {
                            return function() {
                                var attr = scope.editTree.currentNode.element.attributes[j];
                                if (attr !== undefined) {
                                    scope.editTree.currentNode.element[scope.attributesName][attr.name] = attr.value;
                                }
                            }
                        }(i));
                    };
                }
            });
        }
    }
});


app.directive('statesAxis', function() {
    return {
        link: function(scope, element, attrs) {
            var h = 50;
            var axisWidth = 1000;
            // X scale will fit all values from data[] within pixels 0-w
            scope.stateAxisScale = d3.scale.linear().domain([0, 10000]).range([0, axisWidth]);
            var invStateAxisScale = d3.scale.linear().domain([0, axisWidth]).range([0, 10000]);
            var xAxis = d3.svg.axis().scale(scope.stateAxisScale).tickSize(-h).tickSubdivide(true);
            // Add the x-axis.
            var axis = d3.select(element[0]).append("svg")
                .attr("class", "axis")
                .attr("width", 1440)
                .attr("height", 100)
                .style("margin-left", 100)
            axis.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + h + ")")
                .call(xAxis);

            scope.stateIcons = axis.append("g");

            scope.$watch('nbrStates', function(newValue, oldValue) {
                if (newValue > 0) {

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

                    scope.stateIcons.selectAll("circle")
                        .data(scope.statesObject)
                        .enter()
                        .append("circle")
                        .attr("cx", function(d) {
                            return scope.stateAxisScale(d.time)
                        })
                        .attr("cy", 10)
                        .attr("r", 3)
                        .style("cursor", "pointer")
                        .on("click", function(d) {
                            scope.state(d.name);
                            scope.stateIcons.selectAll("circle").style("fill", "black");
                            d3.select(this).style("fill", "red");
                            scope.$apply();
                        })
                        .call(drag);

                    function dragstarted(d) {
                        dragstart = parseInt(d3.select(this).attr("cx"));
                        d3.event.sourceEvent.stopPropagation();
                        d3.select(this).classed("dragging", true);
                    }

                    function dragged(d) {
                        d3.select(this).attr("cx", dragstart + d3.event.x);
                        d.time = invStateAxisScale(dragstart + d3.event.x);
                        // console.log(scope.statesObject);
                    }

                    function dragended(d) {
                        scope.state(d.name);
                        scope.stateIcons.selectAll("circle").style("fill", "black");
                        d3.select(this).style("fill", "red");
                        d3.select(this).classed("dragging", false);

                        scope.$apply();
                    }

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
            scope.createState();

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
            var stateTimes = JSON.parse(attrs.stateTimes);

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


                            // console.log(stateTimes, cumulatedstateTimes, nbrStates)


                            for (var i = 0; i < nbrStates - 1; i++) {
                                setTimeout(function(j) {
                                    return function() {
                                        scope.animateState(newSvg[0], j + 1, j + 2, stateTimes[i + 1] - stateTimes[i]);
                                    }
                                }(i), stateTimes[i]);
                            };
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
