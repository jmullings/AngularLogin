import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import expressValidator = require('express-validator');

import {CONF, ENV} from '../config';
import {Emailer} from './misc/emailer';

import AccountsRouter from './routes/accounts';

/**
 * Class representing the express web server application.
 */
class App {
    public express: express.Application;

    constructor() {
        this.express = express();
        this.initMiddleware();
        this.initEndpoints();
        // Initialize the template email module with a SendGrid API key
        Emailer.initKey(CONF.SENDGRID.KEY);
    }

    /**
     * Initialize the middleware for the Express application.
     */
    private initMiddleware() {
        this.express.use(cookieParser());
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({extended: true}));
        this.express.use(expressValidator());
        if (ENV.isProduction) {
            this.express.use(express.static(path.join(__dirname, '../public')));
        }
    }

    /**
     * Initialize the Express application's API endpoints.
     */
    private initEndpoints() {
        // Account API endpoint with router
        this.express.use('/api/v1/account', AccountsRouter);
        // Serve the index page for the single page application
        this.express.get('*', (req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.sendFile(path.join(__dirname, '../public/index.html'));
        });
    }
}

export default new App().express;
