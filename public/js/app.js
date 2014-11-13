var app = angular.module('airline', ['airlineServices', 'airlineFilters', 'ui.router', 'angularTreeview']);



app.directive('importSvg', function() {
    return {
        templateUrl: function(elem, attrs) {
            return attrs.templateUrl || '/img/contactSmiley-5.svg'
        },
        link: function(scope, element, attrs) {
            console.log("eeeeeee");
            var allSmileys = element[0].parentNode.children;
            var svgImage = element[0].children[0];
            var gObject = d3.select(svgImage);
            gObject.style("width", "45px");
            scope.svg = gObject[0];

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

                a["attributes_" + stateNumber] = [];
                for (var i = 0; i < a.attributes.length; i++) {
                    a["attributes_" + stateNumber][i] = {};
                    a["attributes_" + stateNumber][i].name = a.attributes[i].name;
                    a["attributes_" + stateNumber][i].value = a.attributes[i].value;
                };
                for (var i = 0; i < a.children.length; i++) {
                    createState(a.children[i], stateNumber);
                };
            };



            createState(gObject[0][0], 1);
            createState(gObject[0][0], 2);

            d3.select(gObject[0][0].children[3].children[0]).attr("fill", "blue");

            console.log(gObject[0][0].children[3].children[0]["attributes_" + 2]);

            scope.svg = [create(gObject[0][0])];
            console.log(scope.svg);
            console.log(gObject[0][0]);
            console.log(gObject[0][0].children[3].children);
            console.log(gObject[0][0].children[3].children[0]);
            gObject[0][0].children[3].children[0].attributes_2 = {};
            // d3.select(gObject[0][0].children[3].children[0]).attr(attributesFromObject(gObject[0][0].children[3].children[0]));
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
