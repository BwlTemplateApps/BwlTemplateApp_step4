var express = require('express');
var router = express.Router();
var bwlapi = require('./bwlapi');

/* ----------------------------------
   showing some info during routing
   ---------------------------------- */
var loginfo = function (req, res, next) {
  var method = req.method;
  console.log('INFO('+method+') ------------------------------');
  console.log('INFO('+method+') host: '+req.hostname+' url: '+req.originalUrl+' base-url: '+req.baseUrl);
  console.log('INFO('+method+') params: '+JSON.stringify(req.params)); // parameters from route such as /test/<id>
  console.log('INFO('+method+') query: '+JSON.stringify(req.query)); // string parameters such as ?id=123
  console.log('INFO('+method+') body: '+JSON.stringify(req.body)); // post arguments
  next();
}
router.use(loginfo);

/* ==================================
   BWL response handle function
   ================================== */
var handleBWLResponse = function (resData) {
//  if (resData.status >= 200 && resData.status < 300) {}
  if ('content-type' in resData.headers) {
	var ct = resData.headers['content-type'];
	if (/^application\/json/.test(ct)) {
		try{
			resData.data = JSON.parse(resData.data);   // convert buffer data to json
			resData.contentType = "JSON";
		} catch(e){
			//JSON parse error: e
			resData.data = resData.data.toString('utf8');
			resData.contentType = "error-JSON";
		}
	} else if (/^text/.test(ct)) {
		resData.data = resData.data.toString('utf8');
		resData.contentType = "Text";
	} else if (/^image/.test(ct)) {
		resData.data = resData.data.toString('base64');
		resData.contentType = "Image";
	} else if (/^application\/pdf/.test(ct)) {
		resData.contentType = "PDF";
		resData.data = resData.data.toString('base64');
	} else {
		resData.data = resData.data.toString('utf8');
		resData.contentType = "other";
	}
  } else if ('content-length' in resData.headers && resData.headers['content-length'] == 0) {
    resData.data = "No content returned";
    resData.contentType = "empty";
  } else {
		try{
			resData.data = JSON.parse(resData.data);
			resData.contentType = "JSON";    // might be JSON or text
		} catch(e){
			resData.data = resData.data.toString('utf8');
			resData.contentType = "unknown";
		}
  }
  return resData;
}; 

/* ==================================
   Pages
   ================================== */
router.get('/', function(req, res, next) {
	res.redirect('/welcome');
});

router.get('/welcome', function(req, res, next) {
	res.render('welcome', {title: 'BWL Template Application'});
});

router.post('/login', function(req, res, next) {
	var reqData = {
		'method': 'get',
		'host': 'www.blueworkslive.com',
		'path': '/api/Auth?version=20091212',
		'login': req.body.login,
		'password': req.body.password
	}
	console.log("login: "+req.body.login);
	bwlapi.callAPI(req, res, reqData, function (req, res, resData) {
		console.log("BWL response received for auth request");
		handleBWLResponse(resData);
		res.render('accountinfo', {
			title: 'BWL Account Information',
			status: resData.status,
			user: req.body.login,
			dat: resData.data
		});
	});
});

module.exports = router;
