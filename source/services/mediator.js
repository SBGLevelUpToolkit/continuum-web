function mediator() {
    var _handlers = {};
    return {
        listen(event_name, func) {
            if (!_handlers[ event_name ]) {
                _handlers[ event_name ] = [];
            }
            _handlers[ event_name ].push(func);
        },
        notify(event_name, options) {
            if (_handlers[ event_name ]) {
                _handlers[ event_name ].forEach(function(func) {
                    func(options);
                });
            }
        },
        getHandlers(event_name) {
            return _handlers[ event_name ];
        }
    };
}

var app = angular.module('cn.mediatorFactory', []);
app.factory('mediatorService', mediator);

export default app;