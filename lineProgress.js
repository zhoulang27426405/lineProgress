function lineProgress(config) {
	var PROGRESS_WIDTH = 190;
	var PROGRESS_HEIGHT = 4;
	var SLIDER_WIDTH = 40;
	var SLIDER_HEIGHT = 20;
	var TRIANGLE_WIDTH = 4;
	var TRIANGLE_HEIGHT = 4;
	var RADIUS = 2;
	if (!config.element) {
		throw new Error('Error: lineProgress must have dom element');
	}
	if (config.element.tagName.toLowerCase() != 'canvas') {
		var _ele = document.createElement('canvas');
		_ele.id = '_ele_line_progress_' + Math.ceil(Math.random() * 1000);
		_ele.width = config.element.clientWidth;
		_ele.height = config.element.clientHeight;
		config.element.appendChild(_ele);
		this.ctx = _ele.getContext('2d');
	} else {
		this.ctx = config.element.getContext('2d');
	}
	this.width = config.width || config.element.clientWidth;
	this.height = config.height || config.element.clientHeight;
	this.progressWidth = PROGRESS_WIDTH;
	this.progressHeight = PROGRESS_HEIGHT;
	this.sliderWidth = SLIDER_WIDTH;
	this.sliderHeight = SLIDER_HEIGHT;
	this.triangleWidht = TRIANGLE_WIDTH;
	this.triangleHeight = TRIANGLE_HEIGHT;
	this.radius = RADIUS;
	this.backgroundColor = '#e9f3fd';
	this.sliderColor = '#81ccff';
	this.gradStart = '#c2e5fe';
	this.gradStop = '#81ccff';
	this.progress = config.current;
	this._shadow_progress = 0;
	this.draw();
}
lineProgress.prototype.draw = function(progress) {
	this.progress = progress;
	var that = this;
	var _draw = function() {
		that.ctx.clearRect(0, 0, that.width, that.height);
		that.drawBackground();
		that.drawlineProgress();
		that.drawText();
		if (that._shadow_progress == Math.floor(that.progress * 1000 / 10)) {
			window.cancelAnimationFrame(that.drawId);
			that.drawId = undefined;
			return false;
		} else if (that._shadow_progress > Math.floor(that.progress * 1000 / 10)) {
			that._shadow_progress -= 1;
		} else if (that._shadow_progress < Math.floor(that.progress * 1000 / 10)) {
			that._shadow_progress += 1;
		}
		that.drawId = window.requestAnimationFrame(_draw);
	}
	_draw();
}
lineProgress.prototype.drawBackground = function() {
	this.drawRadiusRect((this.width - this.progressWidth)/2, this.height - this.progressHeight, this.progressWidth, this.progressHeight, this.radius, this.backgroundColor, false);
}
lineProgress.prototype.drawlineProgress = function() {
	var grd = this.ctx.createLinearGradient((this.width - this.progressWidth)/2, this.height - this.progressHeight, this.progressWidth * this._shadow_progress/100, this.progressHeight);
	grd.addColorStop(0, this.gradStart);
	grd.addColorStop(1, this.gradStop);
	this.drawRadiusRect((this.width - this.progressWidth)/2, this.height - this.progressHeight, this.progressWidth * this._shadow_progress/100, this.progressHeight, this.radius, grd, false);
}
lineProgress.prototype.drawText = function() {
	this.drawRadiusRect((this.width - this.progressWidth)/2 + this.progressWidth * this._shadow_progress/100 - this.sliderWidth/2, 0, this.sliderWidth, this.sliderHeight, this.radius, this.sliderColor, false);
	this.ctx.beginPath();
	this.ctx.fillStyle = '#81ccff';
	this.ctx.moveTo((this.width - this.progressWidth)/2 + this.progressWidth * this._shadow_progress/100 - this.triangleWidht/2, this.sliderHeight);
	this.ctx.lineTo((this.width - this.progressWidth)/2 + this.progressWidth * this._shadow_progress/100, this.sliderHeight + this.triangleHeight);
	this.ctx.lineTo((this.width - this.progressWidth)/2 + this.progressWidth * this._shadow_progress/100 + this.triangleWidht/2, this.sliderHeight);
	this.ctx.fill();
	this.ctx.closePath();

	this.ctx.beginPath();
	this.ctx.fillStyle = '#fff';
	this.ctx.lineWidth = 2;
	this.ctx.textAlign = 'center';
	this.ctx.font = '12px';
	this.ctx.fillText(this._shadow_progress/100 * 100 + '%', (this.width - this.progressWidth)/2 + this.progressWidth * this._shadow_progress/100, 14);
	this.ctx.closePath();
}
lineProgress.prototype.restart = function() {
	this._shadow_progress = 0;
	this.draw();
}
/**
 * [drawRadiusRect]
 * @param  number x      [x coordinate]
 * @param  number y      [y coordinate]
 * @param  number width  [rect width]
 * @param  number height [rect height]
 * @param  number radius [fillet radius]
 * @param  number fill   [background color]
 * @param  number stroke [border color]
*/
lineProgress.prototype.drawRadiusRect = function(x, y, width, height, radius, fill, stroke) {
	this.ctx.beginPath();
	this.ctx.moveTo(x + radius, y);
	this.ctx.lineTo(x + width - radius, y);
	this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
	this.ctx.lineTo(x + width, y + height - radius);
	this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	this.ctx.lineTo(x + radius, y + height);
	this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
	this.ctx.lineTo(x, y + radius);
	this.ctx.quadraticCurveTo(x, y, x + radius, y);
	if (fill) {
		this.ctx.fillStyle = fill;
		this.ctx.fill();
	}
	if (stroke) {
		this.ctx.strokeStyle = stroke;
		this.ctx.stroke();
	}
	this.ctx.closePath();
}
/**
* requestAnimationFrame polyfill
*/
if (!window.requestAnimationFrame || !window.cancelAnimationFrame) {
	var lastTime = 0;
	window.requestAnimationFrame = function(callback) {
	var now = new Date().getTime();
	var nextTime = Math.max(lastTime + 16, now);
	return setTimeout(function() {
		callback(lastTime = nextTime);
	}, nextTime - now);
	};
	window.cancelAnimationFrame = clearTimeout;
}

