var app = angular.module('airline', ['airlineServices', 'airlineFilters', 'ui.router', 'angularTreeview']);

app.directive('applyChange', function() {
    return {
        link: function(scope, element, attrs) {
            scope.$watch('editTree.currentNode', function(newValue,oldValue) {
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
                dimensions: [100, 100],
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
                console.log("selected_in_canvas")
                selectedNode=scope.createTree(args[0])
                //remove highlight from previous node
                if (scope.editTree.currentNode && scope.editTree.currentNode.selected) {
                    scope.editTree.currentNode.selected = undefined;
                }

                //set highlight to selected node
                selectedNode.selected = 'selected';

                //set currentNode
                scope.editTree.currentNode = selectedNode;
                console.log(args[0])
            })
            scope.$on("selected_in_tree", function(event, args) {
                console.log("selected_in_tree")
                svgCanvas.selectOnly([args]);
            })
            var gObject = d3.select(svgImage);


            scope.svg = [scope.createTree(gObject[0][0])];
            scope.createState();

            // console.log(scope.svg);

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
