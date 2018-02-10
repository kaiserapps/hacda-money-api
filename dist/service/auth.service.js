"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var AuthService = /** @class */ (function () {
    function AuthService() {
    }
    AuthService.prototype.getUser = function () {
        return new Principal("TestUser");
    };
    AuthService = __decorate([
        inversify_1.injectable()
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
var Principal = /** @class */ (function () {
    function Principal(details) {
        this.details = details;
    }
    Principal.prototype.isAuthenticated = function () {
        return Promise.resolve(true);
    };
    Principal.prototype.isResourceOwner = function (resourceId) {
        return Promise.resolve(resourceId === 1111);
    };
    Principal.prototype.isInRole = function (role) {
        return Promise.resolve(role === "admin");
    };
    return Principal;
}());
exports.Principal = Principal;
//# sourceMappingURL=auth.service.js.map