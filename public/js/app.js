var app = angular.module('airline', ['airlineServices', 'airlineFilters', 'ui.router', 'angularTreeview']);



app.directive('importSvg', function() {
    return {
        templateUrl: function(elem, attrs) {
            return attrs.templateUrl || '/img/contactSmiley-5.svg'
        },
        link: function(scope, element, attrs) {
            console.log("eeeeeee")
            var allSmileys = element[0].parentNode.children;
            var svgImage = element[0].children[0];
            var gObject = d3.select(svgImage);
            gObject.style("width", "45px");
            scope.svg = gObject[0];
            console.log(gObject[0][0]);
            console.log(gObject[0][0].children[3].children);
            console.log(gObject[0][0].children[3].children[0]);
                        
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
