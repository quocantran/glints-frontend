"use strict";
exports.__esModule = true;
exports.makeStore = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var auth_slice_1 = require("./slice/auth.slice");
exports.makeStore = function () {
    return toolkit_1.configureStore({
        reducer: {
            auth: auth_slice_1["default"]
        }
    });
};
