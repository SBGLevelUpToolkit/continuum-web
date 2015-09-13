class GoalDialog {
    constructor($filter, $mdDialog, goalService, dimensionService) {
        this.$filter = $filter;
        this.$mdDialog = $mdDialog;
        this.goalService = goalService;
        this.dimensionService = dimensionService;
    }

    cancel() {
        $mdDialog.cancel();
    }

    // TODO Add caching to the dimension class and refactor it to exclude style function
    getAllDimensions() {
        this.dimensionService.query((dimensions) => {
            console.log(this);
            this.dimensions = _.sortBy(dimensions, function(dimension) {
                return dimension.DisplayOrder;
            });
        });
    }

    getCapabilitiesForSelectedDimension(dimensionId) {
        if (dimensionId) {
            this.dimensionService.get({ dimension: dimensionId },
                (dimension) => {
                    this.capabilities = dimension.Capabilities;
                });
        } else {
            this.capabilities = [];
        }
    }

    addGoal() {
        this.$filter('date')(this.goal.DueDate, 'yyyy-MM-ddTHH.mm.ss.sssZ');
        let goal = {
            CapabilityId: this.goal.selectedCapability.Id,
            Notes: this.goal.Notes,
            DueDate: this.goal.DueDate
        };

        this.goalService.save(goal);
        this.$mdDialog.hide();
    }

    searchTextChange(text, selectedItem) {
        selectedItem = text;
    }

    querySearch(query, items, propertyName) {
        return query ? items.filter(this.createFilterFor(query, items, propertyName)) : items;
    }

    createFilterFor(query, items, propertyName = 'Name') {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(items) {
            return (items[ propertyName ].toLowerCase().indexOf(lowercaseQuery) === 0);
        };
    }
}

var app = angular.module('cn.createDialog', [ 'cn.goalFactory', 'cn.dimensionFactory' ]);
app.service('createDialog', [ '$filter', '$mdDialog', 'goalService', 'dimensionService', GoalDialog ]);

export default app;