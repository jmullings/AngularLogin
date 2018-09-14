/**
 * Created by jlmconsulting on 9/12/18.
 */

const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const app = express();

/**
 * An extremely basic server necessary for the hosting of app on Heroku
 */
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/dist/AngularLogin'));
app.get('/*', function (req, res) {

    res.sendFile(path.join(__dirname + '/dist/AngularLogin/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
