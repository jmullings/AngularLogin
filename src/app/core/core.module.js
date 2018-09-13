"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var router_1 = require('@angular/router');
var http_1 = require('@angular/http');
/* Core Components */
var _404_component_1 = require('./404/404.component');
/* Core Guards */
// import {AuthGuard} from './guards/auth.guard';
// /* Core Services */
// import {AccountService} from './services/account.service';
// import {CustomValidatorService} from './services/custom-validator.service';
var CoreModule = (function () {
    function CoreModule(parentModule) {
        if (parentModule) {
            throw new Error('CoreModule is already loaded. Import it in the AppModule only');
        }
    }
    CoreModule.forRoot = function () {
        return {
            ngModule: CoreModule
        };
    };
    CoreModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule, router_1.RouterModule, http_1.HttpModule],
            declarations: [_404_component_1.NotFoundComponent],
            exports: [_404_component_1.NotFoundComponent]
        }),
        __param(0, core_1.Optional()),
        __param(0, core_1.SkipSelf())
    ], CoreModule);
    return CoreModule;
}());
exports.CoreModule = CoreModule;
//# sourceMappingURL=core.module.js.map