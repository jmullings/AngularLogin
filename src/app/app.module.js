"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var platform_browser_1 = require('@angular/platform-browser');
var http_1 = require('@angular/common/http');
var http_2 = require('@angular/http');
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var material_module_1 = require('./material.module');
var animations_1 = require("@angular/platform-browser/animations");
var app_component_1 = require('./app.component');
var account_service_1 = require('./core/services/account.service');
var landing_component_1 = require('./landing/landing.component');
var login_component_1 = require('./login/login.component');
var register_component_1 = require('./register/register.component');
var profile_component_1 = require('./profile/profile.component');
var app_routing_module_1 = require('.//app-routing.module');
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                login_component_1.LoginComponent,
                landing_component_1.LandingComponent,
                register_component_1.RegisterComponent,
                profile_component_1.ProfileComponent
            ],
            imports: [
                platform_browser_1.BrowserModule,
                animations_1.BrowserAnimationsModule,
                material_module_1.CustomMaterialModule,
                forms_1.FormsModule,
                app_routing_module_1.AppRoutingModule,
                http_2.HttpModule,
                http_1.HttpClientModule
            ],
            providers: [account_service_1.AccountService],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map