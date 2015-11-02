export default {
    team: {
        join: function(teamService, passPromise) {
            spyOn(teamService, 'join').and.callFake(function(x, successCb, failureCb) {
                return (passPromise) ? successCb() : failureCb({
                    data: {
                        Message: 'oh noze'
                    }
                });
            });
        },
        save: function(teamService, passPromise) {
            spyOn(teamService, 'save').and.callFake(function(x, successCb, failureCb) {
                return (passPromise) ? successCb() : failureCb({
                    data: {
                        Message: 'oh noze'
                    }
                });
            });
        }
    },
    user: {
        query: function(userService) {
            return spyOn(userService, 'query').and.callFake(function(cb) {
                let teams = [];
                let user = {
                    Name: 'foo',
                    Teams: teams
                };
                cb(user);
            });
        }
    }
};