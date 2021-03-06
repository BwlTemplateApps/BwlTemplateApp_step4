/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

var routes = require('./routes/index');
var hbs = require('express-handlebars');
var myhelpers = require('./views/myhelpers');
var bodyParser = require('body-parser');

// create a new express server
var app = express();

// view engine setup
app.engine('hbs', hbs({
	extname: 'hbs', 
	defaultLayout: 'layout', 
	layoutsDir: __dirname + '/views/layouts/',
    helpers: myhelpers
}));
app.set('views', __dirname + '/views/');
app.set('view engine', 'hbs');

// serve the files out of ./public as our main files
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', routes);
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
