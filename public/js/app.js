var app = angular.module('airline', ['airlineServices', 'airlineFilters', 'ui.router', 'angularTreeview']);

app.directive('applyChange', function() {
    return {
        link: function(scope, element, attrs) {
            scope.$watch('abc.currentNode', function(newValue) {
                if (newValue !== undefined) {
                    for (var i = 0; i < scope.abc.currentNode.element.attributes.length; i++) {
                        scope.$watchCollection('abc.currentNode.element.attributes[' + i + ']', function(newAttribute) {
                            if (newAttribute !== undefined) {
                                scope.abc.currentNode.element[scope.attributesName][newAttribute.name] = newAttribute.value;
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
            var allSmileys = element[0].parentNode.children;
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

            function attributesOfObject(a) {
                obj = {};
                for (var i = 0; i < a.attributes.length; i++) {
                    obj[a.attributes[i].name] = a.attributes[i].value;
                };
                return obj;
            };


            function createState(a, stateNumber) {

                a["attributes_" + stateNumber] = {};
                for (var i = 0; i < a.attributes.length; i++) {
                    if (a.attributes[i].prefix === null) {
                        a["attributes_" + stateNumber][a.attributes[i].name] = a.attributes[i].value;
                    }
                };
                for (var i = 0; i < a.children.length; i++) {
                    createState(a.children[i], stateNumber);
                };
            };



            createState(gObject[0][0], 1);
            createState(gObject[0][0], 2);

            scope.svg = [create(gObject[0][0])];
            console.log(scope.svg);}
    }
});



app.directive('animation', function() {
    return {
        templateUrl: function(elem, attrs) {
            return attrs.templateUrl || '/img/contactSmiley-5.svg'
        },
        link: function(scope, element, attrs) {
            var allSmileys = element[0].parentNode.children;
            var svgImage = element[0].children[0];
            var gObject = d3.select(svgImage);
            gObject.style("width", "45px");

            scope.animation = scope.svg;
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
