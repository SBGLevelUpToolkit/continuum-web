function Mediator() {
    this._handlers = {};
}

Mediator.prototype.listen = function(event_name, func) {
    if (!this._handlers[ event_name ]) {
        this._handlers[ event_name ] = [];
    }
    //let filtered = this._handlers[ event_name ].filter(function(value) {
    //        return value.toString() === func.toString();
    //    }
    //);

    let index = this._handlers[ event_name ].findIndex(function(value, index, array) {
        return value.toString() === func.toString();
    });

    //TODO Removes function if it already exists so we can replace it with the new one
    //This is because a subscriber may contain 'this' which must be updated with the new context if the page reloads
    //There must be a better solution to passing data around
    if (index > -1) {
        this._handlers[ event_name ].splice(index, 1);
    }

    //if (filtered.length === 0) {
    this._handlers[ event_name ].push(func);
    //}
};

Mediator.prototype.notify = function(event_name) {
    if (this._handlers[ event_name ]) {
        let args = arguments;
        Array.prototype.shift.apply(args);
        this._handlers[ event_name ].forEach(function(func) {
            func.apply(this, args);
        });
    }
};

var app = angular.module('cn.mediatorFactory', []);
app.service('mediatorService', Mediator);

export default app;