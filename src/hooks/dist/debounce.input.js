"use strict";
exports.__esModule = true;
var react_1 = require("react");
var DebounceInput = function (value, delay) {
    var _a = react_1.useState(value), debounceValue = _a[0], setDebounceValue = _a[1];
    react_1.useEffect(function () {
        var handler = setTimeout(function () {
            setDebounceValue(value);
        }, delay);
        return function () {
            clearTimeout(handler);
        };
    }, [value]);
    return debounceValue;
};
exports["default"] = DebounceInput;
