/* 预置系统管理员账号，
    登录名 ：admin
    密  码 ：111111 （6个一)
    将下列代码复制到mongodb的shell中执行

use admin
db.manages.insert(
     {
     "loginname" : "admin",
     "nicname":"",
     "email" : "13808013567@163.com",
     "hashed_password" : "vLFfghR5tNV3K9DKhmwArV+SbjWAcgZZzIDTnJ0JgCo="
     }
 )

 */
var mongoose = require('mongoose');
var Schema      = mongoose.Schema;

var manageSchema = new Schema({
	loginname: {type: String, required: true, unique: true},
	nicname: {type: String},
	hashed_password: {type: String, required: true},
	email: {type: String, required: true, unique: true},
	createAt: {type: String, default: Date.now},
});


var Manage = mongoose.model('Manage', manageSchema);
module.exports = Manage;
