/**
 * slider滑动组件
 * 2017-2-19
 */
class Slider {

	constructor(options) {
		this.wrap = options.dom
		this.dataList = options.dataList
		this.timer = 0
		this.autoSpeed = 2000
		this.transitonSpeed = '0.5s'

		this.init()
		this.renderDOM()
		this.bindDOM()
		this.auto()
	}

	init() {
		this.radio = window.innerHeight/window.innerWidth
		this.pageWidth = window.innerWidth

		//注意auto的索引和手动滑动索引值保持统一
		this.index = 0 
	}

	renderDOM() {
		let wrap = this.wrap
		let dataList = this.dataList
		let len = dataList.length

		for(let i=0; i<len; i++) {
			dataList.push(dataList[i])
		}
		this.len = len = dataList.length
		//模拟ajax返回数据生成列表
		this.outer = document.createElement('ul')
		for(let i=0; i<len; i++) {
			let oLi = document.createElement('li')
			let item = dataList[i]
			oLi.style.width = `${window.innerWidth}px`
			oLi.style.webkitTransform = `translate3d(${i*this.pageWidth}px, 0, 0)`
			if(item) {
				if(item['height']/item['width'] > this.radio) oLi.innerHTML = `<img height='${window.innerHeight}' src='${item["img"]}'>`
				else oLi.innerHTML = `<img width='${window.innerWidth}' src='${item["img"]}'>`
			}
			this.outer.appendChild(oLi)
		}
		this.outer.style.cssText = `width: ${this.pageWidth}px`
		wrap.style.height = `${window.innerHeight}px`
		wrap.appendChild(this.outer)
	}

	bindDOM() {
		let self = this
		let pageWidth = self.pageWidth
		let outer = self.outer
		let len = self.dataList.length
		let offsetX = 0
		let startX = 0
		self.transform(outer,"translateX", 0);

		let handlerStart = (evt) => {
			evt.preventDefault()
			clearInterval(this.timer)
			outer.style.transition = 'none';
			self.startPiont = evt.touches[0].pageX

			//取到第几张图
			let translateX = self.transform(outer, "translateX")
			self.index = Math.round(-translateX / self.pageWidth);

			//为了防止在拖动第一张图左边出现空白页面
			if(self.index == 0) {
				self.index = len/2
			}

			//为了防止在拖动第最后一张图右边出现空白页面
			if(self.index == len-1) {
				self.index = len/2-1;
			}

			//设置图片的位置
			self.transform(outer, "translateX", -self.index * pageWidth);

			//记录每次点击的位置
			startX = self.transform(outer,"translateX");
		}

		let handlerMove = (evt) => {
			evt.preventDefault()
			offsetX = evt.targetTouches[0].pageX - self.startPiont 
			self.transform(outer, 'translateX', startX + offsetX)
		}

		let handlerEnd = (evt) => {
			evt.preventDefault()
			let translateX = self.transform(outer, "translateX")
			self.index = Math.round(-translateX/pageWidth)
			self.transform(outer, 'translateX', -this.index*pageWidth)
			outer.style.transition = this.transitonSpeed;
			self.auto()
		}

		outer.addEventListener('touchstart', handlerStart)
		outer.addEventListener('touchmove', handlerMove)
		outer.addEventListener('touchend', handlerEnd)
	}

	transform(el, attr, val) {
		if(!el.transform){
			el.transform = {};
		}
		if(arguments.length > 2) {
			el.transform[attr] = val
			let sAttr = ''
			for(let attr in el.transform) {
				switch(attr) {
					case "rotate": 
					case "skewX": 
					case "skewY": 
						sAttr += `${attr}(${el.transform[attr]}deg)`
						break
					case "translateX":
					case "translateY":
						sAttr += `${attr}(${el.transform[attr]}px)`
						break
					case "scaleX":
					case "scaleY":
					case "scale":
						sAttr += `${attr}(${el.transform[attr]})`
				}
				el.style.WebkitTransform = el.style.transform = sAttr
			}
		} else {
			val = el.transform[attr]
			if(typeof val === 'undefined') {
				if(attr === "scale" || attr === "scaleX" || attr === "scaleY") {
					val = 1
				} else {
					val = 0
				}
			}
			return val
		}
	}

	auto() {
		clearInterval(this.timer);
		this.timer = setInterval(() => {

			if(this.index >= this.len-1) {
				this.index = this.len/2 -1
			}

			this.outer.style.transition = "none";
			this.transform(this.outer, 'translateX', -this.index * this.pageWidth)

			setTimeout(() => {
				this.index ++
				this.outer.style.transition = this.transitonSpeed;
				this.transform(this.outer, 'translateX', -this.index * this.pageWidth)
			},40);
		}, this.autoSpeed)
	}

}

window.Slider = Slider
