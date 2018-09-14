import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {CookieService} from 'angular2-cookie/core';
import {Observable} from 'rxjs/Rx';

/**
 * This class provides services for Accounts using the backend the REST API.
 */
@Injectable()
export class AccountService {
    private baseUrl = '/api/v1/account';
    private sessionUrl = `${this.baseUrl}/session`;
    private passordUrl = `${this.baseUrl}/password`;
    private activationUrl = `${this.baseUrl}/activation`;

    private headers = new Headers({'Content-Type': 'application/json'});
    private options = new RequestOptions({headers: this.headers});

    /**
     * Create a new AccountsService with the injected Http.
     * @param {Http} http - The injected Http.
     * @constructor
     */
    constructor(private http: Http, private cookieService:CookieService) {}

    public getCookies(){

        return this.cookieService.get('cookieName');
    }

    public setCookies(cookiesmData: string){
        // return this.cookieService.put('cookieName', cookiesmData, 10 /*days from now*/);
    }

    public delCookies() {
        this.cookieService.remove('cookieName');
    }
    /**
     * Obtain Account details.
     * @return {Observable<object>} - The result of the API call as an Observable containing the response and error.
     */
    public get(): Observable<object> {
        return this.http.get(this.baseUrl, this.options)
                        .map(this.extractData)
                        .catch(this.handleError);
    }

    /**
     * Create a new account.
     * @param {string[]} formData - New account form data.
     * @return {Observable<object>} - The result of the API call as an Observable containing the response and error.
     */
    public create(formData: string[]): Observable<object> {
        const payload = JSON.stringify(formData);
        return this.http.post(this.baseUrl, payload, this.options)
                        .map(this.extractData)
                        .catch(this.handleError);
    }

    /**
     * simple API call to obtain joke quotes
     * @param formData
     * @returns {any|Maybe<T>}
     */
    public quote(): Observable<object> {
        return this.http.get(`https://geek-jokes.sameerkumar.website/api`, this.options)
                        .map(this.extractData)
                        .catch(this.handleError);
    }
    /**
     * Create a new session for an account (login).
     * @param {string[]} formData - Login form data.
     * @return {Observable<object>} - The result of the API call as an Observable containing the response and error.
     */
    public login(formData: string[]): Observable<object> {
        const payload = JSON.stringify(formData);
        return this.http.post(this.sessionUrl, payload, this.options)
                        .map(this.extractData)
                        .catch(this.handleError);
    }

    /**
     * Delete an existing session for an account (logout).
     * @return {Observable<object>} - The result of the API call as an Observable containing the response and error.
     */
    public logout(): Observable<object> {
        return this.http.delete(this.sessionUrl, this.options)
                        .map(this.extractData)
                        .catch(this.handleError);
    }

    /**
     * Send an account activation email.
     * @param {string} email - Email of the account to activate.
     * @return {Observable<object>} - The result of the API call as an Observable containing the response and error.
     */
    public sendActivationEmail(email: string): Observable<object> {
        const payload = JSON.stringify({email});
        return this.http.post(this.activationUrl, payload, this.options)
                        .map(this.extractData)
                        .catch(this.handleError);
    }

    /**
     * Send a password reset email.
     * @param {string} email - Email of the account that requested a password reset.
     * @return {Observable<object>} - The result of the API call as an Observable containing the response and error.
     */
    public sendPasswordResetEmail(email: string): Observable<object> {
        const payload = JSON.stringify({email});
        return this.http.post(this.passordUrl, payload, this.options)
                        .map(this.extractData)
                        .catch(this.handleError);
    }

    /**
     * Activate a recently created account.
     * @param {string} token - The account activation token from the url or email link.
     * @return {Observable<object>} - The result of the API call as an Observable containing the response and error.
     */
    public activate(token: string): Observable<object> {
        const payload = JSON.stringify({token});
        return this.http.put(this.activationUrl, payload, this.options)
                        .map(this.extractData)
                        .catch(this.handleError);
    }

    /**
     * Reset account password.
     * @param token - Account password reset token.
     * @param {string} password - New account password.
     * @return {Observable<object>} - The result of the API call as an Observable containing the response and error.
     */
    public resetPassword(token: string, password: string): Observable<object> {
        const payload = JSON.stringify({token, password});
        return this.http.put(this.passordUrl, payload, this.options)
                        .map(this.extractData)
                        .catch(this.handleError);
    }

    /**
     * Obtain the current status of account's session (login session).
     * @return {Observable<object>} - The result of the API call as an Observable containing the response and error.
     */
    public checkSession(): Observable<object> {
        return this.http.get(this.sessionUrl, this.options)
                        .map(this.extractData)
                        .catch(this.handleError);
    }

    /**
     * Return the data field from the json response body if it exists, otherwise return an empty object.
     * @param {Response} res - HTTP response object.
     * @return {object} - Data from HTTP Response body.
     */
    private extractData(res: Response): object {
        let data: object;
        try {
            data = res.json() || {};
        } catch (e) {
            data = {};
        }
        return data;
    }

    /**
     * Process HTTP response error to obtain the HTTP status code and error message.
     * @param {Response} httpError - HTTP response error object.
     * @return {Observable<object>} - The error message and the HTTP status code contained in an Observable.
     */
    private handleError(httpError: Response): Observable<object> {
        let message: string;
        let status: number;
        /* Obtain HTTP status code and error message */
        try {
            /* Parse Response body for error message and obtain HTTP status code from Response */
            const body = httpError.json();
            message = body.message ? body.message : 'An unkown error occured, please contact support.';
            status = httpError.status;
        } catch(error) {
            /* For an invalid Response, use HTTP status code 503 for service not avaliable */
            message = 'Cannot communicate with the server, please contact support.';
            status = 503;
        }
        return Observable.throw({status, message});
    }
}
