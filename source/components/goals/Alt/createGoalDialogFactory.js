function dialogController($filter, $mdDialog, goalService, dimensionService) {

    return function() {
        this.cancel = () => {
            $mdDialog.cancel();
        };

        // TODO Add caching to the dimension class and refactor it to exclude style function
        dimensionService.query((dimensions) => {
            console.log(this);
            this.dimensions = _.sortBy(dimensions, function(dimension) {
                return dimension.DisplayOrder;
            });
        });

        this.getCapabilitiesForSelectedDimension = function(dimensionId) {
            if (dimensionId) {
                dimensionService.get({ dimension: dimensionId },
                    (dimension) => {
                        this.capabilities = dimension.Capabilities;
                    });
            } else {
                this.capabilities = [];
            }
        };

        this.addGoal = function() {
            $filter('date')(this.goal.DueDate, 'yyyy-MM-ddTHH.mm.ss.sssZ');
            let goal = {
                CapabilityId: this.goal.selectedCapability.Id,
                Notes: this.goal.Notes,
                DueDate: this.goal.DueDate
            };

            goalService.save(goal);
            $mdDialog.hide();
        };

        this.searchTextChange = (text, selectedItem) => {
            selectedItem = text;
        };

        this.querySearch = (query, items, propertyName) => {
            return query ? items.filter(this.createFilterFor(query, items, propertyName)) : items;
        };

        this.createFilterFor = function(query, items, propertyName = 'Name') {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(items) {
                return (items[ propertyName ].toLowerCase().indexOf(lowercaseQuery) === 0);
            };
        };
    };
}

var app = angular.module('cn.createDialog', []);
app.factory('createDialog', [ '$filter', '$mdDialog', 'goalService', 'dimensionService', dialogController ]);

export default app;
