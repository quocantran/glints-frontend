"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var store_1 = require("@/lib/redux/store");
function StoreProvider(_a) {
    var children = _a.children;
    var storeRef = react_1.useRef();
    if (!storeRef.current) {
        // Create the store instance the first time this renders
        storeRef.current = store_1.makeStore();
    }
    return React.createElement(react_redux_1.Provider, { store: storeRef.current }, children);
}
exports["default"] = StoreProvider;
