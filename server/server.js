/**
 * Created by jlmconsulting on 9/12/18.
 */
const compression = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const app = express();
const index = require('./routes/index');

app.set('port', (process.env.PORT || 3000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(compression());
app.use(express.static(__dirname + '/../dist/AngularLogin'));

app.get('/profile', function (req, res) {

    res.sendFile(pathFile);
});
app.get('/register', function (req, res) {

    res.sendFile(pathFile);
});
app.get('/landing', function (req, res) {

    res.sendFile(pathFile);
});

app.get('/api/v1/account/*', index);
app.post('/api/v1/account/*', index);

app.get('/*', function (req, res) {

    res.sendFile(path.join(__dirname + '/../dist/AngularLogin/index.html'));
});

/**
 * Start the app by listening on the default Heroku port, but doubled for API
 **/

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});