import './createFactories';
import 'lodash';
import 'angular-local-storage';

function dimension(dimensionService, localStorageService) {

    let levelNames = [ 'traveller', 'artisan', 'professional', 'expert', 'master' ];
    return {
        getAllDimensions: function() {
            return dimensionService.query((dimensions) => {
                this.dimensions = _.sortBy(dimensions, function(dimension) {
                    return dimension.DisplayOrder;
                });
            }).$promise;
        },

        getDimension: function(dimensionId) {
            return dimensionService.get({ dimension: dimensionId },
                (dimension) => {
                    this.fullDimension = dimension;
                    this.minLevel = _.min(_.pluck(dimension.Capabilities, 'Level'));
                    this.maxLevel = _.max(_.pluck(dimension.Capabilities, 'Level'));
                    this.currentLevel = 1;
                    this.getCapabilitiesAtLevel(this.minLevel);
                }).$promise;
        },

        getPreviousLevel: function() {
            this.getCapabilitiesAtLevel(--this.currentLevel);
        },

        getNextLevel: function() {
            this.getCapabilitiesAtLevel(++this.currentLevel);
        },

        getCapabilitiesAtLevel: function(currentLevel) {
            this.capabilitiesAtSelectedLevel = _.filter(this.fullDimension.Capabilities, function(capability) {
                return capability.Level === currentLevel;
            });

            let user = localStorageService.get('userDetails');
            let gender = user.Teams[ 0 ].AvatarName === 'Barbarian' ? 'male' : 'female';
            this.avatar = `menu_${levelNames[ this.currentLevel - 1 ]}_${gender}_avatar_icon.png`;
        }
    };
}

var app = angular.module('cn.dimension', [ 'cn.dimensionFactory' ]);
app.factory('dimension', [ 'dimensionService', 'localStorageService', dimension ]);

export default app;