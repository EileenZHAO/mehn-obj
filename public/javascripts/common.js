
/***
 * 功能：格式化日期
 ***/

function formatDate(dt) {
	//console.log(dt);
	var newDate = new Date(dt)
	var	getYear = newDate.getFullYear(),
		getMonth = newDate.getMonth() + 1,
		getDay = newDate.getDate(),
		getHour = newDate.getHours(),
		getMinute = newDate.getMinutes(),
		getSecond = newDate.getSeconds();

	var newMonth = getMonth < 9 ? "0" + getMonth : getMonth;
	var newDay = getDay < 10 ? "0" + getDay : getDay;
	var newHour = getHour < 10 ? "0" + getHour : getHour;
	var newMinute = getMinute < 10 ? "0" + getMinute : getMinute;
	var newSecond = getSecond < 10 ? "0" + getSecond : getSecond;

	return getYear + "-" + newMonth + "-" + newDay + "  " + newHour + ":" + newMinute + ":" + newSecond;
}