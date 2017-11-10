var express = require('express');
var blogModel = require('../models/blog');

var router = express.Router();

// GET
router.get('/get-blog-list', getBlogList);

router.get('/list', function (req, res) {
	if(req.session.role == "manager") {
		return res.render("blog/list", {layout: 'manage'});
	}
	else {
		res.render("blog/list");
	}
});

router.get('/add', function (req, res) {
	res.render("blog/add");
});

router.get('/delete-blog/:id', deleteBlog);

router.get('/show-blog/:id', showBlog);

router.get('/blog-detail/:id', getBlogDetail);

router.get('/get-blog-content/:id', getBlogContent);



// POST
router.post('/add', addBlog);

router.post('/save-blog', saveBlog);

router.post('/send-comment', sendComment);




// function
function getBlogList(req, res) {
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
			if(req.session.role) {
				data.role = req.session.role;
			}
			console.log("角色======", data.role);
		}
		return res.send(data);
	});
}

function addBlog(req, res) {
	//console.log(req.body);
	let blog = new blogModel({title: req.body.title});
	blog.set({
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		like: req.body.like,
		comment: req.body.comment
	});

	blog.save(function(err) {
		if(err) {
			console.log(err);
		}
		else {
			let retData = {
				code: 1,
				msg: "Success",
				url: '/blog/list'
			};
			//console.log(retData);
			req.session.title = req.body.title;
			return res.send(retData);
		}
	});
}

function deleteBlog(req, res) {
	let retData = {};
	blogModel.remove({_id: req.params.id}, function (err, blog) {
		if(err) {
			console.log(err);
		}
		else {
			retData.code = 1;
			retData.blog = blog;
			retData.url = "blog/list";
		}
		return res.send(retData);
	});
}

function showBlog(req, res) {
	let retData = {};
	blogModel.find({_id: req.params.id}, function (err, blog) {
		if(err) {
			console.log(err);
		}
		else {
			retData.code = 1;
			retData.blog = blog;
			retData.url = "blog/list";
		}
		return res.send(retData);
	});
}

function saveBlog(req, res) {
	let retData = {};
	blogModel.update({title: req.body.title},
		{$set: {
			title: req.body.title,
			content: req.body.content,
			author: req.body.author,
			like: req.body.like,
			comment: req.body.comment,
			isShow: req.body.isShow,
			update: true
			}
		},
		{upsert: false, multi: false}).exec(function (err, blog) {
		if(err) {
			console.log(err);
		}
		else {
			retData.code = 1;
			retData.url = "blog/list";
			return res.send(retData);
		}
	});
}

function getBlogDetail(req, res) {
	blogModel.find({_id: req.params.id}, function (err, blog) {
		var context = {
			title: blog[0].title,
			content: blog[0].content,
			comment: blog[0].comment[0].content
		};
		if(err) {
			console.log(err);
		}
		else {
			//console.log(blog)
			res.render("blog/blog-detail", context);
		}
	});
}

function getBlogContent(req, res) {
	blogModel.find({_id: req.params.id}, function (err, blog) {
		//console.log(req.params.id)
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

function sendComment(req, res) {
	blogModel.find({_id: req.body.blogid}, function (err, blog) {
		if(err) {
			console.log(err);
		}
		else {
			//console.log("blog",blog[0]);
			let commentArr = getCommentArr(blog[0].comment, req.body.blogid, req.body.comment);
			updataComment(req.body.blogid, commentArr);
			let retData = {
				code: 1,
				url: "api/blogs",
				blog: blog
			}
			return res.send(retData);
		}
	})
}

function getCommentArr(commentArray, blogid, commentContent) {
	console.log(commentArray)
	let obj = {
		id: blogid,
		content: commentContent
	}
	commentArray.push(obj);
	return commentArray;
}

function updataComment(blogid, commentArr) {
	blogModel.update({_id: blogid},
		{
			$set: {
				comment: commentArr,
				update: true
			}
		},
		{upsert: false, multi: false}).exec(function (err, blog) {
		if(err) {
			console.log(err);
		}
		else {

		}
	});
}


module.exports = router;