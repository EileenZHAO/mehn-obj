/**********************************
 * 功能：未定义
 * 日期：2017/10/13
 * 开发者：
 **********************************/
function validatorFormtwo() {
	var ret = true;
	if(!validator.isMobilePhone($("#phone-signin").val(),"zh-CN")) {
		ret = false;
		alert("手机号不正确");
		$("#phone-signin").focus();
		return false;
	}
	if(!validator.isLength($("#pwd-signin").val(), {min:6, max: 20})) {
		ret = false;
		alert("密码在6-20个数字或字母");
		$("#pwd-signin").focus();
		return false;
	}
	if($("#captcha").val().length !== 4) {
		ret = false;
		$("#captchaErro").addClass("erroMsg").text("验证码不能为空");
		$("#captcha").focus();
		return false;
	}
	if(ret) signin();
}
function signin() {
	var para = $("#signInform").serialize();
	alert(para);
	$.ajax({
		url: '/users/signin',
		type: 'POST',
		async: true,
		data: para,
		success: function (res) {

			if(parseInt(res.code) === 0) {
				alert(res.msg);
			}
			if(parseInt(res.code) === 1) {
				console.log(res.users[0].nickName);
				localStorage.setItem("nickName", res.users[0].nickName);
				window.location.href = res.url;
			}
		}
	});

}

// 点击刷新验证码
function getCaptcha() {
	var captchaUrl = '/captcha?t='+ Date.now() + Math.random();
	$("#captchaImg").attr("src", captchaUrl);
}