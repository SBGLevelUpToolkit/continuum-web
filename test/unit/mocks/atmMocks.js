export default {
    cardReader: function(cardService, passPromise = true) {

        function _retainCard() {
            return spyOn(cardService, 'retainCard').and.stub();
        }

        function _readCard(isHot) {
            return spyOn(cardService, 'readCard').and.callFake(function(successCb) {
                successCb(isHot);
            });
        }

        return {
            retainCard: _retainCard,
            readCard: _readCard
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
    }
};