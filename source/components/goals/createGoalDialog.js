export default /*@ngInject*/function($filter, $mdDialog, goalService, dimensionService) {
    this.cancel = () => {
        $mdDialog.cancel();
    };

    // TODO Add caching to the dimension class and refactor it to exclude style function
    if (!this.dimensions) {
        dimensionService.query((dimensions) => {
            this.dimensions = _.sortBy(dimensions, function(dimension) {
                return dimension.DisplayOrder;
            });
        });
    }

    this.getCapabilitiesForSelectedDimension = function(dimensionId) {
        if (dimensionId) {
            dimensionService.get({ dimension: dimensionId },
                (dimension) => {
                    this.capabilities = dimension.Capabilities;

                    if (this.selectedGoal) {
                        let Id = this.selectedGoal.CapabilityId,
                            selectedCapability = this.capabilities.filter(function(item) {
                                return item.Id === Id;
                            })[ 0 ];

                        this.goal.selectedCapability = selectedCapability;
                    }
                });
        } else {
            this.capabilities = [];
        }
    };

    if (this.selectedGoal) {
        this.selectedGoal.DueDate = new Date(this.selectedGoal.DueDate);
        this.goal = this.selectedGoal;
        this.headerText = 'Edit Goal';
        this.searchTextDimension = this.selectedGoal.DimensionText;
        this.getCapabilitiesForSelectedDimension(this.selectedGoal.DimensionId);
    } else {
        this.headerText = 'Create Goal';
    }

    this.saveGoal = function() {
        $filter('date')(this.goal.DueDate, 'yyyy-MM-ddTHH.mm.ss.sssZ');
        this.goal.CapabilityId = this.goal.selectedCapability.Id;

        if (this.selectedGoal) {
            goalService.update(this.goal);
        } else {
            goalService.save(this.goal);
        }

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
}
