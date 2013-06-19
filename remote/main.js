function removeClass(element, className) {
	if(typeof element != 'object') element = document.getElementById(element);
	var classString = element.className;
	var newClassString = '';
	var indexPos = classString.indexOf(className);
	if(indexPos == -1) {
		return;
	} else if (indexPos == 0) {
		newClassString = classString.substring(0, indexPos) + classString.substr(indexPos+className.length);
	} else {
		newClassString = classString.substring(0, indexPos-1) + classString.substr(indexPos+className.length);
	}

	element.className = newClassString;
}

function addClass(element, className) {
	if(typeof element != 'object') element = document.getElementById(element);
	var classString = element.className;
	if(classString != '') {
		var indexPos = classString.indexOf(className);
		if(indexPos == -1) {
			element.className += ' '+className;
		}
	} else {
		element.className = className;
	}
}

function getStyle(element,styleProp) {
	if(typeof element != 'object') element = document.getElementById(element);
	var style;
	if (element.currentStyle) {
		style = element.currentStyle[styleProp];
	} else if (window.getComputedStyle) {
		style = document.defaultView.getComputedStyle(element,null).getPropertyValue(styleProp);
	}
	return style;
}


/* INIT */


var App = {};
App.nightmode = false;
App.nowPlaying = false;
App.volume = 30;

window.addEventListener('load', function() {
    FastClick.attach(document.body);
}, false);

document.getElementById('nightmode').onclick = function() {
	if(App.nightmode) {
		removeClass(document.body, 'nightmode');
		App.nightmode = false;
	} else {
		addClass(document.body, 'nightmode');
		App.nightmode = true;
	}
}

document.getElementById('play-pause').onclick = function() {
	if(App.nowPlaying) {
		removeClass(this, 'nowplaying');
		App.nowPlaying = false;
	} else {
		addClass(this, 'nowplaying');
		App.nowPlaying = true;
	}
}

function VolumeSlider() {
	var that = this;

	this.container = document.getElementById('volume');
	this.volumeActiveBar = document.getElementById('slider-left');
	this.volumeInactiveBar = document.getElementById('slider-right');
	this.volumeHandle = document.getElementById('slider-handle');

	this.container_width = 0;
	this.current_pos = 0;
	this.step = 0; //pixels for one percent

	this.init = function() {
		this.sizeInitNeeded = true;
		this.setDimensions();

		//window.addEventListener("orientationchange", function() { this.sizeInitNeeded = true; }, false);
		//window.addEventListener("resize", function() { this.sizeInitNeeded = true; }, false);
	};

	this.setDimensions = function() {
		if(this.sizeInitNeeded) {
			/*this.container_width = this.container.offsetWidth - getStyle(this.container,'padding-left') - getStyle(this.container,'padding-right');*/
			this.container_width = this.container.offsetWidth;
			this.step = this.container_width / 100;
			this.current_pos = this.step*App.volume;
			this.redraw();
			this.sizeInitNeeded = false;
		}
	};

	this.setSliderPos = function(move) {
		var newPos = this.current_pos + move;
		if(newPos < 0) { //skipped those two for a more natural behaviour
			//newPos = 0;
		} else if(newPos > this.container_width) {
			//newPos = this.container_width;
		} else {
			var check = newPos - (App.volume*this.step);
			if(check < -(this.step)) {
				App.volume -= Math.round(-(check)/this.step);
			} else if(check > this.step) {
				App.volume += Math.round(check/this.step);
			}
			this.redraw();
		}

		this.current_pos = newPos;
	}

	this.redraw = function() {
		this.volumeHandle.style.left = App.volume+'%';
		this.volumeActiveBar.style.width = App.volume+'%';
		this.volumeInactiveBar.style.width = (100-App.volume)+'%';
	}

	function handleHammer(ev) {
		//console.log(ev);
		// disable browser scrolling
		ev.gesture.preventDefault();

		switch(ev.type) {
			case 'touch':
				//that.setDimensions();
				that.current_pos = that.step*App.volume;
				that.oldDeltaX = 0;
				break;
			case 'dragright':
			case 'dragleft':
				that.setSliderPos(ev.gesture.deltaX - that.oldDeltaX);
				that.oldDeltaX = ev.gesture.deltaX;
				break;
		}
	}

	Hammer(this.volumeHandle, { drag_lock_to_axis: true, drag_min_distance: 3 }).on("touch dragleft dragright", handleHammer);
}

var volSlider = new VolumeSlider().init();