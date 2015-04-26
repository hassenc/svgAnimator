app.directive('monsterInit', ['$rootScope', function($rootScope) {
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
                            svgObject.select("#Body2_2_").style("display","block");
                            svgObject.select("#Body1_2_").style("display","none");
                            svgObject.select("#Body3_2_").style("display","none");


                            var newSvg = [scope.createTree(svgObject[0][0])];
                            scope.loadFromObject(newSvg[0], savedStates);

                            svgObject.style("width", attrs.width);
                            svgObject.style("height", attrs.height);

                            scope.loadFromObject(newSvg[0], savedStates);

                            function repeat() {
                              scope.animateGlobal(newSvg[0]);
                            }
                            // container.addEventListener("click",function(){

                            repeat();
                            
                            setInterval(repeat, 5000);
                            // })
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