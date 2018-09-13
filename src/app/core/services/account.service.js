"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var Rx_1 = require('rxjs/Rx');
/**
 * This class provides services for Accounts using the backend the REST API.
 */
var AccountService = (function () {
    /**
     * Create a new AccountsService with the injected Http.
     * @param {Http} http - The injected Http.
     * @constructor
     */
    function AccountService(http) {
        this.http = http;
        this.baseUrl = '/api/v1/account';
        this.sessionUrl = this.baseUrl + "/session";
        this.passordUrl = this.baseUrl + "/password";
        this.activationUrl = this.baseUrl + "/activation";
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        this.options = new http_1.RequestOptions({ headers: this.headers });
    }
    /**
     * Obtain Account details.
     * @return {Observable<object>} - The result of the API call as an Observable containing the response and error.
     */
    AccountService.prototype.get = function () {
        return this.http.get(this.baseUrl, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    /**
     * Create a new account.
     * @param {string[]} formData - New account form data.
     * @return {Observable<object>} - The result of the API call as an Observable containing the response and error.
     */
    AccountService.prototype.create = function (formData) {
        var payload = JSON.stringify(formData);
        return this.http.post(this.baseUrl, payload, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    AccountService.prototype.quote = function (formData) {
        var payload = JSON.stringify(formData);
        return this.http.get("https://geek-jokes.sameerkumar.website/api", this.options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    /**
     * Create a new session for an account (login).
     * @param {string[]} formData - Login form data.
     * @return {Observable<object>} - The result of the API call as an Observable containing the response and error.
     */
    AccountService.prototype.login = function (formData) {
        var payload = JSON.stringify(formData);
        return this.http.post(this.sessionUrl, payload, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    /**
     * Delete an existing session for an account (logout).
     * @return {Observable<object>} - The result of the API call as an Observable containing the response and error.
     */
    AccountService.prototype.logout = function () {
        return this.http.delete(this.sessionUrl, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    /**
     * Send an account activation email.
     * @param {string} email - Email of the account to activate.
     * @return {Observable<object>} - The result of the API call as an Observable containing the response and error.
     */
    AccountService.prototype.sendActivationEmail = function (email) {
        var payload = JSON.stringify({ email: email });
        return this.http.post(this.activationUrl, payload, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    /**
     * Send a password reset email.
     * @param {string} email - Email of the account that requested a password reset.
     * @return {Observable<object>} - The result of the API call as an Observable containing the response and error.
     */
    AccountService.prototype.sendPasswordResetEmail = function (email) {
        var payload = JSON.stringify({ email: email });
        return this.http.post(this.passordUrl, payload, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    /**
     * Activate a recently created account.
     * @param {string} token - The account activation token from the url or email link.
     * @return {Observable<object>} - The result of the API call as an Observable containing the response and error.
     */
    AccountService.prototype.activate = function (token) {
        var payload = JSON.stringify({ token: token });
        return this.http.put(this.activationUrl, payload, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    /**
     * Reset account password.
     * @param token - Account password reset token.
     * @param {string} password - New account password.
     * @return {Observable<object>} - The result of the API call as an Observable containing the response and error.
     */
    AccountService.prototype.resetPassword = function (token, password) {
        var payload = JSON.stringify({ token: token, password: password });
        return this.http.put(this.passordUrl, payload, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    /**
     * Obtain the current status of account's session (login session).
     * @return {Observable<object>} - The result of the API call as an Observable containing the response and error.
     */
    AccountService.prototype.checkSession = function () {
        return this.http.get(this.sessionUrl, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    /**
     * Return the data field from the json response body if it exists, otherwise return an empty object.
     * @param {Response} res - HTTP response object.
     * @return {object} - Data from HTTP Response body.
     */
    AccountService.prototype.extractData = function (res) {
        var data;
        try {
            data = res.json() || {};
        }
        catch (e) {
            data = {};
        }
        return data;
    };
    /**
     * Process HTTP response error to obtain the HTTP status code and error message.
     * @param {Response} httpError - HTTP response error object.
     * @return {Observable<object>} - The error message and the HTTP status code contained in an Observable.
     */
    AccountService.prototype.handleError = function (httpError) {
        var message;
        var status;
        /* Obtain HTTP status code and error message */
        try {
            /* Parse Response body for error message and obtain HTTP status code from Response */
            var body = httpError.json();
            message = body.message ? body.message : 'An unkown error occured, please contact support.';
            status = httpError.status;
        }
        catch (error) {
            /* For an invalid Response, use HTTP status code 503 for service not avaliable */
            message = 'Cannot communicate with the server, please contact support.';
            status = 503;
        }
        return Rx_1.Observable.throw({ status: status, message: message });
    };
    AccountService = __decorate([
        core_1.Injectable()
    ], AccountService);
    return AccountService;
}());
exports.AccountService = AccountService;
//# sourceMappingURL=account.service.js.map