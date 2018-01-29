
/**
 * 本js定义了多个对原始js对象的patch
 * 1、字符串去前后空格
 * 2、数组移除指定范围内的元素,返回剩余元素个数
 * 3、字符串替换所有指定内容 
 */
 
/**
 * 字符串去前后空格
 * @return {}
 */
String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, "");
};

/**
 * 数组移除指定范围内的元素,返回剩余元素个数
 * @param {} from
 * @param {} to
 * @return {}
 */
Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};

/**
 * 为数组添加多个对象
 * @param {} from
 * @param {} to
 * @return {}
 */
Array.prototype.pushAll = function(arrayObjects) {
    return this.concat(this, arrayObjects);
};

/**
 * 字符串替换所有指定内容 
 * @param {} from
 * @param {} to
 * @return {}
 */
String.prototype.replaceAll = function(from, to) {
	return this.replace(new RegExp(from, "gm"), to);
};

/**
 * 判断本字符串是否以指定字符串开头
 * @param {} str
 * @return {}
 */
String.prototype.startWith = function(str) {
    return this.indexOf(str) == 0;
//	var reg = new RegExp("^" + str);
//	return reg.test(this);
}

/**
 * 判断本字符串是否以指定字符串结尾
 * @param {} str
 * @return {}
 */
String.prototype.endWith = function(str) {
    return this.indexOf(str, this.length - str.length) !== -1;
//	var reg = new RegExp(str + "$");
//	return reg.test(this);
}