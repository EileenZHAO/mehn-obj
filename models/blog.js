/* 预置Cms信息，
  //集合名默认是带s的，但cms这个model已有s所以如果手动插入时不能再加s(也就是说不能是cmss)

  use admin
  db.blogs.insert(
      {
       title: "相关信息",
       content:"“以前天气预报发布的，从时间和空间上来讲，还是比较粗放的，可能在时间上，大家都听着是24小时天气怎么样，48小时天气怎么样，从空间上讲，目前大家每天看天气预报，成都地区也就是以市区、区县这样的发布形式，在引进这两套精细化预报平台以后，我们从时间和空间上得到了一个很大的提高。空间上，因为这个平台还在试运行中，理论上我们已经达到了接近3—5公里的预报水平，也就是说以后大家看预报是你所处的位置，根据你的手机定位，最近的一个点预报的情况。目前功能上可以达到每15分钟预报一次。”成都市气象局副巡视员金基槐表示，我国西南地区春秋多夜雨，前几年因为整个气侯的变化，夜雨少了一些，而今年的状态其实很正常。从另一个角度来说，秋季晚上下雨对空气质量是个好事情。",
       author: "====关于我们=====",
       comment:"========================",
       like: "543"
      }
  )
 */
var mongoose = require('mongoose');
var Schma = mongoose.Schema;


var blogSchema = new Schma({
	title: {type: String, required: true, unique: true},
	content: {type: String},
	author: {type: String, required: true},
	picture: {type: String, default: "data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="},
	comment: {type: Object, default: []},
	like: {type: Object, default: []},
	uv: {type: Object, default: []},
	isShow: {type: Number, default: 0},
	createdAt: {type: Date, default: (new Date()).valueOf()},
});

var Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;