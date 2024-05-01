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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.logout = exports.refreshToken = exports.callFetchAccount = exports.callRegister = exports.callLogin = exports.deletePermission = exports.updatePermission = exports.createPermission = exports.fetchPermissions = exports.updateResumeStatus = exports.createResume = exports.fetchResumeByUser = exports.fetchResumes = exports.deleteJob = exports.updateJob = exports.createJob = exports.fetchJobById = exports.countJobs = exports.fetchJobsSuggest = exports.fetchJobs = exports.deleteRole = exports.updateRole = exports.createRole = exports.fetchRoleById = exports.fetchRoles = exports.deleteCompany = exports.updateCompany = exports.createCompany = exports.fetchCompanyById = exports.countCompanies = exports.fetchCompanies = exports.deleteUser = exports.updateUserPassword = exports.updateUser = exports.createUser = exports.countUsers = exports.fetchUsers = void 0;
var auth_slice_1 = require("@/lib/redux/slice/auth.slice");
var store_1 = require("@/lib/redux/store");
var antd_1 = require("antd");
var BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
var NO_RETRY_HEADER = "No-Retry";
var fetchWithInterceptor = function (url, options) {
    if (options === void 0) { options = {
        headers: {}
    }; }
    return __awaiter(void 0, void 0, void 0, function () {
        var response, access_token, message_1, res;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    // Pre-request interceptor
                    if (typeof window !== "undefined" && localStorage.getItem("access_token")) {
                        options.headers = __assign(__assign({}, options.headers), { Authorization: "Bearer " + localStorage.getItem("access_token") });
                    }
                    if (!((_a = options.headers) === null || _a === void 0 ? void 0 : _a.Accept) && ((_b = options.headers) === null || _b === void 0 ? void 0 : _b["Content-Type"])) {
                        options.headers = __assign(__assign({}, options.headers), { Accept: "application/json", "Content-Type": "application/json; charset=utf-8" });
                    }
                    return [4 /*yield*/, fetch(url, options)];
                case 1:
                    response = _e.sent();
                    if (!!response.ok) return [3 /*break*/, 8];
                    if (!(response.status === 401 &&
                        url !== "/api/v1/auth/login" &&
                        !options.headers[NO_RETRY_HEADER])) return [3 /*break*/, 4];
                    return [4 /*yield*/, exports.refreshToken()];
                case 2:
                    access_token = _e.sent();
                    options.headers[NO_RETRY_HEADER] = "true";
                    if (!access_token) return [3 /*break*/, 4];
                    options.headers["Authorization"] = "Bearer " + access_token;
                    localStorage.setItem("access_token", access_token);
                    return [4 /*yield*/, fetch(url, options)];
                case 3:
                    response = _e.sent();
                    _e.label = 4;
                case 4:
                    if (!(response.status === 400 &&
                        url === "/api/v1/auth/refresh" &&
                        location.pathname.startsWith("/admin"))) return [3 /*break*/, 6];
                    return [4 /*yield*/, response.json()];
                case 5:
                    message_1 = (_d = (_c = (_e.sent())) === null || _c === void 0 ? void 0 : _c.message) !== null && _d !== void 0 ? _d : "Có lỗi xảy ra, vui lòng login.";
                    //dispatch redux action
                    store_1.makeStore().dispatch(auth_slice_1.setRefreshTokenAction({ status: true, message: message_1 }));
                    _e.label = 6;
                case 6:
                    if (!!response.ok) return [3 /*break*/, 8];
                    return [4 /*yield*/, response.json()];
                case 7:
                    res = _e.sent();
                    return [2 /*return*/, res];
                case 8: return [2 /*return*/, response.json()];
            }
        });
    });
};
// API USERS
exports.fetchUsers = function (current, name) {
    if (name === void 0) { name = ""; }
    return __awaiter(void 0, void 0, Promise, function () {
        var regex, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    regex = new RegExp(name, "i");
                    return [4 /*yield*/, fetchWithInterceptor(BACKEND_URL + "/api/v1/users?populate=role&pageSize=5&current=" + current + (name ? "&name=" + regex : ""), {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json"
                            }
                        })];
                case 1:
                    res = _a.sent();
                    if (!res) {
                        antd_1.notification.error({
                            message: "Có lỗi xảy ra",
                            description: res.message
                        });
                    }
                    else {
                        return [2 /*return*/, res];
                    }
                    return [2 /*return*/];
            }
        });
    });
};
exports.countUsers = function () { return __awaiter(void 0, void 0, Promise, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchWithInterceptor(BACKEND_URL + "/api/v1/users/record/count", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    cache: "no-cache"
                })];
            case 1:
                res = _a.sent();
                return [2 /*return*/, res];
        }
    });
}); };
exports.createUser = function (body) { return __awaiter(void 0, void 0, void 0, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchWithInterceptor(BACKEND_URL + "/api/v1/users", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("access_token")
                    },
                    body: JSON.stringify(body)
                })];
            case 1:
                res = _a.sent();
                if (res.statusCode === 400) {
                    antd_1.notification.error({
                        message: "Có lỗi xảy ra",
                        description: res.message
                    });
                    return [2 /*return*/];
                }
                return [2 /*return*/, res];
        }
    });
}); };
exports.updateUser = function (id, body) { return __awaiter(void 0, void 0, void 0, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchWithInterceptor(BACKEND_URL + "/api/v1/users/" + id, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("access_token")
                    },
                    body: JSON.stringify(body)
                })];
            case 1:
                res = _a.sent();
                if (res.statusCode === 400) {
                    antd_1.notification.error({
                        message: "Có lỗi xảy ra",
                        description: res.message
                    });
                    return [2 /*return*/];
                }
                return [2 /*return*/, res];
        }
    });
}); };
exports.updateUserPassword = function (id, body) { return __awaiter(void 0, void 0, void 0, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchWithInterceptor(BACKEND_URL + "/api/v1/users/" + id + "/password", {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("access_token")
                    },
                    body: JSON.stringify(body)
                })];
            case 1:
                res = _a.sent();
                return [2 /*return*/, res];
        }
    });
}); };
exports.deleteUser = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchWithInterceptor(BACKEND_URL + "/api/v1/users/" + id, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("access_token")
                    }
                })];
            case 1:
                res = _a.sent();
                if (res.statusCode === 400) {
                    antd_1.notification.error({
                        message: "Có lỗi xảy ra",
                        description: res.message
                    });
                    return [2 /*return*/];
                }
                return [2 /*return*/, res];
        }
    });
}); };
// API COMPANIES
exports.fetchCompanies = function (current, name, pageSize) {
    if (current === void 0) { current = 1; }
    if (name === void 0) { name = ""; }
    if (pageSize === void 0) { pageSize = 10; }
    return __awaiter(void 0, void 0, Promise, function () {
        var regex, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    regex = new RegExp(name, "i");
                    return [4 /*yield*/, fetchWithInterceptor(BACKEND_URL + "/api/v1/companies?" + (current ? "current=" + current : "") + (name ? "&name=" + regex : "") + (pageSize ? "&pageSize=" + pageSize : ""), {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            cache: "no-cache"
                        })];
                case 1:
                    res = _a.sent();
                    if (!res) {
                        antd_1.notification.error({
                            message: "Có lỗi xảy ra",
                            description: res.message
                        });
                    }
                    else {
                        return [2 /*return*/, res];
                    }
                    return [2 /*return*/];
            }
        });
    });
};
exports.countCompanies = function () { return __awaiter(void 0, void 0, Promise, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchWithInterceptor(BACKEND_URL + "/api/v1/companies/record/count", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    cache: "no-cache"
                })];
            case 1:
                res = _a.sent();
                return [2 /*return*/, res];
        }
    });
}); };
exports.fetchCompanyById = function (id) { return __awaiter(void 0, void 0, Promise, function () {
    var res, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch(BACKEND_URL + "/api/v1/companies/" + id, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })];
            case 1:
                res = _a.sent();
                return [4 /*yield*/, res.json()];
            case 2:
                data = _a.sent();
                return [2 /*return*/, data];
        }
    });
}); };
exports.createCompany = function (body) { return __awaiter(void 0, void 0, void 0, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchWithInterceptor(BACKEND_URL + "/api/v1/companies", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("access_token")
                    },
                    body: JSON.stringify(body)
                })];
            case 1:
                res = _a.sent();
                if (res.statusCode === 400) {
                    antd_1.notification.error({
                        message: "Có lỗi xảy ra",
                        description: res.message
                    });
                    return [2 /*return*/];
                }
                return [2 /*return*/, res];
        }
    });
}); };
exports.updateCompany = function (id, body) { return __awaiter(void 0, void 0, void 0, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchWithInterceptor(BACKEND_URL + "/api/v1/companies/" + id, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("access_token")
                    },
                    body: JSON.stringify(body)
                })];
            case 1:
                res = _a.sent();
                if (res.statusCode === 400) {
                    antd_1.notification.error({
                        message: "Có lỗi xảy ra",
                        description: res.message
                    });
                    return [2 /*return*/];
                }
                return [2 /*return*/, res];
        }
    });
}); };
exports.deleteCompany = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchWithInterceptor(BACKEND_URL + "/api/v1/companies/" + id, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("access_token")
                    }
                })];
            case 1:
                res = _a.sent();
                if (!res) {
                    antd_1.notification.error({
                        message: "Có lỗi xảy ra"
                    });
                    return [2 /*return*/];
                }
                return [2 /*return*/, res];
        }
    });
}); };
// Roles Apis
exports.fetchRoles = function (current, name) {
    if (current === void 0) { current = 1; }
    if (name === void 0) { name = ""; }
    return __awaiter(void 0, void 0, Promise, function () {
        var regex, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    regex = new RegExp(name, "i");
                    return [4 /*yield*/, fetchWithInterceptor(BACKEND_URL + "/api/v1/roles" + (current ? "?current=" + current : "") + (name ? "&name=" + regex : ""), {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer " + localStorage.getItem("access_token")
                            }
                        })];
                case 1:
                    res = _a.sent();
                    if (!res) {
                        antd_1.notification.error({
                            message: "Có lỗi xảy ra",
                            description: res.message
                        });
                    }
                    else {
                        return [2 /*return*/, res];
                    }
                    return [2 /*return*/];
            }
        });
    });
};
exports.fetchRoleById = function (id) { return __awaiter(void 0, void 0, Promise, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchWithInterceptor(BACKEND_URL + "/api/v1/roles/" + id, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("access_token")
                    }
                })];
            case 1:
                res = _a.sent();
                if (!res.data) {
                    antd_1.notification.error({
                        message: "Có lỗi xảy ra",
                        description: res.message
                    });
                }
                else {
                    return [2 /*return*/, res];
                }
                return [2 /*return*/];
        }
    });
}); };
exports.createRole = function (body) { return __awaiter(void 0, void 0, void 0, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchWithInterceptor(BACKEND_URL + "/api/v1/roles", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("access_token")
                    },
                    body: JSON.stringify(body)
                })];
            case 1:
                res = _a.sent();
                if (res.statusCode === 400) {
                    antd_1.notification.error({
                        message: "Có lỗi xảy ra",
                        description: res.message
                    });
                    return [2 /*return*/];
                }
                return [2 /*return*/, res];
        }
    });
}); };
exports.updateRole = function (id, body) { return __awaiter(void 0, void 0, void 0, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchWithInterceptor(BACKEND_URL + "/api/v1/roles/" + id, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("access_token")
                    },
                    body: JSON.stringify(body)
                })];
            case 1:
                res = _a.sent();
                if (res.statusCode === 400) {
                    antd_1.notification.error({
                        message: "Có lỗi xảy ra",
                        description: res.message
                    });
                    return [2 /*return*/];
                }
                return [2 /*return*/, res];
        }
    });
}); };
exports.deleteRole = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchWithInterceptor(BACKEND_URL + "/api/v1/roles/" + id, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("access_token")
                    }
                })];
            case 1:
                res = _a.sent();
                if (!res) {
                    antd_1.notification.error({
                        message: "Có lỗi xảy ra",
                        description: res.message
                    });
                    return [2 /*return*/];
                }
                return [2 /*return*/, res];
        }
    });
}); };
// API JOBS
exports.fetchJobs = function (current, name, sort, location, pageSize) {
    if (current === void 0) { current = 1; }
    if (name === void 0) { name = ""; }
    if (sort === void 0) { sort = "createdAt"; }
    if (location === void 0) { location = ""; }
    if (pageSize === void 0) { pageSize = 10; }
    return __awaiter(void 0, void 0, Promise, function () {
        var sanitizedInput, regex, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sanitizedInput = name.replace(/[()\/]/g, "");
                    regex = new RegExp(sanitizedInput, "i");
                    return [4 /*yield*/, fetchWithInterceptor(BACKEND_URL + "/api/v1/jobs?current=" + current + (name ? "&name=" + regex : "") + (pageSize ? "&pageSize=" + pageSize : 10) + (sort ? "&sort=" + sort : "") + (location ? "&location=" + location : ""), {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json"
                            }
                        })];
                case 1:
                    res = _a.sent();
                    if (!res) {
                        antd_1.notification.error({
                            message: "Có lỗi xảy ra",
                            description: res.message
                        });
                    }
                    else {
                        return [2 /*return*/, res];
                    }
                    return [2 /*return*/];
            }
        });
    });
};
exports.fetchJobsSuggest = function (name, location) {
    if (location === void 0) { location = ""; }
    return __awaiter(void 0, void 0, Promise, function () {
        var res, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(BACKEND_URL + "/api/v1/jobs/search/suggest?name=" + name + (location ? "&location=" + location : ""), {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data];
            }
        });
    });
};
exports.countJobs = function () { return __awaiter(void 0, void 0, Promise, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchWithInterceptor(BACKEND_URL + "/api/v1/jobs/record/count", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    cache: "no-cache"
                })];
            case 1:
                res = _a.sent();
                return [2 /*return*/, res];
        }
    });
}); };
exports.fetchJobById = function (id) { return __awaiter(void 0, void 0, Promise, function () {
    var res, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch(BACKEND_URL + "/api/v1/jobs/" + id, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })];
            case 1:
                res = _a.sent();
                return [4 /*yield*/, res.json()];
            case 2:
                data = _a.sent();
                return [2 /*return*/, data];
        }
    });
}); };
exports.createJob = function (body) { return __awaiter(void 0, void 0, void 0, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchWithInterceptor(BACKEND_URL + "/api/v1/jobs", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("access_token")
                    },
                    body: JSON.stringify(body)
                })];
            case 1:
                res = _a.sent();
                if (res.statusCode === 400) {
                    antd_1.notification.error({
                        message: "Có lỗi xảy ra",
                        description: res.message
                    });
                    return [2 /*return*/];
                }
                return [2 /*return*/, res];
        }
    });
}); };
exports.updateJob = function (id, body) { return __awaiter(void 0, void 0, void 0, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchWithInterceptor(BACKEND_URL + "/api/v1/jobs/" + id, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("access_token")
                    },
                    body: JSON.stringify(body)
                })];
            case 1:
                res = _a.sent();
                if (res.statusCode === 400) {
                    antd_1.notification.error({
                        message: "Có lỗi xảy ra",
                        description: res.message
                    });
                    return [2 /*return*/];
                }
                return [2 /*return*/, res];
        }
    });
}); };
exports.deleteJob = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchWithInterceptor(BACKEND_URL + "/api/v1/jobs/" + id, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("access_token")
                    }
                })];
            case 1:
                res = _a.sent();
                if (res.statusCode !== 201) {
                    antd_1.notification.error({
                        message: "Có lỗi xảy ra",
                        description: res.message
                    });
                    return [2 /*return*/];
                }
                return [2 /*return*/, res];
        }
    });
}); };
// API RESUMES
exports.fetchResumes = function (current, status) {
    if (status === void 0) { status = ""; }
    return __awaiter(void 0, void 0, Promise, function () {
        var regex, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    regex = new RegExp(status, "i");
                    return [4 /*yield*/, fetchWithInterceptor(BACKEND_URL + "/api/v1/resumes?current=" + current + (status ? "&status=" + regex : "") + "&pageSize=5&populate=companyId,jobId", {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer " + localStorage.getItem("access_token")
                            }
                        })];
                case 1:
                    res = _a.sent();
                    if (!res) {
                        antd_1.notification.error({
                            message: "Có lỗi xảy ra",
                            description: res.message
                        });
                        return [2 /*return*/];
                    }
                    else {
                        return [2 /*return*/, res];
                    }
                    return [2 /*return*/];
            }
        });
    });
};
exports.fetchResumeByUser = function () { return __awaiter(void 0, void 0, Promise, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchWithInterceptor(BACKEND_URL + "/api/v1/resumes/by-user", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("access_token")
                    }
                })];
            case 1:
                res = _a.sent();
                return [2 /*return*/, res];
        }
    });
}); };
exports.createResume = function (body) { return __awaiter(void 0, void 0, void 0, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchWithInterceptor(BACKEND_URL + "/api/v1/resumes", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("access_token")
                    },
                    body: JSON.stringify(body)
                })];
            case 1:
                res = _a.sent();
                if (res.statusCode === 400) {
                    antd_1.notification.error({
                        message: "Có lỗi xảy ra",
                        description: res.message
                    });
                    return [2 /*return*/];
                }
                return [2 /*return*/, res];
        }
    });
}); };
exports.updateResumeStatus = function (id, status) { return __awaiter(void 0, void 0, void 0, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchWithInterceptor(BACKEND_URL + "/api/v1/resumes/" + id, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("access_token")
                    },
                    body: JSON.stringify({ status: status })
                })];
            case 1:
                res = _a.sent();
                if (res.statusCode === 400) {
                    antd_1.notification.error({
                        message: "Có lỗi xảy ra",
                        description: res.message
                    });
                    return [2 /*return*/];
                }
                return [2 /*return*/, res];
        }
    });
}); };
// API PERMISSIONS
exports.fetchPermissions = function (current, name, module, pageSize) {
    if (current === void 0) { current = 1; }
    if (name === void 0) { name = ""; }
    if (module === void 0) { module = ""; }
    if (pageSize === void 0) { pageSize = 10; }
    return __awaiter(void 0, void 0, Promise, function () {
        var nameRegex, moduleRegex, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nameRegex = new RegExp(name, "i");
                    moduleRegex = new RegExp(module, "i");
                    return [4 /*yield*/, fetchWithInterceptor(BACKEND_URL + "/api/v1/permissions?current=" + current + (name ? "&name=" + nameRegex : "") + (module ? "&module=" + moduleRegex : "") + (pageSize ? "&pageSize=" + pageSize : ""), {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer " + localStorage.getItem("access_token")
                            }
                        })];
                case 1:
                    res = _a.sent();
                    if (!res) {
                        antd_1.notification.error({
                            message: "Có lỗi xảy ra",
                            description: res.message
                        });
                    }
                    else {
                        return [2 /*return*/, res];
                    }
                    return [2 /*return*/];
            }
        });
    });
};
exports.createPermission = function (body) { return __awaiter(void 0, void 0, void 0, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchWithInterceptor(BACKEND_URL + "/api/v1/permissions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("access_token")
                    },
                    body: JSON.stringify(body)
                })];
            case 1:
                res = _a.sent();
                if (res.statusCode === 400) {
                    antd_1.notification.error({
                        message: "Có lỗi xảy ra",
                        description: res.message
                    });
                    return [2 /*return*/];
                }
                else {
                    return [2 /*return*/, res];
                }
                return [2 /*return*/];
        }
    });
}); };
exports.updatePermission = function (id, body) { return __awaiter(void 0, void 0, void 0, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchWithInterceptor(BACKEND_URL + "/api/v1/permissions/" + id, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("access_token")
                    },
                    body: JSON.stringify(body)
                })];
            case 1:
                res = _a.sent();
                if (!res) {
                    antd_1.notification.error({
                        message: "Có lỗi xảy ra",
                        description: res.message
                    });
                }
                else {
                    return [2 /*return*/, res];
                }
                return [2 /*return*/];
        }
    });
}); };
exports.deletePermission = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchWithInterceptor(BACKEND_URL + "/api/v1/permissions/" + id, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("access_token")
                    }
                })];
            case 1:
                res = _a.sent();
                if (!res) {
                    antd_1.notification.error({
                        message: "Có lỗi xảy ra",
                        description: res.message
                    });
                    return [2 /*return*/];
                }
                else {
                    return [2 /*return*/, res];
                }
                return [2 /*return*/];
        }
    });
}); };
// Auth Apis
exports.callLogin = function (username, password) { return __awaiter(void 0, void 0, Promise, function () {
    var res, _a, _b, _c, data;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, fetch(BACKEND_URL + "/api/v1/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({ username: username, password: password })
                })];
            case 1:
                res = _d.sent();
                if (!!res.ok) return [3 /*break*/, 3];
                _b = (_a = antd_1.notification).error;
                _c = {
                    message: "Có lỗi xảy ra"
                };
                return [4 /*yield*/, res.json().then(function (data) { return data.message; })];
            case 2:
                _b.apply(_a, [(_c.description = _d.sent(),
                        _c)]);
                return [2 /*return*/];
            case 3: return [4 /*yield*/, res.json()];
            case 4:
                data = _d.sent();
                return [2 /*return*/, data];
        }
    });
}); };
exports.callRegister = function (body) { return __awaiter(void 0, void 0, void 0, function () {
    var res, _a, _b, _c, data;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, fetch(BACKEND_URL + "/api/v1/auth/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                })];
            case 1:
                res = _d.sent();
                if (!!res.ok) return [3 /*break*/, 3];
                _b = (_a = antd_1.notification).error;
                _c = {
                    message: "Có lỗi xảy ra"
                };
                return [4 /*yield*/, res.json().then(function (data) { return data.message; })];
            case 2:
                _b.apply(_a, [(_c.description = _d.sent(),
                        _c)]);
                return [2 /*return*/];
            case 3: return [4 /*yield*/, res.json()];
            case 4:
                data = _d.sent();
                return [2 /*return*/, data];
        }
    });
}); };
exports.callFetchAccount = function () { return __awaiter(void 0, void 0, Promise, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchWithInterceptor(BACKEND_URL + "/api/v1/auth/account", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("access_token")
                    }
                })];
            case 1:
                res = _a.sent();
                if (!res) {
                    return [2 /*return*/, Promise.resolve(undefined)];
                }
                return [2 /*return*/, res];
        }
    });
}); };
exports.refreshToken = function () { return __awaiter(void 0, void 0, Promise, function () {
    var res, data;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, fetch(BACKEND_URL + "/api/v1/auth/refresh", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include"
                })];
            case 1:
                res = _b.sent();
                if (!res.ok) {
                    return [2 /*return*/, null];
                }
                return [4 /*yield*/, res.json()];
            case 2:
                data = _b.sent();
                return [2 /*return*/, ((_a = data.data) === null || _a === void 0 ? void 0 : _a.access_token) || null];
        }
    });
}); };
exports.logout = function () { return __awaiter(void 0, void 0, Promise, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchWithInterceptor(BACKEND_URL + "/api/v1/auth/logout", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("access_token")
                    },
                    credentials: "include"
                })];
            case 1:
                res = _a.sent();
                if (res.statusCode === 400) {
                    antd_1.notification.error({
                        message: "Có lỗi xảy ra",
                        description: res.message
                    });
                    return [2 /*return*/];
                }
                return [2 /*return*/, res];
        }
    });
}); };
