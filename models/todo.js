var mongoose = require('mongoose');
var Schma = mongoose.Schema;


var blogSchema = new Schma({
	taskTitle: {type: String},
	task: {type: String, required: true},
	author: {type: String, required: true},
	deadline: {type: Date, required: true},
	isComplete: {type: Number, default: false},
	createdAt: {type: Date, default: (new Date()).valueOf()},
});

var todo = mongoose.model('todo', blogSchema);
module.exports = todo;