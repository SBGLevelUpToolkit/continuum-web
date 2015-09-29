var ModerateAssessmentHelper = function() {
};

ModerateAssessmentHelper.prototype.displayVisualisation = function(element, ratingType) {
    element.each(function(index, elm) {
        let element = $(elm).find('div:first-child')[ 0 ],
            rating = +$(elm).attr(ratingType),
            fill = 'rgba(255, 0, 0, 0.5)';

        if (ratingType === 'moderated-rating') {
            fill = 'rgba(237, 156, 24, 1)';
        } else if (rating === 1) {
            fill = 'rgba(3, 128, 26, 1)';
        }

        if (rating > 0) {
            let levelText = $(element).text();
            $(element).text('');

            var svg = d3.select(element).append('svg')
                .attr('width', 60)
                .attr('height', 60);

            /* Define the data for the circles */
            var elem = svg.selectAll('g myCircleText')
                .data([ rating ]);

            /*Create and place the 'blocks' containing the circle and the text */
            var elemEnter = elem.enter()
                .append('g')
                .attr('transform', function(d) {
                    return 'translate(30, 30)';
                });

            /*Create the circle for each block */
            var circle = elemEnter.append('circle')
                .attr('r', 0)
                .attr('fill', fill);

            /* Create the text for each block */
            elemEnter.append('text')
                .attr('dx', function(d) {
                    return -5;
                })
                .attr('dy', function(d) {
                    return 5;
                })
                .attr('fill', 'rgba(255, 255, 255, 1)')
                .text(function(d) {
                    return levelText;
                });

            circle
                .transition()
                .delay(250)
                .attr('r', function(d) {
                    return ratingType === 'moderated-rating' ? 30 : d * 30;
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