/**
 * [ImgLazyLoad description]
 * @method  ImgLazyLoad
 * @author wbcz
 * @version 1.0
 * @date    2017-02-21
 * @param   {[type]}    options [description]
 */


function ImgLazyLoad(options) {

	var defaultOptions = {
		container: window,
		threshold: 0,
		event: 'scroll',
		effect: 'fadeIn',
		effectSpeed: 1000,
		suffix: 'src',
		skip_invisible: true,
		delay: 500,
		mustExeTime: 1000,
		scrollDirection: undefined   //horizontal
	}

	this.finalOptions = Object.assign(defaultOptions, options || {})

	this.init(this.finalOptions)
}

ImgLazyLoad.prototype = {

	constructor: ImgLazyLoad,

	init: function(options) {
		this.registerEvent(options)
	},
	_throttle: function(fn, delay, mustExeTime) {
		var timer = null;
		var previous = null;

		return function() {
			var context = this;
			var current = +new Date();
			var args = arguments;

			if(!previous) previous = current;
			var remainTime = current - previous;

			if(mustExeTime && remainTime >= mustExeTime) {
				fn.apply(context, args);
				previous = current;
			} else {
		        clearTimeout(timer)
				timer = setTimeout(function() {
					fn.apply(context, args);
				}, delay);
			}
		}
	},
	_isLoaded: function(el) {
		var threshold = this.finalOptions.threshold;
		if(this.finalOptions.skip_invisible && !$('img').is(":visible")) {
			return;
		}
		var cors = el.getBoundingClientRect();

		var _isGoDown = function() {
			return cors.top < $(window).scrollTop() + $(window).height() - threshold;
		}
		var _isGoUp = function() {
			return cors.top > $(window).scrollTop() + $(window).height() - threshold;
		}
		var _isGoRight = function() {
			return cors.left < $(window).scrollLeft() + $(window).width() - threshold;
		}
		var _isGoLeft = function() {
			return cors.left > $(window).scrollLeft() + $(window).width() - threshold;
		}
		if(!this.finalOptions.scrollDirection) {
			if(_isGoDown()) {
				return true
			} else if(_isGoUp()) {
				return false
			}
		} else {
			if(_isGoRight()) {
				return true
			} else if(_isGoLeft()) {
				return false
			}
		}
	},
	_loadImage: function() {

		var suffix = this.finalOptions.suffix;
		var effect = this.finalOptions.effect;
		var effectSpeed = this.finalOptions.effectSpeed;
		var self = this;
		var containsObj;

		if(this.finalOptions.container !== window) {
			containsObj =  this.finalOptions.container;
		} else {
			containsObj = document;
		}
		//如果是类似于vue这些框架的组件，这里就直接用指令的形式绑定元素就可以了，这里就不需要循环了
		[].forEach.call(containsObj.querySelectorAll('img'), function(el) {
			if(!$(el).attr('isload') && self._isLoaded(el)) {
				if($(el).attr('src') === './img/loading.gif') {
					let updateSrc = $(el).attr('data-' + suffix);
					$(el).attr('src', updateSrc);
					$(el).attr('isload', true);
					$(el)[effect](effectSpeed);
				}
			}
		})
	},
	registerEvent: function(options) {
		var targetObject = options.container;
		console.log(targetObject)
		var delay = options.delay;
		var mustExeTime = options.mustExeTime;
		var event = options.event;
		targetObject.addEventListener(event, this._throttle(this._loadImage, delay, mustExeTime).bind(this));
	}
}

$.extend({
	lazyLoad: function(options) {
		new ImgLazyLoad(options);
	}
})
