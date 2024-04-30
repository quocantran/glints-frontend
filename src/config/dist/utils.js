"use strict";
exports.__esModule = true;
exports.colorMethod = exports.LIST_LOCATION = exports.SKILL_LIST = void 0;
var colors_1 = require("@ant-design/colors");
exports.SKILL_LIST = [
    "NodeJS",
    "NestJS",
    "TypeScript",
    "Frontend",
    "Backend",
    "Fullstack",
    "Data Scientist",
    "DevOps",
    "Embedded",
    "Java",
    "Python",
    "C++",
    "C#",
    ".Net",
    "MySQL",
    "Docker",
];
exports.LIST_LOCATION = [
    { label: "Hà Nội", value: "Hà Nội" },
    { label: "Hồ Chí Minh", value: "Hồ Chí Minh" },
    { label: "Đà Nẵng", value: "Đà Nẵng" },
    { label: "Tất cả thành phố", value: "" },
];
function colorMethod(method) {
    switch (method) {
        case "POST":
            return colors_1.green[6];
        case "PUT":
            return colors_1.orange[6];
        case "GET":
            return colors_1.blue[6];
        case "DELETE":
            return colors_1.red[6];
        default:
            return colors_1.grey[10];
    }
}
exports.colorMethod = colorMethod;
