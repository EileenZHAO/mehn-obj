var express = require('express');

var mongoose = require('mongoose');
var validator = require('validator');
var pubfun    = require('../lib/common.model.js')
var credentials = require('../credentials.js');
var emailService = require('../lib/email.js')(credentials);
var userModel = require('../models/user.js');
var formidable = require('formidable');
var fs = require('fs');
const  AVATAR_UPLOAD_FOLDER = '/avatar/';


var router = express.Router();
// GET

// get里面的signin要以斜杠开头，vender里面不要斜杠
router.get('/signin', function(req, res) {
	res.render("users/signin");
});

router.get('/signup', function(req, res) {
	res.render("users/signup");
});

router.get('/list', function(req, res) {

	if(req.session.role == "manager") {
		res.render("users/list", {layout: 'manage'});
	}
	else {
		res.render("users/list");
	}
});

router.get('/profile', getProfile);


router.get('/show-user/:id', showUsers);

router.get('/delete-user/:id', deleteProfile);

// POST

router.post('/signin', checkCaptcha, signin)

router.post('/signup', checkPhone, checkPassword, checkCaptcha, signup);

router.post('/get-users-list', getUsersList);

router.post('/upload-profile/:UID/:year/:month/:timestr', uploadProfile);

router.post('/save-profile', saveprofile);






function checkPhone(req, res, next) {
	let retData = {};
	if(!validator.isMobilePhone(req.body.phone, "zh-CN")) {
		retData.code = 0;
		retData.msg = "请输入正确的电话号码";
		return res.send(retData);
	}
	next();
}

function checkPassword(req, res, next) {
	let retData = {};
	if(!validator.isLength(req.body.pwd, {min: 6, max: 20}) && (req.body.pwd !== req.body.repwd)) {
		retData.code = 0;
		retData.mes = "密码在6-20个数字或字母，两次密码必须一致";
		return res.send(retData);
	}
	next();
}


function checkCaptcha(req, res, next) {
	let retData = {};
	if(req.body.captcha.toLowerCase() !== req.session.captcha.toLowerCase()) {
		retData.code = 0;
		retData.mes = "验证码错误";
		return res.send(retData);
	}
	next();
}

function signin(req, res) {
	console.log("signin===",req.body);

	userModel.find({
		phone: req.body.phone,
		hashed_password: pubfun.hashPW(req.body.pwd)
	},function (err, users) {
		if(err) {
			console.log(err);
		}
		else {
			let retData = {
				code: 1,
				msg: "Success",
				url: '/users/profile',
				users: users
			};
			req.session.nickName = users[0].nickName;
			req.session.phone = req.body.phone;
			return res.send(retData);
		}
	});
}

function signup(req, res) {
	/*let retData = req.body;
	console.log(retData);
	return res.send(retData);*/
	let user = new userModel({phone: req.body.phone});
	user.set('hashed_password', pubfun.hashPW(req.body.pwd));
	user.set('email', req.body.phone + "@xxx.com");

	user.save(function (err, user) {
		if(err) {
			console.log(err);
		}
		else {
			let retData = {
				code: 1,
				msg: "Success",
				url: '/users/profile'
			};
			req.session.phone = req.body.phone;
			return res.send(retData);
		}
	});
}

// 获取用户列表
function getUsersList(req,res) {
	var data = {};
	userModel.find({},function (err,users) {
		if(err) { console.log(err); }
		else
		{
			data = {
				code: 1,
				users: users
			};
			if(req.session.role) {
				data.role = req.session.role;
			}
			console.log("角色======", data.role);
			return res.send(data);
		}
	});
}


function getProfile(req,res){
	if(req.session.phone)
	{
		userModel.find({phone:req.session.phone},
			function (err,users) {
				if(err){console.log(err);}
				else{
					var retData = {
						users:users
					};
					var now = new Date();
					retData.UID = req.session.phone;
					retData.year    = now.getFullYear();
					retData.month   = now.getMonth();
					retData.timestr = Date.now();
					//console.log("xhr===",req.xhr)
					if(req.xhr){res.send(retData);} else{
						res.render("users/profile", retData);
					}

				}
			});
	}
}

// 上传文件处理（安装插件“npm i formidable --save”）
function uploadProfile(req, res) {
	console.log(req.body);
	var form = new formidable.IncomingForm();
	form.encoding = 'utf-8';		//设置编辑
	form.uploadDir = 'public' + AVATAR_UPLOAD_FOLDER;	 //设置上传目录
	form.keepExtensions = true;	 //保留后缀
	form.parse(req, function(err, fields, files){
		if(err) return res.redirect(303, '/error');

		var extName = '';  //后缀名
		switch (files.photo.type) {
			case 'image/pjpeg':
				extName = 'jpg';
				break;
			case 'image/jpeg':
				extName = 'jpg';
				break;
			case 'image/png':
				extName = 'png';
				break;
			case 'image/x-png':
				extName = 'png';
				break;
		}
		console.log(files);
		//req.params.timestr
		var newPath = 'public/avatar_2/'+req.params.timestr+"."+extName;

		fs.renameSync(files.photo.path, newPath);  //重命名
		//console.log(files.photo.path+"-----"+files.photo.name +"###"+ extName +"==="+req.params.year);
		//console.log('received fields:');
		var imgpath='/avatar_2/'+req.params.timestr+"."+extName;
		updateProfilePicture (req.params.UID,imgpath);

		//var data = {imgpath:imgpath};
		return  res.redirect('/users/profile?imgpath='+imgpath);
		// return  res.send(data);

	});
}


//更新个人俏像
function updateProfilePicture (UID,imgpath) {
	var data = {};

	userModel.update({phone: UID},
		{$set:{picture:imgpath,
			update:true}},
		{upsert:false,multi:false})
		.exec(function (err,users) {
			if(err){
				data = {msg: 'Update failure for ' + UID,code:'0'};
			}else {

				data = {msg: 'Update successful for ' + UID,code:'1'};
			}
			// res.send(data);
		});
}


function saveprofile(req, res) {
	userModel.update({phone: req.body.phone},
		{$set: {
			gender: req.body.gender,
			realName: req.body.realname,
			nickName: req.body.nickname,
			age: req.body.age,
			address: req.body.address,
			update: true
				}
		},
		{upsert: false, multi: false}).exec(function (err, users) {
		if(err) {
			console.log(err);
		}
		else {
			let retData = {
				code: 1,
				url: "/users/profile"
			}
			return res.send(retData);
		}
	})
}

function showUsers(req, res) {
	let retData = {};
	userModel.find({_id: req.params.id}, function (err, users) {
		if(err) {
			retData.code = 0;
			retData.msg = err;
		}
		else {
			retData.code = 1;
			retData.msg = "Success",
			retData.url = "users/list";
			retData.users = users;
		}
		return res.send(retData);
	});
}

function deleteProfile(req, res) {
	let retData = {};
	userModel.remove({_id: req.params.id}, function (err, users) {
		if(err) {
			retData.code = 0;
			retData.msg = err;
		}
		else {
			retData.code = 1;
			retData.msg = users;
			retData.url = "users/list";
		}
		return res.send(retData);
	});
}

module.exports = router;