'use strict';

var DashboardPage = require('../pageobject/dashboard.po.js');

describe('Dashboard', function() {
    var dashboardPage = new DashboardPage();

    beforeAll(function() {
        browser.get('/index.html');
    });

    it('should have the correct username in the header', function() {
        expect(dashboardPage.headerUserName.getText()).toEqual('JANE DOE');
    });

    it('should display 3 tiles', function() {
        expect(dashboardPage.tiles.count()).toEqual(3);
    });
});
