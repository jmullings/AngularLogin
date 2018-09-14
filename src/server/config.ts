/*
 * NOTE: THIS SECTION OF THE CONFIGURATION DETERMINES THE PROGRAM'S EXECUTION ENVIRONMENT. IT IS MODIFIED BY "gulp-preprocess" AND SHOULD
 * NOT BE MODIFIED MANUALLY.
 *
 * Value of 'environment' is set to 'DEV' without any modifications.
 * Value of 'environment' is set to 'PROD' when modified by "gulp-preprocess".
 */
let environment = 'PROD';

// @ifndef ENV_PROD
environment = 'DEV';
// @endif

export const ENV = {
    isDevelopment: environment === 'DEV',
    isProduction: environment === 'PROD',
};

/*
 * WARNING: THIS SECTION OF THE CONFIGURATION IS AN EXAMPLE! PLEASE MODIFY THESE SETTINGS AND THEIR VALUES ACCORDINGLY FOR YOUR APPLICATION.
 */

/* Developer configuration settings */
const CONF_DEV = {
    PORT: 8080,
    DATABASE: {
        URI: 'mongodb://localhost:27017/demo',
    },
    SENDGRID: {
        KEY: '',
    },
    SESSION: {
        SECURE: false,
        HTTP_ONLY: true,
        SAME_SITE: true,
        LIFESPAN: 36000000,
    },
    SSL: {
        KEY: '',
        CERT: '',
    },
};

/* Production configuration settings */
const CONF_PROD = {
    PORT: 443,
    DATABASE: {
        URI: '',
    },
    SENDGRID: {
        KEY: '',
    },
    SESSION: {
        SECURE: true,
        HTTP_ONLY: true,
        SAME_SITE: true,
        LIFESPAN: 36000000,
    },
    SSL: {
        KEY: './server.key.pem',
        CERT: './server.crt.pem',
    },
};

export const CONF = (environment === 'DEV' ? CONF_DEV : CONF_PROD);
