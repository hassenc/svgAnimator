var app = angular.module('airline', ['airlineServices', 'airlineFilters', 'ui.router', 'angularTreeview']);

app.directive('applyChange', function() {
    return {
        link: function(scope, element, attrs) {
            scope.$watch('editTree.currentNode', function(newValue) {
                if (newValue !== undefined) {
                    for (var i = 0; i < scope.editTree.currentNode.element.attributes.length; i++) {
                        scope.$watchCollection('editTree.currentNode.element.attributes[' + i + ']', function(newAttribute) {
                            if (newAttribute !== undefined) {
                                scope.editTree.currentNode.element[scope.attributesName][newAttribute.name] = newAttribute.value;
                            }
                        });

                    };
                }
            });
        }
    }
});


app.directive('importSvg', function() {
    return {
        templateUrl: function(elem, attrs) {
            return attrs.templateUrl || '/img/contactSmiley-5.svg'
        },
        link: function(scope, element, attrs) {
            var svgImage = element[0].children[0];
            var gObject = d3.select(svgImage);
            gObject.style("width", "45px");

            function create(a) {
                var obj = {};
                obj.element = a;
                obj.name = a.id + ":" + a.tagName;
                obj.children = [];
                for (var i = 0; i < a.children.length; i++) {
                    obj.children.push(create(a.children[i]));
                };
                return obj
            };

            scope.svg = [scope.createTree(gObject[0][0])];
            scope.createState();

            // console.log(scope.svg);

          }
    }
});



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
