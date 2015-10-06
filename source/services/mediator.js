function mediator() {
    var _handlers = {};
    return {
        listen(event_name, func) {
            if (!_handlers[ event_name ]) {
                _handlers[ event_name ] = [];
            }
            _handlers[ event_name ].push(func);
        },
        notify(event_name) {
            if (_handlers[ event_name ]) {
                let args = arguments;
                Array.prototype.shift.apply(args);
                _handlers[ event_name ].forEach(function(func) {
                    func.apply(this, args);
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