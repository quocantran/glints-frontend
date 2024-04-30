"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.DebounceSelect = void 0;
var react_1 = require("react");
var antd_1 = require("antd");
var debounce_1 = require("lodash/debounce");
function DebounceSelect(_a) {
    var fetchOptions = _a.fetchOptions, _b = _a.debounceTimeout, debounceTimeout = _b === void 0 ? 500 : _b, value = _a.value, props = __rest(_a, ["fetchOptions", "debounceTimeout", "value"]);
    var _c = react_1.useState(false), fetching = _c[0], setFetching = _c[1];
    var _d = react_1.useState([]), options = _d[0], setOptions = _d[1];
    var fetchRef = react_1.useRef(0);
    var debounceFetcher = react_1.useMemo(function () {
        var loadOptions = function (value) {
            fetchRef.current += 1;
            var fetchId = fetchRef.current;
            setOptions([]);
            setFetching(true);
            fetchOptions(value).then(function (newOptions) {
                if (fetchId !== fetchRef.current) {
                    // for fetch callback order
                    return;
                }
                setOptions(newOptions);
                setFetching(false);
            });
        };
        return debounce_1["default"](loadOptions, debounceTimeout);
    }, [fetchOptions, debounceTimeout]);
    var handleOnFocus = function () {
        //fetching init data when focus to input
        if (options && options.length > 0) {
            return;
        }
        fetchOptions("").then(function (newOptions) {
            setOptions(__spreadArrays(options, newOptions));
        });
    };
    var handleOnBlur = function () {
        setOptions([]);
    };
    return (react_1["default"].createElement(antd_1.Select, __assign({ labelInValue: true, filterOption: false, onSearch: debounceFetcher, notFoundContent: fetching ? react_1["default"].createElement(antd_1.Spin, { size: "small" }) : null }, props, { options: options, onFocus: handleOnFocus, onBlur: handleOnBlur })));
}
exports.DebounceSelect = DebounceSelect;
