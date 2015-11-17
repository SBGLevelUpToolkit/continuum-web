export default {
    auth: function(authService, passPromise = true) {
        let $q;
        this.$injector.invoke(function(_$q_) {
            $q = _$q_;
        });

        function _login() {
            spyOn(authService, 'login').and.callFake(function() {
                return (passPromise) ? $q.when() : $q.reject({
                    error_description: 'oh noze'
                });
            });
        }

        function _saveRegistration() {
            spyOn(authService, 'saveRegistration').and.callFake(function() {
                return (passPromise) ? $q.when() : $q.reject({
                    data: {
                        Message: 'oh noze'
                    }
                });
            });
        }

        function _confirmEmail() {
            spyOn(authService, 'confirmEmail').and.callFake(function() {
                return (passPromise) ? $q.when() : $q.reject({
                    data: {
                        Message: 'oh noze'
                    }
                });
            });
        }

        function _resetPassword() {
            spyOn(authService, 'resetPassword').and.callFake(function() {
                return (passPromise) ? $q.when() : $q.reject({
                    data: {
                        Message: 'oh noze'
                    }
                });
            });
        }

        function _confirmResetPassword() {
            spyOn(authService, 'confirmResetPassword').and.callFake(function() {
                return (passPromise) ? $q.when() : $q.reject({
                    data: {
                        Message: 'oh noze'
                    }
                });
            });
        }

        function _logout() {
            return spyOn(authService, 'logOut').and.callFake(function() {
                return (passPromise) ? $q.when() : $q.reject({
                    error_description: 'oh noze'
                });
            });
        }

        return {
            login: _login,
            saveRegistration: _saveRegistration,
            confirmEmail: _confirmEmail,
            resetPassword: _resetPassword,
            confirmResetPassword: _confirmResetPassword,
            logout: _logout
        };
    },

    team: function(teamService, passPromise = true) {
        function _join() {
            return spyOn(teamService, 'join').and.callFake(function(x, successCb, failureCb) {
                return (passPromise) ? successCb() : failureCb({
                    data: {
                        Message: 'oh noze'
                    }
                });
            });
        }

        function _save() {
            return spyOn(teamService, 'save').and.callFake(function(x, successCb, failureCb) {
                return (passPromise) ? successCb() : failureCb({
                    data: {
                        Message: 'oh noze'
                    }
                });
            });
        }

        return {
            join: _join,
            save: _save
        };
    },

    user: function(userService, passPromise = true) {
        function _query(userIsInTeam = true) {
            if (passPromise === 'stub') {
                return spyOn(userService, 'query').and.stub();
            } else {
                return spyOn(userService, 'query').and.callFake(function(successCb, failureCb) {
                    let teams = userIsInTeam ? [ 'A Team' ] : [];
                    let user = {
                        Name: 'foo',
                        Teams: teams
                    };
                    return (passPromise) ? successCb(user) : failureCb({
                        data: {
                            Message: 'oh noze'
                        }
                    });
                });
            }
        }

        return {
            query: _query
        };
    },

    assessment: function(assessmentService, passPromise = true) {
        function _query(assessments) {
            return spyOn(assessmentService, 'query').and.callFake(function(successCb) {
                successCb(assessments);
            });
        }

        function _create() {
            return spyOn(assessmentService, 'create').and.callFake(function(successCb) {
                successCb();
            });
        }

        function _moderate() {
            return spyOn(assessmentService, 'moderate').and.callFake(function(successCb) {
                successCb();
            });
        }

        function _score(score) {
            return spyOn(assessmentService, 'score').and.callFake(function(successCb) {
                successCb(score);
            });
        }

        function _reopen() {
            return spyOn(assessmentService, 'reopen').and.callFake(function(successCb) {
                successCb();
            });
        }

        function _save() {
            return spyOn(assessmentService, 'save').and.stub();
        }

        function _close() {
            return spyOn(assessmentService, 'close').and.stub();
        }

        function _update() {
            return spyOn(assessmentService, 'update').and.stub();
        }

        return {
            query: _query,
            create: _create,
            moderate: _moderate,
            score: _score,
            reopen: _reopen,
            save: _save,
            close: _close,
            update: _update
        };
    },

    dimension: function(dimensionService) {
        function _query(dimensions) {
            dimensionService.query.and.callFake(function(successCb) {
                successCb(dimensions);
            });
        }

        function _get(capabilities) {
            dimensionService.get.and.callFake(function(params, successCb) {
                successCb(capabilities);
                return {
                    $promise: {
                        then: function(callback) {
                            return callback();
                        }
                    }
                };
            });
        }

        return {
            query: _query,
            get: _get
        };
    },

    goal: function(goalService, passPromise = true) {
        function _query(goals) {
            return spyOn(goalService, 'query').and.callFake(function(successCb) {
                successCb(goals);
            });
        }

        function _update() {
            return spyOn(goalService, 'update').and.callFake(function(x, successCb, failureCb) {
                return (passPromise) ? successCb() : failureCb({
                    data: {
                        Message: 'oh noze'
                    }
                });
            });
        }

        function _save() {
            return spyOn(goalService, 'save').and.callFake(function(x, successCb, failureCb) {
                return (passPromise) ? successCb() : failureCb({
                    data: {
                        Message: 'oh noze'
                    }
                });
            });
        }

        return {
            query: _query,
            update: _update,
            save: _save
        };
    }
};