var express = require('express');
// 验证码
var svgCaptcha = require('svg-captcha');


var credentials = require('../credentials.js');
var emailService = require('../lib/email.js')(credentials);

var router = express.Router();

// 路由
router.get('/captcha', function (req, res) {
	var captcha = svgCaptcha.create();
	req.session.captcha = captcha.text;

	res.type('svg');
	res.status(200).send(captcha.data);
});


router.get('/', function(req, res){
	res.render('home');
});

router.get('/about', function(req, res){

	// first step
	//res.render('about', {users: [{name: "eileen", age: 24}, {name: "eric", age: 25}]});

	// second step
	// res.render('about', {users: "Obama"});

	// third step
	res.render('about');
});

router.get('/contact', function(req, res){
	res.render('contact');
});

router.get('/unauthorized', function (req, res) {
	res.status(403).render('unauthorized', {layout: null});
});


router.get('/getinfo', function(req, res) {
	var _callback = req.query.callback;

	var  _data = { phone: '(028) 23412234', name: 'Bill Node.js' };
	if ( _callback ){
		res.type('text/javascript');
		res.send(_callback + '(' + JSON.stringify(_data) + ')');
}
	else{
		res.json(_data);
	}
});



router.post('/send-email', function (req, res) {
	emailService.send(req.body.to, req.body.subj, req.body.body);
});





module.exports = router;
