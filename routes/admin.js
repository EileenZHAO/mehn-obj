var express = require('express');
var adminModel = require('../models/admin.js');
var pubfun    = require('../lib/common.model.js')

var router = express.Router();

router.get('/', function (req, res) {
	res.render('admin/login', {layout: null});
});
// 新增注释
// 退出登录
router.get('/sign-out', function(req, res) {
	req.session.role = null;
	return res.redirect('/');
});

router.get('/dashboard', authorize, dashboard);



router.post('/login', getLogin);




function getLogin(req, res) {
	console.log(req.body);
	var data;
	adminModel.find({
		loginname: req.body.loginname,
		hashed_password: pubfun.hashPW(req.body.loginpwd)
	}, function (err, manages) {
		if(err) {
			console.log(err);
		}
		else{
			if (manages.length > 0) {
				req.session.role = 'manager';
				data = {
					layout:'manage',
					code: 1,
					url: '/admin/dashboard',
					msg: '登录成功！'
				};
				res.render('admin/dashboard',data);
			}
			else {
				data = {
					layout: null,
					code: 0,
					url: '/manage/',
					errMsg: '登录名或密码错误！'
				};
				res.render('admin/login',data);
			}
		}
	});

}

// 主控台
function dashboard(req, res) {
	res.render('admin/dashboard', {layout: 'manage'});
}



// 验证管理员是否登录
function authorize(req, res, next) {
	if(req.session.role) return next();
	res.redirect(303, '/unauthorized');
}


module.exports = router;
