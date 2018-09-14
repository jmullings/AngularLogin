import * as njwt from 'njwt';
import * as path from 'path';
import * as crypto from 'crypto';
import * as cookies from 'cookies';

import {CONF} from '../../config';
import {BaseRouter} from './base';
import {Emailer} from '../misc/emailer';
import {Accounts, AccountsModel} from '../models/accounts';
import {Router, Request, Response, NextFunction} from 'express';

/**
 * Class representing an Account router.
 */
class AccountsRouter extends BaseRouter {
    private sessionKey: Buffer;

    constructor() {
        super();
        this.setErrorMap(path.resolve(__dirname + '/settings/accounts-errors.json'));
        this.setRequestValidationMap(path.resolve(__dirname + '/settings/accounts-validators.json'));
        this.initSessionKey();
        this.initEndpoints();
    }

    /**
     * Initialize the session signing key.
     */
    private initSessionKey() {
        // Generate a buffer of 256 random bytes
        crypto.randomBytes(256, (err: Error, buffer: Buffer) => {
            // If an error occured then log error and terminate the server
            if (err) {
                console.error(err);
                process.exit(1);
            }
            // Assign buffer to the session signing key
            this.sessionKey = buffer;
        });
    }

    /**
     * Authorize a Account's access to the resource protected by this function by validating their session cookie.
     * @param {Request} req - The express request object.
     * @param {Response} res - The express response object.
     * @param {NextFunction} next - The express next function.
     */
    private authorize = (req: Request, res: Response, next: NextFunction) => {
        // Obtain compact token from session cookie sent by the client
        const compactToken = new cookies(req, res).get('session');
        if (!compactToken) {
            return res.status(401).send(this.getError(12));
        }
        // Verify and uncompress the compact token
        njwt.verify(compactToken, this.sessionKey, (njwtError: Error, token: any) => {
            // If token is invalid
            if (njwtError) {
                res.clearCookie('session');
                return res.status(401).send(this.getError(12));
            }
            // If token is valid then obtain Account's name and email from ID
            Accounts.findOne({
                _id: token.body.sub,
            }, (findError: Error, account: AccountsModel) => {
                // If an error occured then delete cookie and send error
                if (!account || findError) {
                    res.clearCookie('session');
                    return res.status(401).send(this.getError(12));
                }
                // Bind Account's properties to future requests
                req.authorizedAccount = {
                    name: account.name,
                    email: account.email,
                };
                next();
            });
        });
    }

    /**
     * Create a new Account.
     * @param {Request} req - The express request object.
     * @param {Response} res - The express response object.
     * @param {NextFunction} next - The express next function.
     */
    private create = (req: Request, res: Response, next: NextFunction) => {
        // Sanitize the email field
        req.sanitizeBody('email').normalizeEmail();
        // Check for an existing Account with the same email
        Accounts.findOne({
            email: req.body.email,
        }, (findError: Error, account: AccountsModel) => {
            // If an error occured send 500 response
            if (findError) {
                console.error(findError);
                return res.sendStatus(500);
            }
            // If an existing Account with matching email was found
            if (account) {
                return res.status(400).send(this.getError(11));
            }
            // Create a new Account
            Accounts.create(req.body, (createError: Error, newAccount: AccountsModel) => {
                // If an error occured send 500 response
                if (createError || !newAccount) {
                    console.error(createError);
                    return res.sendStatus(500);
                }
                return res.sendStatus(200);
            });
        });
    }

    /**
     * Get the authorized Account's name and email.
     * @param {Request} req - The express request object.
     * @param {Response} res - The express response object.
     * @param {NextFunction} next - The express next function.
     */
    private get = (req: Request, res: Response, next: NextFunction) => {
        // Send authorized Account's name and email with response
        return res.status(200).send(req.authorizedAccount);
    }

