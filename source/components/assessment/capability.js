import '../../services/createFactories';
import 'lodash';

let levelNames = [ 'traveller', 'artisan', 'professional', 'expert', 'master' ];

class capability {
    constructor(dimensionService) {
        this.dimensionService = dimensionService;
        this.currentLevel = 1;

    }

    getAllDimensions() {
        this.dimensionService.query((dimensions) => {
            this.dimensions = _.sortBy(dimensions, function(dimension) {
                return dimension.DisplayOrder;
            });
        });
    }

    getPreviousLevel() {
        this.getCapabilitiesAtLevel(--this.currentLevel);
    }

    getNextLevel() {
        this.getCapabilitiesAtLevel(++this.currentLevel);
    }

    getCapabilitiesAtLevel(currentLevel) {
        this.capabilitiesAtSelectedLevel = _.filter(this.fullDimension.Capabilities, function(capability) {
            return capability.Level === currentLevel;
        });

        this.avatar = `menu_${levelNames[ this.currentLevel - 1 ]}_male_avatar_icon.png`;
    }
}

var app = angular.module('capability', [ 'cn.capabilityFactory' ]);
app.service('capability', [ 'dimensionService', Dimension ]);

export default app;