import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import * as mongoose from 'mongoose';

import {ENV, CONF} from './config';

// Import the Express app to connect with an HTTP/HTTPS server
import App from './app/app';

// Define promise library for mongoose and connect to MongoDB
(mongoose as any).Promise = global.Promise;
mongoose.connect(CONF.DATABASE.URI, onDBConnect);

// Create an HTTPS server if in production, otherwise create a standard HTTP server
let server: http.Server|https.Server;
if (ENV.isProduction) {
    server = https.createServer({
        key: fs.readFileSync(CONF.SSL.KEY),
        cert: fs.readFileSync(CONF.SSL.CERT),
    }, App);
} else {
    server = http.createServer(App);
}

// Start the HTTP/HTTPS API server and listen on port
server.listen(CONF.PORT);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Output error message from the server and reason for the error.
 * @param {NodeJS.ErrnoException} error - The Node.js error object.
 * @throws Will throw an Node.js errors other than 'EACESS' or 'EADDRINUSE'.
 */
function onError(error: NodeJS.ErrnoException) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    if (error.code === 'EACCES') {
        console.error(`port ${CONF.PORT} requires elevated privileges`);
        process.exit(1);
    } else if (error.code === 'EADDRINUSE') {
        console.error(`port ${CONF.PORT} is already in use`);
        process.exit(1);
    } else {
        throw error;
    }
}

/**
 * Output messages from the database when connecting.
 * @param {NodeJS.ErrnoException} error - The Node.js error object.
 */
function onDBConnect(error: NodeJS.ErrnoException) {
    if (error) {
        console.error(`>>> Database ${error}`);
        process.exit(1);
    }
}

/**
 * Output "HTTPS Server listening on port" message if in production mode.
 * Output "HTTP Server listening on port" message otherwise.
 */
function onListening() {
    if (ENV.isProduction) {
        console.info(`>>> HTTPS Server listening on port ${CONF.PORT}`);
    } else {
        console.info(`>>> HTTP Server listening on port ${CONF.PORT}`);
    }
}