    /**
     * Get the authorized Account's name and email.
     * @param {Request} req - The express request object.
     * @param {Response} res - The express response object.
     * @param {NextFunction} next - The express next function.
     */
    private edit = (req: Request, res: Response, next: NextFunction) => {
        //  Sanitize the email field
        req.sanitizeBody('email').normalizeEmail();
        // Find Account and update name and or email
        Accounts.findOne({
            email: req.authorizedAccount.email,
        }, {
            $set: req.body,
        }, (findError: Error, account: AccountsModel) => {
            // If an error occured send 500 response
            if (findError) {
                console.log(findError);
                return res.sendStatus(500);
            }
            // If the Account was not found
            if (!account) {
                return res.status(404).send(this.getError(13));
            }
            return res.sendStatus(200);
        });
    }

    /**
     * Delete the authorized Account's account.
     * @param {Request} req - The express request object.
     * @param {Response} res - The express response object.
     * @param {NextFunction} next - The express next function.
     */
    private delete = (req: Request, res: Response, next: NextFunction) => {
        // Find an Account with specified email and account from request
        Accounts.findOne({
            email: req.authorizedAccount.email,
        }, (findError: Error, account: AccountsModel) => {
            // If an error occured send 500 response
            if (findError) {
                console.error(findError);
                return res.sendStatus(500);
            }
            // If the Account was not found
            if (!account) {
                return res.status(404).send(this.getError(14));
            }
            // Compare and verify the password to confirm deletion
            account.comparePassword(req.body.password, (matchError: Error, isMatch: boolean) => {
                // If an error occured send 500 response
                if (matchError) {
                    console.error(matchError);
                    res.sendStatus(500);
                }
                // If the passwords do not match send error
                if (!isMatch) {
                    return res.status(400).send(this.getError(15));
                }
                account.remove((deleteError: Error) => {
                    // If an error occured send 500 response
                    if (deleteError) {
                        console.error(deleteError);
                        return res.sendStatus(500);
                    }
                    return res.sendStatus(200);
                });
            });
        });
    }

    /**
     * Send an account activation email for a specific Account.
     * @param {Request} req - The express request object.
     * @param {Response} res - The express response object.
     * @param {NextFunction} next - The express next function.
     */
    private sendActivate = (req: Request, res: Response, next: NextFunction) => {
        // Define server url and template directory path
        const SERVER_URL = `${req.protocol}://${req.get('host')}`;
        const TEMPLATE_DIR = path.join(__dirname, '../emails/activate-account');
        // Sanitize the email field
        req.sanitizeBody('email').normalizeEmail();
        // Find the activated Account with specific email
        Accounts.findOne({
            email: req.body.email,
        }, (findError: Error, account: AccountsModel) => {
            // If an error occured send 500 response
            if (findError) {
                console.error(findError);
                return res.sendStatus(500);
            }
            // If Account with the specified email was not found
            if (!account) {
                return res.status(404).send(this.getError(41));
            }
            // If Account is already activated
            if (account.isActivated) {
                return res.status(400).send(this.getError(40));
            }
            // Generate 20 random bytes for the activation token
            crypto.randomBytes(20, (cryptoError: Error, buffer: Buffer) => {
                // If an error occured send 500 response
                if (cryptoError) {
                    console.error(cryptoError);
                    return res.sendStatus(500);
                }
                // Get token as a hex string and assign it to the Account
                const token = buffer.toString('hex');
                account.activationToken = token;
                account.save((saveError: Error, savedAccount: AccountsModel) => {
                    // If an error occured send 500 response
                    if (saveError) {
                        console.error(saveError);
                        return res.sendStatus(500);
                    }
                    // Attach activation token to email and send
                    Emailer.send({
                        to: {
                            name: savedAccount.name,
                            email: savedAccount.email,
                        },
                        from: {
                            name: 'Demo App',
                            email: 'example@email.com',
                        },
                        subject: 'Activation Email',
                        template: TEMPLATE_DIR,
                        content: {
                            name: savedAccount.name,
                            link: SERVER_URL + `/activate/${token}`,
                        },
                    }, (emailError: Error) => {
                        // If an error occured send 500 response
                        if (emailError) {
                            console.error(emailError);
                            return res.sendStatus(500);
                        }
                        return res.sendStatus(200);
                    });
                });
            });
        });
    }

