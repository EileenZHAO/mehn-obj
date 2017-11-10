var express = require('express');
var cmsModel = require('../models/cms.js');
var formidable = require('formidable');



var router = express.Router();



// GET
router.get('/get-cms-list', getCmsList);

router.get('/list', function (req, res) {
	if(req.session.role == "manager") {
		return res.render("cms/list", {layout: 'manage'});
	}
	else {
		res.render("cms/list");
	}
});

router.get('/add', function (req, res) {
	res.render("cms/add");
});

router.get('/show-info/:id', showInfo);

router.get('/delete-info/:id', deleteInfo);


// POST

router.post('/add', addinfo);

router.post('/save-info', saveInfo);






// function

function getCmsList(req, res) {
	var data = {};
	cmsModel.find({}, function (err, cms) {
		if(err) {
			data = {
				code: 0,
				msg: err
			};
		}
		else {
			data = {
				code: 1,
				cms: cms
			};
			if(req.session.role) {
				data.role = req.session.role;
			}
			console.log("角色======", data.role);
		}
		return res.send(data);
	});
}

function addinfo(req, res) {
	console.log(req.body);
	let cms = new cmsModel({url: req.body.url});
	cms.set({
		classTitle: req.body.classTitle,
		title: req.body.title,
		author: req.body.author,
		content: req.body.content
	});

	cms.save(function(err) {
		if(err) {
			console.log(err);
		}
		else {
			let retData = {
				code: 1,
				msg: "Success",
				url: '/cms/list'
			};
			req.session.url = req.body.url;
			return res.send(retData);
		}
	});
}

function showInfo(req, res) {
	let retData = {};
	cmsModel.find({_id: req.params.id}, function (err, cms) {
		if(err) {
			console.log(err);
		}
		else {
			retData.code = 1;
			retData.msg = "Success";
			retData.url = 'cms/list';
			retData.cms = cms;
		}
		return res.send(retData);
	});
}

function deleteInfo(req, res) {
	let retData = {};
	cmsModel.remove({_id: req.params.id}, function (err, cms) {
		if(err) {
			retData.code = 0;
			retData.msg = err;
		}
		else {
			retData.code = 1;
			retData.cms = cms;
			retData.url = "cms/list";
		}
		return res.send(retData);
	});
}

function saveInfo(req, res) {
	cmsModel.update({url: req.body.url},
		{$set: {
			classTitle: req.body.classTitle,
			title: req.body.title,
			content: req.body.content,
			url: req.body.url,
			author: req.body.author,
			isShow: req.body.isShow,
			update: true
			}
		},
		{upsert: false, multi: false}).exec(function (err, cms) {
		if(err) {
			console.log(err);
		}
		else {
			let retData = {
				code: 1,
				url: "/cms/list"
			}
			return res.send(retData);
		}
	})
}

module.exports = router;