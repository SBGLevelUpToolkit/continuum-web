var ModerateAssessmentHelper = function() {
};

ModerateAssessmentHelper.prototype.displayVisualisation = function(element, ratingType) {
    element.each(function(index, elm) {
        let element = $(elm).find('div:first-child')[ 0 ],
            rating = $(elm).attr(ratingType),
            fill = ratingType === 'moderated-rating' ? 'rgba(3, 128, 26, 1)' : 'rgba(255,255,255,0.5';

        if (rating > 0) {
            $(element).text('');

            var svg = d3.select(element).append('svg')
                .attr('width', 50)
                .attr('height', 50);

            /* Define the data for the circles */
            var elem = svg.selectAll('g myCircleText')
                .data(rating);

            /*Create and place the 'blocks' containing the circle and the text */
            var elemEnter = elem.enter()
                .append('g')
                .attr('transform', function(d) {
                    return 'translate(25, 25)';
                });

            /*Create the circle for each block */
            var circle = elemEnter.append('circle')
                .attr('r', 0)
                .attr('stroke', 'black')
                .attr('fill', fill);

            /* Create the text for each block */
            elemEnter.append('text')
                .attr('dx', function(d) {
                    return -5;
                })
                .attr('dy', function(d) {
                    return 5;
                })
                .text(function(d) {
                    return d;
                });

            circle
                .transition()
                .delay(250)
                .attr('r', function(d) {
                    return ratingType === 'moderated-rating' ? 25 : d * 5;
                });

        } else {
            let rating = $(element).text();
            elm.innerHTML = '<div>' + rating + '</div>';
        }
    });
};

ModerateAssessmentHelper.prototype.removeExistingModeratedRating = function(dimensionColumn) {
    dimensionColumn.each(function(element) {
        $(element).attr('moderatedRating', '');
    });
    this.displayVisualisation(dimensionColumn, 'rating');
};

var app = angular.module('cn.moderateAssessmentHelper', []);
app.service('moderateAssessmentHelper', [ ModerateAssessmentHelper ]);

export default app;