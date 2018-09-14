import expressValidator = require('express-validator');
import {Router, Request, Response, NextFunction} from 'express';

/**
 * Class representing a base router.
 */
export class BaseRouter {
    protected router: Router;
    private apiErrors: APIError[];
    private requestValidators: RequestValidator[];

    constructor() {
        this.router = Router();
        this.apiErrors = [];
        this.requestValidators = [];
    }

    /**
     * Return the Express router.
     * @return {Router} The Express Router.
     */
    public getRouter(): Router {
        return this.router;
    }

    /**
     * Load an API error map from a JSON file.
     * @param {string} filename - The name of the JSON file containing the API error map.
     */
    protected setErrorMap(filename: string) {
        this.apiErrors = require(filename).errors;
    }

    /**
     * Load an Express Request validation schema map from a JSON file.
     * @param {string} filename - The name of the JSON file containing the Express Request validation schema map.
     */
    protected setRequestValidationMap(filename: string) {
        this.requestValidators = require(filename).validators;
    }

    /**
     * Return an API error corresponding to a specific error code.
     * @param {number} code - A unique number representing an error.
     * @return {APIError} The API error containing an error code and corresponding error messages.
     */
    protected getError(code: number): APIError {
        // Find an API error object with the matching code
        const apiError = this.apiErrors.filter((item: APIError) => {
            return item.code === code;
        })[0];
        // Return error code with it's associated message
        return {
            code,
            message: apiError ? apiError.message : '',
            internalMessage: apiError ? apiError.internalMessage : 'Unrecognized error code, please check the error map file.',
        };
    }

    /**
     * Validate an Express Request body using the provided validation schema. Execute the Express next() function if validation is
     * successful, otherwise return an http error response.
     * @param {string} name - The name of a request validator schema.
     */
    protected validateRequest(name: string) {
        // Find a request validator with matching name
        const validator = this.requestValidators.filter((item: RequestValidator) => {
            return item.name === name;
        })[0];
        // Return an Express router handler
        return (req: Request, res: Response, next: NextFunction) => {
            // If validator doesn't exist, send 500 http response
            if (!validator) {
                return res.sendStatus(500);
            }
            // Validate the request body
            req.checkBody(validator.schema);
            req.getValidationResult().then((result) => {
                // If request body is invalid, send error response
                if (!result.isEmpty()) {
                    return res.status(400).send(this.getError(10));
                }
                next();
            });
        };
    }
}
