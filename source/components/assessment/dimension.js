import '../../services/createFactories';
import 'lodash';

class Dimension {
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

    getDimension(dimensionId) {
        this.fullDimension = this.dimensionService.get({ dimension: dimensionId },
            (dimension) => {
                this.minLevel = _.min(_.pluck(dimension.Capabilities, 'Level'));
                this.maxLevel = _.max(_.pluck(dimension.Capabilities, 'Level'));
                this.currentLevel = 1;
                this.getCapabilitiesAtLevel(this.minLevel);
            });
    }

    selectDimension(dimensionId) {
        if (this._currentlyActiveDimension) {
            this._resetDimensionStyle(this._currentlyActiveDimension);
        } else {
            this.hasFocus();
        }
        this._currentlyActiveDimension = window.event.currentTarget;

        this.getDimension(dimensionId);
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
    }

    hasFocus() {
        let elm = window.event.currentTarget.firstChild;
        elm.style.position = 'relative';
        elm.style.transition = 'all .1s ease-in-out';
        elm.style.transform = 'scale3d(1.1, 1.1, 1)';
    }

    lostFocus() {
        if (this._currentlyActiveDimension !== window.event.currentTarget) {
            this._resetDimensionStyle(window.event.currentTarget);
        }
    }

    _resetDimensionStyle(currentTarget) {
        //elm.firstChild.style.transform = 'translate(0px, 0)';
        currentTarget.firstChild.style.position = '';
        currentTarget.firstChild.style.cssText = ''; //setting position: relative sets this property as well
    }

}

var app = angular.module('dimension', [ 'cn.dimensionFactory' ]);
app.service('dimension', [ 'dimensionService', Dimension ]);

export default app;