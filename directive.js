var app = angular.module('app', []);

/**
 * A MainController to show how the data is maintained in the controller and passed to the directive
 */
app.controller('MainCtrl', function($scope, $rootScope) {
    $scope.data = [3,2];

    setInterval(function() {
        var num = Math.floor(Math.random() * 10);
        $scope.data.push(num);
        $scope.$broadcast('data');
    }, 3000);

})


/**
 * Directive with isolated scope
 */
app.directive('barchart', function($rootScope) {
    return {
        restrict: 'E',
        replace: true,
        link: function(scope, elt, attr) {
            /**
             * SVG with D3.js
             */
                var svgW = attr.width;
                var svgH = attr.height;

                var svg = d3.select('barchart').append('svg').attr('height', svgH).attr('width', svgW);

                var gbars = svg.append('g');

                update();
                scope.$on('data', update);



                function update() {

                    //DATA specific variables
                    var array = scope.data;
                    var lenData = array.length;
                    var padding = svgW / (2 * lenData);

                    //DATA JOIN
                    var bars = gbars.selectAll('rect').data(array);

                    //UPDATE

                    //ENTER - Create new elements as needed
                    bars
                        .enter()
                        .append('rect')

                    //EXIT
                    bars.exit()
                        .transition()
                        .duration(2000)
                        .delay(0)
                        .ease('linear')
                        .style('opacity', '0')
                        .remove();


                    var yScale = d3.scale.linear()
                        .domain([0, d3.max(array, function(d) { return d; })])
                        .range([svgH, 0]);
                    bars
                        .attr('x', function (d,i) { return i * (svgW / lenData) + padding;})

                        .attr('width', function() {return svgW / lenData - padding})
                        .attr('height', function(d) { return svgH - yScale(d); })

                    bars
                        .attr('y', function(d) { return yScale(d) * 2 + 10;})
                        .transition()
                        .duration(1000)
                        .delay(0)
                        .ease('inverse')
                        .attr('y', function(d) { return yScale(d);})

                    bars
                        .style('fill', 'black');

                    //DELETE AXIS
                    svg.select('.axis').remove();

                    var gaxis = svg.append('g');
                    var yAxis = d3.svg.axis().scale(yScale).orient('right').ticks(5);
                    gaxis
                        .classed('axis', true)
                        .call(yAxis);

                }

        }
    }
})