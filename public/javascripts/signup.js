
/**********************************
 * 功能：未定义
 * 日期：2017/10/13
 * 开发者：
 **********************************/
function validatorForm() {
	var ret = true;
	if(!validator.isMobilePhone($("#phone").val(),"zh-CN")) {
		ret = false;
		$("#phoneErro").addClass("erroMsg").text("手机号不正确");
		$("#phone").focus();
		return false;
	}
	if(!validator.isLength($("#pwd").val(), {min:6, max: 20})) {
		ret = false;
		$("#pwdErro").addClass("erroMsg").text("密码在6-20个数字或字母");
		$("#pwd").focus();
		return false;
	}
	if(!($("#pwd").val() === $("#repwd").val())) {
		ret = false;
		$("#repwdErro").addClass("erroMsg").text("两次密码不一致");
		$("#repwd").focus();
		return false;
	}
	if($("#captcha").val().length !== 4) {
		ret = false;
		$("#captchaErro").addClass("erroMsg").text("验证码不能为空");
		$("#captcha").focus();
		return false;
	}
	if(ret) signup();
}
function signup() {
	var para = $("#signUpform").serialize();
	//alert(para);
	$.ajax({
		url: '/users/signup',
		type: 'POST',
		async: true,
		data: para,
		success: function (res) {
			//console.log(res);
			if(parseInt(res.code) === 0) {
				alert(res.msg);
			}
			if(parseInt(res.code) === 1) {
				window.location.href = res.url;
			}

		}
	});
}

$("#phone").keyup(function () {
	var ret = false;
	if(validator.isMobilePhone($("#phone").val(),"zh-CN")) {
		ret = true;
		$("#phoneErro").removeClass("erroMsg");
		return true;
	}
});

$("#pwd").keyup(function () {
	var ret = false;
	if(validator.isLength($("#pwd").val(), {min:6, max: 20})) {
		ret = true;
		$("#pwdErro").removeClass("erroMsg");
		return true;
	}
});

$("#repwd").keyup(function () {
	var ret = false;
	if($("#pwd").val() === $("#repwd").val()) {
		ret = true;
		$("#repwdErro").removeClass("erroMsg");
		return true;
	}
});

$("#captcha").keyup(function () {
	var ret = false;
	if($("#captcha").val().length == 4) {
		ret = true;
		$("#captchaErro").removeClass("erroMsg");
		return true;
	}
});






// 点击刷新验证码
function getCaptcha() {
	var captchaUrl = '/captcha?t='+ Date.now() + Math.random();
	$("#captchaImg").attr("src", captchaUrl);
}