"use strict";
exports.__esModule = true;
exports.useAppSelector = exports.useAppDispatch = void 0;
var react_redux_1 = require("react-redux");
// Use throughout your app instead of plain `useDispatch` and `useSelector`
exports.useAppDispatch = react_redux_1.useDispatch;
exports.useAppSelector = react_redux_1.useSelector;
