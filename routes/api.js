var express = require('express');

var blogModel = require('../models/blog');
var userModel = require('../models/user.js');
var captchaModel = require('../models/captcha');
var validator = require('validator');
var svgCaptcha = require('svg-captcha');
var pubfun    = require('../lib/common.model.js');
var formidable = require('formidable');
var fs = require('fs');
const  AVATAR_UPLOAD_FOLDER = '/avatar/';



var router = express.Router();

router.get('/blogs', function(req, res) {
	res.render("blog/blogs");
});
router.get('/blogs-list', getBlogs);

router.get('/get-users-list', getUsersList);

router.get('/get-blog-content/:id', getBlogContent);

router.get('/captcha', getCaptcha);

router.get('/profile/:id', getProfile);

router.post('/signin', checkCaptcha, signin);

router.post('/signup', checkPhone, checkPassword, checkCaptcha, signup);

router.post('/save-profile', saveprofile);

router.post('/upload-profile/:UID/:year/:month/:timestr', uploadProfile);



// function
function getBlogs(req, res) {
	/*//console.log("===========fddfsdkghhsg");
	var data = {};
	blogModel.find({}, function (err, blog) {
		if(err) {
			data = {
				code: 0,
				msg: err
			};
		}
		else {
			data = {
				code: 1,
				blog: blog
			};
		}
		return res.send(data);
	});*/
	let retData = {};
	blogModel.aggregate([{
		$lookup: {
			from: "users",
			localField: "author",
			foreignField: "nickName",
			as: "out"
		}
	}], function (err, out) {
		if(err) {
			retData.code = 0;
			retData.msg = err;
		}
		else {
			retData.code = 1;
			retData.role = req.session.role;
			retData.blog = out;
		}
		return res.send(retData);
	})
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

// 获取博客列表
function getBlogContent(req, res) {
	blogModel.find({_id: req.params.id}, function (err, blog) {
		if(err) {
			console.log(err);
		}
		else {
			let retData = {
				code: 1,
				blog: blog,
			}
			return res.send(retData);
		}
	});
}

//检查验证码
function checkCaptcha(req, res, next) {
	captchaModel.findOne({captcha: req.body.captcha.trim().toLowerCase()}, function (err, data) {
		if(err) {
			console.log(err);
		}
		else {
			let retData = {};
			if(data){
				if( (data.captcha.trim().toLowerCase()) !==
					(req.body.captcha.trim().toLowerCase()))
				{
					console.log("=====checkeCaptcha===000000");
					retData.code = 0;
					retData.msg = '请检查验证码是否正确！';
					return res.send(retData);
				}
				else{
					console.log("=====checkeCaptcha===1111111");
					retData.code = 1;
					retData.msg = '验证码正确！';
					next();
					//return res.send(retData);
				}
			}
			else
			{
				console.log("=====checkeCaptcha===22222");
				retData.code = 0;
				retData.msg = '请检查验证码是否正确！或你的验证码过期，请点击验证码图片重新获取！';
				return res.send(retData);
			}
		}
	});
}

// 电话号码
function checkPhone(req, res, next) {
	let retData = {};
	if(!validator.isMobilePhone(req.body.phone, "zh-CN")) {
		retData.code = 0;
		retData.msg = "请输入正确的电话号码";
		return res.send(retData);
	}
	next();
}

// 密码
function checkPassword(req, res, next) {
	let retData = {};
	if(!validator.isLength(req.body.pwd, {min: 6, max: 20}) && (req.body.pwd !== req.body.repwd)) {
		retData.code = 0;
		retData.mes = "密码在6-20个数字或字母，两次密码必须一致";
		return res.send(retData);
	}
	next();
}

// 登录
function signin(req, res) {
	//console.log("signin===",req.body);

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
			// req.session.phone = req.body.phone;
			delCaptcha();
			return res.send(retData);
		}
	});
}

// 注册
function signup(req, res) {
	let user = new userModel({phone: req.body.phone});
	user.set('hashed_password', pubfun.hashPW(req.body.pwd));
	user.set('email', req.body.phone + "@xxx.com");

	user.save(function (err) {
		if(err) {
			console.log(err);
		}
		else {
			let retData = {
				code: 1,
				msg: "Success",
				url: '/users/profile',
				data: req.body.phone
			};
			delCaptcha();
			// req.session.phone = req.body.phone;
			return res.send(retData);
		}
	});
}

//验证码路由回调函数
function getCaptcha(req,res){
	var text = svgCaptcha.randomText();
	req.session.captcha = text;
	var captcha = svgCaptcha(text);

	var _captcha = new captchaModel({captcha: text.trim().toLowerCase()});

	_captcha.save( function(err,data) {
		if(err)
		{
			//console.log(err);
		}
		else{
			// console.log("data------",data);
		}
	});

	res.set('Content-Type', 'image/svg+xml');
	res.status(200).send(captcha);
}

//删除之前的验证码
function delCaptcha() {
	captchaModel.remove(
		{createdAt: { $lt : Date.parse(new Date())} },
		function(err){
			if(err)
			{
				console.log(err);
				//return  res.send();
			}
		})
}


function getProfile(req,res){
	if(req.params.id)
	{
		userModel.findOne({phone: req.params.id},
			function (err,users) {
				if(err){console.log(err);}
				else{
					var retData = {
						code: 1,
						users:users
					};
					var now = new Date();
					retData.UID = req.params.id;
					retData.year    = now.getFullYear();
					retData.month   = now.getMonth();
					retData.timestr = Date.now();
				}
				return res.send(retData);
			});
	}
}

function saveprofile(req, res) {
	let retData = {};
	userModel.update({phone: req.body.phone},
		{$set: {
			gender: req.body.gender,
			realName: req.body.realname,
			nickName: req.body.nickname,
			email: req.body.email,
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
			retData = {
				code: 1,
				url: "/users/profile",
				users: users
			}
		}
		return res.send(retData);
	})
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

		var data = {imgpath:imgpath};
		//return  res.redirect('/users/profile?imgpath='+imgpath);
		 return  res.send(data);

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


module.exports = router;