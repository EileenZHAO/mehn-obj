/**********************************
 * 功能：未定义
 * 日期：2017/10/11
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
	else if(!validator.isLength($("#pwd-signin").val(), {min:6, max: 20})) {
		ret = false;
		alert("密码在6-20个数字或字母");
		$("#pwd-signin").focus();
		return false;
	}
	if(ret) signin();
}
function signin() {
	var para = $("#signInform").serialize();
	//alert(para);
	$.ajax({
		url: '/users/signin',
		type: 'POST',
		async: true,
		data: para,
		success: function (res) {

		}
	});
}
/**********************************
 * 功能：未定义
 * 日期：2017/10/11
 * 开发者：
 **********************************/
function validatorForm() {
	var ret = true;
	if(!validator.isMobilePhone($("#phone").val(),"zh-CN")) {
		ret = false;
		alert("手机号不正确");
		$("#phone").focus();
		return false;
	}
	else if(!validator.isLength($("#pwd").val(), {min:6, max: 20})) {
		ret = false;
		alert("密码在6-20个数字或字母");
		$("#pwd").focus();
		return false;
	}
	else if(!($("#pwd").val() === $("#repwd").val())) {
		ret = false;
		alert("两次密码不一致");
		$("#repwd").focus();
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

		}
	});
}