'use strict';

var DashboardPage = function() {
    this.headerUserName = element(by.id('headerName'));
    this.tiles = element.all(by.className('grid-stack-item'));
};

module.exports = DashboardPage;
