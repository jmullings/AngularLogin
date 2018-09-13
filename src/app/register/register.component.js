"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var RegisterComponent = (function () {
    function RegisterComponent(router) {
        this.router = router;
        this.register = {
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            password1: ''
        };
    }
    RegisterComponent.prototype.ngOnInit = function () {
    };
    RegisterComponent.prototype.getSession = function () {
        if (this.register.password === this.register.password1) {
            alert("Invalid: Passwords do not match");
        }
        else if (this.register.password == 'admin' && this.register.password == 'admin') {
            this.router.navigate(["profile"]);
        }
        else {
            alert("Invalid credentials");
        }
    };
    RegisterComponent = __decorate([
        core_1.Component({
            selector: 'app-register',
            templateUrl: './register.component.html',
            styleUrls: ['./register.component.css']
        })
    ], RegisterComponent);
    return RegisterComponent;
}());
exports.RegisterComponent = RegisterComponent;
//# sourceMappingURL=register.component.js.map