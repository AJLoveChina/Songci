/*jslint browser : true*/
/*global $, jquery, c : true, console*/
/*jslint plusplus : true*/
/*
	写这篇文章的目的有俩个：
	1.Js做词频统计，数据挖掘也是刚刚的，Js开发者要有自信！
	2.去年11月份我写了这个算法，今天优化一下，性能提高了100~300倍，希望咱们搞前端开发的读者认识算法优化的重要性;
	2015.8.1 AJ All Rights Not Reserved ^_^
*/
(function () {
	"use strict";
	var yy = {};
	window.onload = function () {
		yy.innitial();
	};
	yy.innitial = function () {
		c = c.replace(/[,，。、”“【】》（）？《:：\.\(\)\?\]\[\d\s]/g, '');	//正则表达式去除不合理字符
		yy.one = []; 	 //一个字个数，二个字的个数，变量。
		yy.two = [];	// 模式   
	};
	yy.main = function (val) {		// val == 1,统计单字；val==2，统计双字
		var index,					// 用来遍历语料库的索引值
			length = c.length,		// 语料库的长度
			arr = [],				// 每个单字或双字以 {word:'好',num:110} 的格式放入该数组中--num表示出现次数
			nowStr = "",			// 每次遍历截取的字符串
			find = false,			// 每次遍历是否找到一个新词
			i,						// 多个循环都用到的索引值
			len,					// arr 经过处理后的长度（处理只是简单的去除出现次数小于5的词或字）
			strArr = [],
			shanchu = 0,
			prop = {},				// 优化后的方案，用键值来索引字或词
			propKeys = [],			// prop对象的键值组成的数组
			popOneFromPropKeys,
			method = 2,				// 本demo中包含俩种处理方法， method 1 和2， 2是优化后的方法，用于读者了解算法优化的重要性
			time = + new Date();	// 分析时间性能
			// method 2 与method 1比较
			// 统计单字快了100倍，分别是 ： 55ms,  5689ms
			// 统计双字快了300倍，分别是 ： 367ms, 114459ms
		for (index = 0; index < length - 1; index++) {
			nowStr = c.substr(index, val);
			if (method === 1) {	// 优化前的算法
				/*********************************/
				for (i = 0; i < arr.length; i++) {
					if (arr[i].word === nowStr) {
						arr[i].num = arr[i].num + 1;
						find = true;
						break;
					}
				}
				if (!find) {
					arr[arr.length] = {};
					arr[arr.length - 1].word = nowStr;
					arr[arr.length - 1].num = 1;
				} else {
					find = false;
				}
				/*********************************/
			} else {			// 优化后算法
				/*********************************/
				if (prop[nowStr]) {
					prop[nowStr].num += 1;
				} else {
					prop[nowStr] = {};
					prop[nowStr].word = nowStr;
					prop[nowStr].num = 1;
				}
				/*********************************/
			}
		}
		if (method === 2) {		// 把方法2产生的 保存着词频信息的对象 转换成数组
			/*********************************/
			propKeys = Object.keys(prop);
			while (propKeys.length > 0) {
				popOneFromPropKeys = propKeys.pop();
				arr.push({word : popOneFromPropKeys, num : prop[popOneFromPropKeys].num});
			}
			/*********************************/
		}
		yy.show('搜索字或词的个数有' + arr.length + '个，用时：' + (+ new Date() - time) + 'ms');
		time = + new Date();
		
		len = arr.length;
		for (i = 0; i < len; i++) {				//删除出现次数小于5的元素（可选项）
			if (arr[i - shanchu].num <= 5) {
				arr.splice(i - shanchu, 1);
				shanchu++;
			}
		}
		yy.show('删除num小于5的元素用时：' + (+ new Date() - time) + 'ms');
		time = + new Date();
		
		len = arr.length;
		yy.show("删除num小于5的元素后，只剩下" + len + "个");
		yy.show("sort begin..");
		arr.sort(function (x, y) {			// 排序
			return y.num - x.num;
		});

		yy.show('排序用时：' + (+ new Date() - time) + 'ms');
		time = + new Date();
		
		for (i = 0; i < len; i++) {
			strArr.push(arr[i].word + '-->' + arr[i].num);
		}
		switch (val) {
		case 1:
			yy.one = arr;
			yy.aj('result').innerHTML = strArr.join("<br>");
			break;
		case 2:
			yy.two = arr;
			yy.aj('result2').innerHTML = strArr.join("<br>");
			break;
		}
	};
	yy.create = function () {
		if (yy.one.length === 0 || yy.two.length === 0) {
			alert("请先统计词频");
			return false;
		}
		// 宋词建模
		// 驿外断桥边，寂寞开无主.已是黄昏独自愁更著风和雨.无意苦争春一任群芳妒.零落成泥碾作尘只有香如故
		var arr = [2, 2, 1, 3, 2, 2, 1, 4, 2, 2, 2, 1, 3, 2, 2, 1, 4, 2, 2, 1, 3, 2, 2, 1, 4, 2, 2, 2, 1, 3, 2, 1, 2, 4],
			str = "",
			div = $('#lyric');
		arr.forEach(function (obj) {
			switch (obj) {
			case 1:
				str += yy.one[yy.random(0, 100)].word;
				break;
			case 2:
				str += yy.two[yy.random(0, 100)].word;
				break;
			case 3:
				str += ',';
				break;
			case 4:
				str += '。';
				break;
			}
		});
		div.html(str);
		div.slideToggle();
	};
	// simple tools function
	yy.random = function (a, b) {
		return Math.ceil(Math.random() * (b - a) + a);
	};
	yy.show = function (val) {
		console.log(val);
	};
	yy.aj = function (val) {
		return document.getElementById(val);
	};
	window.yy = yy;
}());
