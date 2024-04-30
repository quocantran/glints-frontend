"use client";
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
exports.__esModule = true;
var react_1 = require("react");
var navigation_1 = require("next/navigation");
var cssinjs_1 = require("@ant-design/cssinjs");
function StyledComponentsRegistry(_a) {
    var children = _a.children;
    var cache = react_1.useState(function () { return cssinjs_1.createCache(); })[0];
    var isServerInserted = react_1.useRef(false);
    navigation_1.useServerInsertedHTML(function () {
        if (isServerInserted.current) {
            // We would like to avoid duplicated css insertion
            // But it seems to break the style when streaming
            // return;
        }
        isServerInserted.current = true;
        var attributes = htmlToAttributes(cssinjs_1.extractStyle(cache));
        return React.createElement("style", __assign({}, attributes));
    });
    return (React.createElement(cssinjs_1.StyleProvider, { cache: cache, hashPriority: "high" }, children));
}
exports["default"] = StyledComponentsRegistry;
var startTagRegex = /^<(.+?)>/;
function htmlToAttributes(html) {
    var rootTagContentMatch = startTagRegex.exec(html);
    if (!rootTagContentMatch) {
        throw new Error("htmlEjectAttributes: invalid html");
    }
    var fullMatch = rootTagContentMatch[0], content = rootTagContentMatch[1];
    var htmlAttrsRegex = /\s(\w+)="(.+?)"/g;
    var match;
    var argPairs = [];
    while ((match = htmlAttrsRegex.exec(content))) {
        argPairs.push([match[1], match[2]]);
    }
    var rootTag = content.split(" ")[0];
    var __html = html.slice(fullMatch.length, html.lastIndexOf("</" + rootTag + ">"));
    return argPairs.reduce(function (acc, _a) {
        var _b;
        var name = _a[0], value = _a[1];
        return (__assign(__assign({}, acc), (_b = {}, _b[name] = value, _b)));
    }, {
        dangerouslySetInnerHTML: { __html: __html }
    });
}