    /**
     * Activate an Account.
     * @param {Request} req - The express request object.
     * @param {Response} res - The express response object.
     * @param {NextFunction} next - The express next function.
     */
    private activate = (req: Request, res: Response, next: NextFunction) => {
        // Find Account with specific activation token
        Accounts.findOneAndUpdate({
            activationToken: req.body.token,
        }, {
            $set: {
                isActivated: true,
            },
            $unset: {
                activationToken: 1,
            },
        }, (findError: Error, account: AccountsModel) => {
            // If an error occured send 500 response
            if (findError) {
                console.error(findError);
                return res.sendStatus(500);
            }
            // If the Account with specified token was not found
            if (!account) {
                return res.status(404).send(this.getError(42));
            }
            return res.sendStatus(200);
        });
    }

    /**
     * Send a new password reset email for a specific Account.
     * @param {Request} req - The express request object.
     * @param {Response} res - The express response object.
     * @param {NextFunction} next - The express next function.
     */
    private sendResetPassword = (req: Request, res: Response, next: NextFunction) => {
        // Define server url and template directory path
        const SERVER_URL = `${req.protocol}://${req.get('host')}`;
        const TEMPLATE_DIR = path.join(__dirname, '../emails/reset-password');
        // Sanitize the email field
        req.sanitizeBody('email').normalizeEmail();
        // Find the activated Account with specific email
        Accounts.findOne({
            isActivated: true,
            email: req.body.email,
        }, (findError: Error, account: AccountsModel) => {
            // If an error occured send 500 response
            if (findError) {
                console.error(findError);
                return res.sendStatus(500);
            }
            // If Account with the specified email was not found
            if (!account) {
                return res.status(404).send(this.getError(30));
            }
            // Generate 20 random bytes for the password reset token
            crypto.randomBytes(20, (cryptoError: Error, buffer: Buffer) => {
                // If an error occured send 500 response
                if (cryptoError) {
                    console.error(cryptoError);
                    return res.sendStatus(500);
                }
                // Get token as a hex string and assign it to the Account
                const token = buffer.toString('hex');
                account.resetPasswordToken = token;
                account.resetPasswordExpires = Date.now() + 3600000;
                account.save((saveError: Error, savedAccount: AccountsModel) => {
                    // If an error occured send 500 response
                    if (saveError || !savedAccount) {
                        console.error(saveError);
                        return res.sendStatus(500);
                    }
                    // Attach password reset token to email and send
                    Emailer.send({
                        to: {
                            name: savedAccount.name,
                            email: savedAccount.email,
                        },
                        from: {
                            name: 'Demo App',
                            email: 'example@email.com',
                        },
                        subject: 'Password Reset',
                        template: TEMPLATE_DIR,
                        content: {
                            name: savedAccount.name,
                            link: SERVER_URL + `/password-reset/${token}`,
                        },
                    }, (emailError: Error) => {
                        // If an error occured send 500 response
                        if (emailError) {
                            console.error(emailError);
                            return res.sendStatus(500);
                        }
                        return res.sendStatus(200);
                    });
                });
            });
        });
    }

    /**
     * Reset an Account's password.
     * @param {Request} req - The express request object.
     * @param {Response} res - The express response object.
     * @param {NextFunction} next - The express next function.
     */
    private resetPassword = (req: Request, res: Response, next: NextFunction) => {
        // Find Account with specific non-expired reset token
        Accounts.findOne({
            resetPasswordToken: req.body.token,
            resetPasswordExpires: {
                $gt: Date.now(),
            },
        }, (findError: Error, account: AccountsModel) => {
            // If an error occured send 500 response
            if (findError) {
                console.error(findError);
                return res.sendStatus(500);
            }
            // If the Account with the specified token was not found
            if (!account) {
                return res.status(404).send(this.getError(31));
            }
            // If the Account is not activated
            if (!account.isActivated) {
                return res.status(400).send(this.getError(32));
            }
            // Modify account password and remove password reset token
            account.password = req.body.password;
            account.resetPasswordToken = undefined;
            account.resetPasswordExpires = undefined;
            account.save((saveError: Error, savedAccount: AccountsModel) => {
                // If an error occured send 500 response
                if (saveError) {
                    console.error(saveError);
                    return res.sendStatus(500);
                }
                // If the Account was not found
                if (!savedAccount) {
                    return res.status(404).send(this.getError(31));
                }
                return res.sendStatus(200);
            });
        });
    }

