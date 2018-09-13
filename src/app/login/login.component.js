"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var LoginComponent = (function () {
    function LoginComponent(accountService, 
        // private customValidators: CustomValidatorService,
        router) {
        this.accountService = accountService;
        this.router = router;
        this.login = {
            email: '',
            password: ''
        };
    }
    LoginComponent.prototype.ngOnInit = function () {
        this.getRandomQuote();
    };
    LoginComponent.prototype.getRandomQuote = function () {
        this.accountService.quote([]).finally(function () {
        }).subscribe(function (response) {
            // this.quote = response;
            console.log(response);
        }, function (error) {
            console.log(error);
            /* Display error message */
            alert('Oh Snap ' + error.message);
        });
    };
    LoginComponent.prototype.getLogin = function (pass, email) {
        var _this = this;
        this.accountService.login([pass, email]).finally(function () {
        }).subscribe(function (response) {
            /* Redirect to profile page on successfull response */
            if (response)
                _this.router.navigate(['profile']);
            else
                alert('Incorrect email or password!');
        }, function (error) {
            /* Display error message */
            alert('Oh Snap ' + error.message);
        });
    };
    LoginComponent.prototype.getSession = function () {
        var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
        if (!regex.test(this.login.email)) {
            alert("Invalid email address");
        }
        else if (this.login.password !== '') {
            this.getLogin(this.login.email, this.login.password);
        }
        else {
            alert("Invalid credentials");
        }
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'app-log in',
            templateUrl: './login.component.html',
            styleUrls: ['./login.component.css']
        })
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map