    /**
     * Create a new session cookie for the Account.
     * @param {Request} req - The express request object.
     * @param {Response} res - The express response object.
     * @param {NextFunction} next - The express next function.
     */
    private createSession = (req: Request, res: Response, next: NextFunction) => {
        // Obtain the server url from request
        const SERVER_URL: string = `${req.protocol}://${req.get('host')}`;
        // Sanitize the email field
        req.sanitizeBody('email').normalizeEmail();
        // Find an account with specified email from request
        Accounts.findOne({
            email: req.body.email,
        }, (findError: Error, account: AccountsModel) => {
            // If an error occured send 500 response
            if (findError) {
                console.error(findError);
                return res.sendStatus(500);
            }
            // If the Account with the specified email was not found
            if (!account) {
                return res.status(404).send(this.getError(22));
            }
            // Verify the Account's password
            account.comparePassword(req.body.password, (matchError: Error, isMatch: boolean) => {
                // If an error occured send 500 response
                if (matchError) {
                    console.error(matchError);
                    return res.sendStatus(500);
                }
                // If the passwords do not match
                if (!isMatch) {
                    return res.status(400).send(this.getError(21));
                }
                // If the Account is not yet activated
                if (!account.isActivated) {
                    return res.status(400).send(this.getError(20));
                }
                // Prepare the claims for the Account's session token
                const claims = {
                    iss: SERVER_URL,
                    scope: 'default',
                    sub: account._id,
                };
                // Generate JWT and set expiration
                const token = njwt.create(claims, this.sessionKey);
                token.setExpiration(new Date().getTime() + CONF.SESSION.LIFESPAN);
                // Create a new cookie and attach the compact token to it
                new cookies(req, res).set('session', token.compact(), {
                    secure: CONF.SESSION.SECURE,
                    httpOnly: CONF.SESSION.HTTP_ONLY,
                    sameSite: CONF.SESSION.SAME_SITE,
                } as object);
                return res.sendStatus(200);
            });
        });
    }

    /**
     * Send a 200 response if the Account has a valid session.
     * @param {Request} req - The express request object.
     * @param {Response} res - The express response object.
     * @param {NextFunction} next - The express next function.
     */
    private getSession = (req: Request, res: Response, next: NextFunction) => {
        return res.sendStatus(200);
    }

    /**
     * Delete the Account's session cookie.
     * @param {Request} req - The express request object.
     * @param {Response} res - The express response object.
     * @param {NextFunction} next - The express next function.
     */
    private deleteSession = (req: Request, res: Response, next: NextFunction) => {
        res.clearCookie('session');
        return res.sendStatus(200);
    }

    /**
     * Assign a route handler to a specific endpoint in the Express router.
     */
    private initEndpoints() {
        this.router.post('/', this.validateRequest('create'), this.create);
        this.router.get('/', this.authorize, this.get);
        this.router.put('/', this.authorize, this.validateRequest('edit'), this.edit);
        this.router.delete('/', this.authorize, this.delete);
        this.router.post('/activation', this.sendActivate);
        this.router.put('/activation', this.validateRequest('activate'), this.activate);
        this.router.post('/password', this.sendResetPassword);
        this.router.put('/password', this.validateRequest('resetPassword'), this.resetPassword);
        this.router.post('/session', this.validateRequest('login'), this.createSession);
        this.router.get('/session', this.authorize, this.getSession);
        this.router.delete('/session', this.deleteSession);
    }
}

export default new AccountsRouter().getRouter();
