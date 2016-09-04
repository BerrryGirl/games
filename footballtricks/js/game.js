/*
 * Viewporter v2.0
 * http://github.com/zynga/viewporter
 *
 * Copyright 2011, Zynga Inc.
 * Licensed under the MIT License.
 * https://raw.github.com/zynga/viewporter/master/MIT-LICENSE.txt
 */
var viewporter;
(function() {

	var _viewporter;

	// initialize viewporter object
	viewporter = {

		// options
		forceDetection: false,

		disableLegacyAndroid: true,

		// constants
		ACTIVE: (function() {

			// it's best not do to anything to very weak devices running Android 2.x
			if(viewporter.disableLegacyAndroid && (/android 2/i).test(navigator.userAgent)) {
				return false;
			}

			// iPad's don't allow you to scroll away the UI of the browser
			if((/ipad/i).test(navigator.userAgent)) {
				return false;
			}

			// WebOS has no touch events, but definitely the need for viewport normalization
			if((/webos/i).test(navigator.userAgent)) {
				return true;
			}

			// touch enabled devices
			if('ontouchstart' in window) {
				return true;
			}

			return false;

		}),

		READY: false,

		// methods
		isLandscape: function() {
			return window.orientation === 90 || window.orientation === -90;
		},

		ready: function(callback) {
			window.addEventListener('viewportready', callback, false);
		},
		
		change: function(callback) {
			window.addEventListener('viewportchange', callback, false);
		},

		refresh: function(){
			if (_viewporter) {
				_viewporter.prepareVisualViewport();
			}
		},

		preventPageScroll: function() {

			// prevent page scroll if `preventPageScroll` option was set to `true`
			document.body.addEventListener('touchmove', function(event) {
				event.preventDefault();
			}, false);

			// reset page scroll if `preventPageScroll` option was set to `true`
			// this is used after showing the address bar on iOS
			document.body.addEventListener("touchstart", function() {
				_viewporter.prepareVisualViewport();
			}, false);

		}

	};

	// execute the ACTIVE flag
	viewporter.ACTIVE = viewporter.ACTIVE();

	// if we are on Desktop, no need to go further
	if (!viewporter.ACTIVE) {
		return;
	}

	// create private constructor with prototype..just looks cooler
	var _Viewporter = function() {

		var that = this;

		// Scroll away the header, but not in Chrome
		this.IS_ANDROID = /Android/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

		var _onReady = function() {

			// scroll the shit away and fix the viewport!
			that.prepareVisualViewport();

			// listen for orientation change
			var cachedOrientation = window.orientation;
			window.addEventListener('orientationchange', function() {
				if(window.orientation !== cachedOrientation) {
					that.prepareVisualViewport();
					cachedOrientation = window.orientation;
				}
			}, false);
			
		};


		// listen for document ready if not already loaded
		// then try to prepare the visual viewport and start firing custom events
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', function() {
				_onReady();
			}, false);
		} else {
			_onReady();
		}


	};

	_Viewporter.prototype = {

		getProfile: function() {

			if(viewporter.forceDetection) {
				return null;
			}

			for(var searchTerm in viewporter.profiles) {
				if(new RegExp(searchTerm).test(navigator.userAgent)) {
					return viewporter.profiles[searchTerm];
				}
			}
			return null;
		},

		postProcess: function() {

			// let everyone know we're finally ready
			viewporter.READY = true;

			this.triggerWindowEvent(!this._firstUpdateExecuted ? 'viewportready' : 'viewportchange');
			this._firstUpdateExecuted = true;

		},

		prepareVisualViewport: function() {

			var that = this;

			// if we're running in webapp mode (iOS), there's nothing to scroll away
			if(navigator.standalone) {
				return this.postProcess();
			}

			// maximize the document element's height to be able to scroll away the url bar
			document.documentElement.style.minHeight = '5000px';

			var startHeight = window.innerHeight;
			var deviceProfile = this.getProfile();
			var orientation = viewporter.isLandscape() ? 'landscape' : 'portrait';

			// try scrolling immediately
			window.scrollTo(0, that.IS_ANDROID ? 1 : 0); // Android needs to scroll by at least 1px

			// start the checker loop
			var iterations = 40;
			var check = window.setInterval(function() {

				// retry scrolling
				window.scrollTo(0, that.IS_ANDROID ? 1 : 0); // Android needs to scroll by at least 1px

				function androidProfileCheck() {
					return deviceProfile ? window.innerHeight === deviceProfile[orientation] : false;
				}
				function iosInnerHeightCheck() {
					return window.innerHeight > startHeight;
				}

				iterations--;

				// check iterations first to make sure we never get stuck
				if ( (that.IS_ANDROID ? androidProfileCheck() : iosInnerHeightCheck()) || iterations < 0) {

					// set minimum height of content to new window height
					document.documentElement.style.minHeight = window.innerHeight + 'px';

					// set the right height for the body wrapper to allow bottom positioned elements
					var docViewporter = document.getElementById('viewporter');
					if (docViewporter && docViewporter.style) {
						docViewporter.style.position = 'relative';
						docViewporter.style.height = window.innerHeight + 'px';						
					}


					clearInterval(check);

					// fire events, get ready
					that.postProcess();

				}

			}, 10);

		},

		triggerWindowEvent: function(name) {
			var event = document.createEvent("Event");
			event.initEvent(name, false, false);
			window.dispatchEvent(event);
		}

	};

	// initialize
	_viewporter = new _Viewporter();

})();

viewporter.profiles = {

	// Motorola Xoom
	'MZ601': {
		portrait: 696,
		landscape: 1176
	},

	// Samsung Galaxy S, S2 and Nexus S
	'GT-I9000|GT-I9100|Nexus S': {
		portrait: 508,
		landscape: 295
	},

	// Samsung Galaxy Pad
	'GT-P1000': {
		portrait: 657,
		landscape: 400
	},

	// HTC Desire & HTC Desire HD
	'Desire_A8181|DesireHD_A9191': {
		portrait: 533,
		landscape: 320
	}

};// Inheritance pattern
Function.prototype.inheritsFrom = function(parentClassOrObject) {
	if (parentClassOrObject.constructor == Function) {
		// Normal Inheritance
		this.prototype = new parentClassOrObject;
		this.prototype.constructor = this;
		this.parent = parentClassOrObject.prototype;
	} else {
		// Pure Virtual Inheritance
		this.prototype = parentClassOrObject;
		this.prototype.constructor = this;
		this.parent = parentClassOrObject;
	}
	return this;
};

function popElementFromArray(item, items) {
	for (var i = 0; i < items.length; i++) {
		if (items[i] === item) {
			items.splice(i, 1);
			i--;
			return;
		}
	}
};

function popAllElementsFromArray(items) {
	items.splice(0, items.length);
}

function isInArray(item, items) {
	var count = 0;
	for (var i = 0; i < items.length; i++) {
		if (items[i] === item) {
			count++;
		}
	}
	return count;
}

function getCursorPositionXY(e) {
	var x;
	var y;
	if (isMobile()) {
		x = e.pageX;
		y = e.pageY;
	} else {
		x = e.clientX; // + document.body.scrollLeft +
		// document.documentElement.scrollLeft;
		y = e.clientY; // + document.body.scrollTop +
		// document.documentElement.scrollTop;
	}

	// x = Math.min(x, grid.canvas.width * grid.itemWidth);
	// y = Math.min(y, grid.canvas.height * grid.itemHeight);

	// alert("Cursor position is "+x+":"+y);

	return {
		x : x,
		y : y
	};
};

// Performs crossbrowser transfrom via JQuery
function cssTransform(obj, matrix, rotate, scaleX, scaleY, translate) {

	if (Device.isNative()) {
	    var transform = {
	            "matrix": matrix,
	            "translate": [translate.x, translate.y],
	            "rotate": rotate
	        };
	    obj['css']("transform", transform);
	    return;
	}
	
	var transform = "";

	if (matrix != null) {
		transform += "matrix(" + matrix + ")";
	}

	if (Device.supports3dTransfrom()) {
		if (translate != null) {
			transform += " translate3d(" + translate.x + "px, " + translate.y
					+ "px, 0px)";
		}
		if (rotate != null) {
			transform += " rotate3d(0, 0, 1, " + rotate + "deg)";
		}
		if (scaleX || scaleY) {
			scaleX = scaleX ? scaleX : 1;
			scaleY = scaleY ? scaleY : 1;
			transform += " scale3d(" + scaleX + ", " + scaleY + ", 1)";
		}
	} else {
		if (translate != null) {

			transform += " translateX(" + translate.x + "px)";
			transform += " translateY(" + translate.y + "px)";
		}
		if (rotate != null) {
			transform += " rotate(" + rotate + "deg)";
		}
		if (scaleX != null) {
			transform += " scaleX(" + scaleX + ")";
		}
		if (scaleY != null) {
			transform += " scaleY(" + scaleY + ")";
		}
	}

	obj['css']("-webkit-transform", transform);
	obj['css']("-moz-transform", transform);
	obj['css']("transform", transform);
	obj['css']("-o-transform", transform);
	obj['css']("transform", transform);
	obj['css']("msTransform", transform);
	// Should be fixed in the upcoming JQuery to use instead of 'msTransform'
	// http://bugs.jquery.com/ticket/9572
	// obj['css']("-ms-transform", transform);
}

// Generate unique ID number
var uniqueId = (function() {
	var id = 0; // This is the private persistent value
	// The outer function returns a nested function that has access
	// to the persistent value. It is this nested function we're storing
	// in the variable uniqueID above.
	return function() {
		return id++;
	}; // Return and increment
})(); // Invoke the outer function after defining it.

// Console hack for IE
if (typeof console == "undefined") {
	var console = {
		log : function() {
		},
		warn : function() {
		},
		error : function() {
		}
	};
}

function eLog(message, tag, level) {
	if (!eLog.displayF)
		return;
	if (level && level > eLog.currentLevel)
		return;
	if (tag)
		eLog.displayF(tag + " :  " + message);
	else
		eLog.displayF(message);
};
eLog.displayF = function(msg) {
	try {
		console.log(msg);
	} catch (e) {
	}
};

eLog.currentLevel = 1;

/*
 * Unselectable items
 */

function preventDefaultEventFunction(event) {
	// console.log("preventDefaultEventFunction");
	event.preventDefault();
	return false;
};

function makeUnselectable(obj) {
	obj.addClass("unselectable");
	obj['bind']("touchstart", function(e) {
		e.preventDefault();
		return false;
	});
	obj['bind']("touchmove", function(e) {
		e.preventDefault();
		return false;
	});
	obj['bind']("touchend", function(e) {
		e.preventDefault();
		return false;
	});
};

// either return val is it's a number or calculates
// percentage of parentVal
calcPercentage = function(val, parentVal) {
	if (typeof (val) == "string" && val.indexOf("%") > -1) {
		val = (parseFloat(val.replace("%", "")) * parentVal / 100.0);
	}
	return val;
};

/*
 * 
 * Make divs transparent to clicks
 * http://stackoverflow.com/questions/3680429/click-through-a-div-to-underlying-elements
 * http://www.searchlawrence.com/click-through-a-div-to-underlying-elements.html
 */

function makeClickTransparent(obj) {
	obj['css']("pointer-events", "none");
	// TODO add IE and Opera support
}

var assets = new Array();

function loadMedia(data, oncomplete, onprogress, onerror) {
	var i = 0, l = data.length, current, obj, total = l, j = 0, ext;
	for (; i < l; ++i) {
		current = data[i];
		ext = current.substr(current.lastIndexOf('.') + 1).toLowerCase();

		if (/* Crafty.support.audio && */(ext === "mp3" || ext === "wav"
				|| ext === "ogg" || ext === "mp4")) {
			obj = new Audio(current);
			// Chrome doesn't trigger onload on audio, see
			// http://code.google.com/p/chromium/issues/detail?id=77794
			if (navigator.userAgent.indexOf('Chrome') != -1)
				j++;
		} else if (ext === "jpg" || ext === "jpeg" || ext === "gif"
				|| ext === "png") {
			obj = new Image();
			obj.src = current;
		} else {
			total--;
			continue; // skip if not applicable
		}

		// add to global asset collection
		assets[current] = obj;

		obj.onload = function() {
			++j;

			// if progress callback, give information of assets loaded,
			// total and percent
			if (onprogress) {
				onprogress.call(this, {
					loaded : j,
					total : total,
					percent : (j / total * 100)
				});
			}
			if (j === total) {
				if (oncomplete)
					oncomplete();
			}
		};

		// if there is an error, pass it in the callback (this will be
		// the object that didn't load)
		obj.onerror = function() {
			if (onerror) {
				onerror.call(this, {
					loaded : j,
					total : total,
					percent : (j / total * 100)
				});
			} else {
				j++;
				if (j === total) {
					if (oncomplete)
						oncomplete();
				}
			}
		};
	}
}

function distance(A, B) {
	return Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
}

// Selects first not null value through the list of argument
// and the last one as default
function selectValue() {
	var result;
	for (var i = 0; i < arguments.length - 1; i++) {
		result = arguments[i];
		if (result != null) {
			return result;
		}
	}
	var result = arguments[arguments.length - 1];
	return result;
}

var Recorder = (function() {
	var content = [], refTime = -1, isRecording = false;
	obj = {};
	function recordAction(action, target, params) {
		if (!isRecording) {
			return;
		}
		content.push({
			action : action,
			target : target,
			params : params,
			time : (refTime != -1) ? (Date.now() - refTime) : refTime
		});
		console.log("Recorded Action: ", content[content.length - 1]);
	}
	;

	function clearContent() {
		content = [];
		refTime = -1;
		console.log("Cleared recorder content");
	}
	;

	function setRefTime() {
		refTime = Date.now();
		console.log("Setting ref time to ", new Date(refTime));
	}
	;

	function saveToFile() {
		var string = "";
		console.log("content on saveToFile: ", content);
		for (var i = 0; i < content.length; i++) {
			var temp = "" + content[i].action + ";" + content[i].target + ";"
					+ content[i].time + ";";

			if (content[i].action == "clickedAt") {
				temp = temp + content[i].params.x + "," + content[i].params.y
						+ ";";
			}

			temp = temp + "\n";
			string = string + temp;
		}
		uriContent = "data:application/octet-stream,"
				+ encodeURIComponent(string);
		newWindow = window.open(uriContent, 'neuesDokument');
	}
	;

	function startRecord() {
		clearContent();
		setRefTime();
		isRecording = true;
	}
	;

	function stopRecord() {
		isRecording = false;
		refTime = -1;
		saveToFile();
	}
	;

	obj["recordAction"] = recordAction;
	obj["clearContent"] = clearContent;
	obj["setRefTime"] = setRefTime;
	obj["saveToFile"] = saveToFile;
	obj["startRecord"] = startRecord;
	obj["stopRecord"] = stopRecord;
	obj["getState"] = function() {
		return (function(state) {
			return state;
		})(isRecording);
	};
	return obj;
})();

function RandomNumberGenerator(seed) {
	var keySchedule = [];
	var keySchedule_i = 0;
	var keySchedule_j = 0;

	function init(seed) {
		for (var i = 0; i < 256; i++)
			keySchedule[i] = i;

		var j = 0;
		for (var i = 0; i < 256; i++) {
			j = (j + keySchedule[i] + seed.charCodeAt(i % seed.length)) % 256;

			var t = keySchedule[i];
			keySchedule[i] = keySchedule[j];
			keySchedule[j] = t;
		}
	}
	init(seed);

	function getRandomByte() {
		keySchedule_i = (keySchedule_i + 1) % 256;
		keySchedule_j = (keySchedule_j + keySchedule[keySchedule_i]) % 256;

		var t = keySchedule[keySchedule_i];
		keySchedule[keySchedule_i] = keySchedule[keySchedule_j];
		keySchedule[keySchedule_j] = t;

		return keySchedule[(keySchedule[keySchedule_i] + keySchedule[keySchedule_j]) % 256];
	}

	this.next = function() {
		var number = 0;
		var multiplier = 1;
		for (var i = 0; i < 8; i++) {
			number += getRandomByte() * multiplier;
			multiplier *= 256;
		}
		return number / 18446744073709551616;
	};
};

function cloneObject(obj) {
	if ("object" === typeof obj && obj.length) {
		var ar = [];
		for (var i = 0; i < obj.length; i++) {
			ar[i] = cloneObject(obj[i]);
		}
		return ar;
	}
	if (null == obj || "object" != typeof obj)
		return obj;
	var copy = {};
	for ( var smth in obj) {
		copy[smth] = cloneObject(obj[smth]);
	}
	return copy;
}

function toggleFullScreen() {
	if (!document.fullscreenElement && // alternative standard method
	!document.mozFullScreenElement && !document.webkitFullscreenElement
			&& !document.msFullscreenElement) { // current working methods
		if (document.documentElement.requestFullscreen) {
			document.documentElement.requestFullscreen();
		} else if (document.documentElement.msRequestFullscreen) {
			document.documentElement.msRequestFullscreen();
		} else if (document.documentElement.mozRequestFullScreen) {
			document.documentElement.mozRequestFullScreen();
		} else if (document.documentElement.webkitRequestFullscreen) {
			document.documentElement
					.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
		}
	} else {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
	}
}

var DEBUG_INTERFACE = {
		active : false,
		log : function() {
		},
		log2 : function() {
		},
		log3 : function() {
		},
		log4 : function() {
		}
};

function turnOnOnScreenDebug() {
	DEBUG_INTERFACE.toppos = 0;
	DEBUG_INTERFACE.div = document.createElement("div");
	DEBUG_INTERFACE.div.style.position = "fixed";
	DEBUG_INTERFACE.div.style.zIndex = 100000000;
	DEBUG_INTERFACE.div.style.fontSize = "12px";
	DEBUG_INTERFACE.div.style.marginTop = 30 + "px";
	DEBUG_INTERFACE.div.style.marginLeft = "50px";
	DEBUG_INTERFACE.div.style.backgroundColor = "rgba(255,255,255,0.5)";
	document.body.appendChild(DEBUG_INTERFACE.div);
	DEBUG_INTERFACE.text1 = "";
	DEBUG_INTERFACE.log = function(message) {
		DEBUG_INTERFACE.text1 += message;
		var div = DEBUG_INTERFACE.div;
		div.innerHTML = "<p>" + DEBUG_INTERFACE.text1 + "</p>";
		if (div.clientHeight > 500) {
			var offset = 30 + 500 - div.clientHeight;
			div.style.marginTop = offset + "px";
		}
	};
	DEBUG_INTERFACE.div2 = document.createElement("div");
	DEBUG_INTERFACE.div2.style.position = "fixed";
	DEBUG_INTERFACE.div2.style.zIndex = 100000000;
	DEBUG_INTERFACE.div2.style.marginTop = 30 + "px";
	DEBUG_INTERFACE.div2.style.marginLeft = "200px";
	DEBUG_INTERFACE.div2.style.backgroundColor = "white";
	document.body.appendChild(DEBUG_INTERFACE.div2);

	DEBUG_INTERFACE.log2 = function(message) {
		var div = DEBUG_INTERFACE.div2;
		div.innerHTML = message;
	};

	DEBUG_INTERFACE.div3 = document.createElement("div");
	DEBUG_INTERFACE.div3.style.position = "fixed";
	DEBUG_INTERFACE.div3.style.zIndex = 100000000;
	DEBUG_INTERFACE.div3.style.fontSize = "12px";
	DEBUG_INTERFACE.div3.style.marginTop = 30 + "px";
	DEBUG_INTERFACE.div3.style.marginLeft = "400px";
	DEBUG_INTERFACE.div3.style.backgroundColor = "rgba(255,255,255,0.5)";
	document.body.appendChild(DEBUG_INTERFACE.div3);
	DEBUG_INTERFACE.text = "";
	DEBUG_INTERFACE.log3 = function(message) {
		var div = DEBUG_INTERFACE.div3;
		DEBUG_INTERFACE.text += message;
		div.innerHTML = "<p>" + DEBUG_INTERFACE.text + "</p>";
		if (div.clientHeight > 500) {
			var offset = 30 + 500 - div.clientHeight;
			div.style.marginTop = offset + "px";
		}
	};

	DEBUG_INTERFACE.div4 = document.createElement("div");
	DEBUG_INTERFACE.div4.style.position = "fixed";
	DEBUG_INTERFACE.div4.style.zIndex = 100000000;
	DEBUG_INTERFACE.div4.style.fontSize = "12px";
	DEBUG_INTERFACE.div4.style.marginTop = 30 + "px";
	DEBUG_INTERFACE.div4.style.marginLeft = "900px";
	DEBUG_INTERFACE.div4.style.backgroundColor = "rgba(255,255,255,0.5)";
	document.body.appendChild(DEBUG_INTERFACE.div4);
	DEBUG_INTERFACE.text3 = "";
	DEBUG_INTERFACE.log4 = function(message) {
		var div = DEBUG_INTERFACE.div4;
		DEBUG_INTERFACE.text3 += message;
		div.innerHTML = "<p>" + DEBUG_INTERFACE.text3 + "</p>";
		if (div.clientHeight > 500) {
			var offset = 30 + 500 - div.clientHeight;
			div.style.marginTop = offset + "px";
		}
	};
	
	DEBUG_INTERFACE.active = true;
	
	return DEBUG_INTERFACE;
}

function isImageOk(img) {
    // During the onload event, IE correctly identifies any images that
    // weren’t downloaded as not complete. Others should too. Gecko-based
    // browsers act like NS4 in that they report this incorrectly.
    if (!img.complete) {
        return false;
    }

    // However, they do have two very useful properties: naturalWidth and
    // naturalHeight. These give the true size of the image. If it failed
    // to load, either of these should be zero.

    if (typeof img.naturalWidth !== "undefined" && img.naturalWidth === 0) {
        return false;
    }

    // No other way of checking: assume it’s ok.
    return true;
}


function countProperties(obj) {
    return Object.keys(obj).length;
}

var mathSin = Math.sin;
Math.sin = function(a){
    if (a === 0) return 0;
    else return mathSin(a);
};
var mathCos = Math.cos;
Math.cos = function(a){
    if (a === 0) return 1;
    else return mathCos(a);
};/**
 *
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @constructor
 */
function ColorRgb(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
}

ColorRgb.Colors = {
    BLACK: new ColorRgb(0, 0, 0),
    WHITE: new ColorRgb(255, 255, 255),
    RED: new ColorRgb(255, 0, 0),
    LIME: new ColorRgb(0, 255, 0),
    BLUE: new ColorRgb(0, 0, 255),
    YELLOW: new ColorRgb(255, 255, 0),
    AQUA: new ColorRgb(0, 255, 255),
    MAGENTA: new ColorRgb(255, 0, 255),
    SILVER: new ColorRgb(192, 192, 192),
    GRAY: new ColorRgb(128, 128, 128),
    MAROON: new ColorRgb(128, 0, 0),
    OLIVE: new ColorRgb(128, 128, 0),
    GREEN: new ColorRgb(0, 128, 0),
    PURPLE: new ColorRgb(128, 0, 128),
    TEAL: new ColorRgb(0, 128, 128),
    NAVY: new ColorRgb(0, 0, 128)
};

/**
 *
 * @param {number} r
 * @param {number} g
 * @param {number} b
 */
ColorRgb.prototype.set = function (r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
};

ColorRgb.prototype.copy = function () {
    return new ColorRgb(this.r, this.g, this.b);
};
/**
 *
 * @param {ColorRgb} colorRgb
 */
ColorRgb.prototype.add = function (colorRgb) {
    this.r += colorRgb.r;
    this.g += colorRgb.g;
    this.b += colorRgb.b;
};

/**
 *
 * @param {ColorRgb} colorRgb
 */
ColorRgb.prototype.subtract = function (colorRgb) {
    this.r -= colorRgb.r;
    this.g -= colorRgb.g;
    this.b -= colorRgb.b;
};

/**
 *
 * @param {ColorRgb} colorRgb
 * @return {boolean}
 */
ColorRgb.prototype.equals = function (colorRgb) {
    return this.r === colorRgb.r && this.g === colorRgb.g && this.b === colorRgb.b;
};

/**
 *
 * @param {ColorRgb} a current color
 * @param {ColorRgb} b new color
 * @constructor
 */
function ColorRgbChangingPair(a, b) {
    this.a = a;
    this.b = b;
}

/**
 *
 * @param {Image} img
 * @param {ColorRgbChangingPair} changingColorPairs
 * @return {string} url
 */
function recolorImage(img, changingColorPairs) {
    var c = document.createElement('canvas');
    var ctx = c.getContext("2d");
    var w = img.width;
    var h = img.height;
    c.width = w;
    c.height = h;
    // draw the image on the temporary canvas
    ctx.drawImage(img, 0, 0, w, h);

    // pull the entire image into an array of pixel data
    var imageData = ctx.getImageData(0, 0, w, h);

    // examine every pixel,
    // change any old rgb to the new-rgb
    for (var i = 0; i < imageData.data.length; i += 4) {
        // is this pixel the old rgb?
        for (var j = 0; j < changingColorPairs.length; j++) {
            var currentColor = changingColorPairs[j].a;
            var newColor = changingColorPairs[j].b;
            if (imageData.data[i] == currentColor.r && imageData.data[i + 1] == currentColor.g && imageData.data[i + 2] == currentColor.b) {
                // change to your new rgb
                imageData.data[i] = newColor.r;
                imageData.data[i + 1] = newColor.g;
                imageData.data[i + 2] = newColor.b;
                break;
            }
        }
    }
    // put the altered data back on the canvas
    ctx.putImageData(imageData, 0, 0);
    var url = c.toDataURL("image/png");
    try {
        c.remove();
    } catch (e) {
        console.error("recolorImage: " + e);
    }
    c = null;
    return url;
}

/**
 *
 * @param {Image} img
 * @param {ColorRgbChangingPair} changingColorPair
 * @return {string} url
 */
function recolorFullImage(img, changingColorPair) {
    var c = document.createElement('canvas');
    var ctx = c.getContext("2d");
    var w = img.width;
    var h = img.height;
    c.width = w;
    c.height = h;
    // draw the image on the temporary canvas
    ctx.drawImage(img, 0, 0, w, h);

    // pull the entire image into an array of pixel data
    var imageData = ctx.getImageData(0, 0, w, h);

    // examine every pixel,
    // change any old rgb to the new-rgb
    var imageDataColor = new ColorRgb(0, 0, 0);
    for (var i = 0; i < imageData.data.length; i += 4) {
        // transparent
        if (imageData.data[i] === 0 && imageData.data[i + 1] === 0 && imageData.data[i + 2] === 0 && imageData.data[i + 3] === 0) {
            continue;
        }

        var currentColor = changingColorPair.a;
        var newColor = changingColorPair.b;
        imageDataColor.set(imageData.data[i], imageData.data[i + 1], imageData.data[i + 2]);

        // offset to main color
        imageDataColor.subtract(currentColor);
        imageDataColor.add(newColor);

        imageData.data[i] = imageDataColor.r;
        imageData.data[i + 1] = imageDataColor.g;
        imageData.data[i + 2] = imageDataColor.b;
    }
    // put the altered data back on the canvas
    ctx.putImageData(imageData, 0, 0);
    var url = c.toDataURL("image/png");
    try {
        c.remove();
    } catch (e) {
        console.error("recolorFullImage: " + e);
    }
    c = null;
    return url;
}
/**
 * @constructor
 */
function AssertException(message) {
	this.message = message;
}

AssertException.prototype.toString = function() {
	return 'AssertException: ' + this.message;
};

function assert(exp, message) {
	if (!exp) {
		throw new AssertException(message);
	}
}var MAX_WIDTH = 1280;
var MAX_HEIGHT = 800;
//
// var MAX_WIDTH = 640;
// var MAX_HEIGHT = 480;

var BASE_WIDTH = 800;
var BASE_HEIGHT = 500;

var ENHANCED_BASE_WIDTH = 1138;
var ENHANCED_BASE_HEIGHT = 640;

var ENHANCED_BASE_MARGIN_WIDTH = 169;
var ENHANCED_BASE_MARGIN_HEIGHT = 70;

var DO_NOT_RESIZE = false;

// Used for Native
var BASE_MARGIN_WIDTH = 0;
var BASE_MARGIN_HEIGHT = 0;
//



var Screen = (function() {
	var screenConsts = {};

	var domForced = false;
	
	// private interface

	// reference to main application class
	var appInstance = null;

	var fieldWidth = BASE_WIDTH;
	var fieldHeight = BASE_HEIGHT;
	var currentFieldHeight, currentFieldWidth, enchancedFieldWidth, enchancedFieldHeight;
	var fullWidth, fullHeight, currentFullWidth, currentFullHeight;

	var rotateMsgHeightWidthRatio;
	
	
	//if fixed
	var fixedWidth = null;
	var fixedHeight = null;

	var oldW = null;
	var oldH = null;
	var orientationFlag = null;

	var widthRatio = 1;
	var heightRatio = 1;

	var offsetX = 0;
	var offsetY = 0;

	var isLandscapeDefault = true;
	var isLandscapeFlag = true;
	var secondTimeInRowOrientationCall = null;
	var secondTimeInRowOrientationCallAttempt = 0;

	// coordinates of the whole screen relative to the root scene
	// Defining this object only once so we can use it as reference
	var fullRect = {
		left : 0,
		top : 0,
		right : 0,
		bottom : 0
	};
	
	if (typeof(Native) != "undefined"){
	    fullRect.right = Native.ScreenWidth;
    	fullRect.bottom = Native.ScreenHeight;
	}

	function windowScrollDown() {
		if (typeof(Native) != "undefined") {
			/// TODO Implement
			return;
		}
		setTimeout(function() {
			window['scrollTo'](0, 1);
		}, 10);
		// .hack for android devices
		setTimeout(function() {
			window['scrollTo'](0, 1);
		}, 500);
	}

	var resizeTimeoutHandle = null;

	function actualResize(w, h) {
		if (Screen.isCorrectOrientation()) {

			// recalculate all field parameters
			var sizeChanged = resizeField(w, h);
			
			if (typeof(Native) == "undefined" && sizeChanged) {
				appInstance.resize();
			}
		}
	}

	function resizeField(w, h) {
		var windowInnerWidth = selectValue(w, window.innerWidth);
		var windowInnerHeight = selectValue(h, window.innerHeight);
		fullWidth = windowInnerWidth;
		fullHeight = windowInnerHeight;

        fieldWidth = Math.min(MAX_WIDTH, windowInnerWidth);
        fieldHeight = Math.min(MAX_HEIGHT, windowInnerHeight);

		// proportionally scale the screen and center it
        var normalK = BASE_WIDTH / BASE_HEIGHT;
        if (fieldWidth / normalK >= fieldHeight) {
            fieldWidth = Math.ceil(fieldHeight * normalK);
        } else {
            fieldHeight = Math.ceil(fieldWidth / normalK);
        }

        enchancedFieldWidth = fieldWidth * (ENHANCED_BASE_WIDTH/BASE_WIDTH);
        enchancedFieldHeight = fieldHeight * (ENHANCED_BASE_HEIGHT/BASE_HEIGHT);

		// nothing to do if field size didn't change
		if (currentFieldHeight == fieldHeight
				&& currentFieldWidth == fieldWidth
				&& currentFullWidth == fullWidth
				&& currentFullHeight == fullHeight) {
			return false;
		}

        var offsetXroot = Math.round((enchancedFieldWidth - fieldWidth) / 2);
        var offsetYroot = Math.round((enchancedFieldHeight - fieldHeight) / 2);
        offsetX = Math.round((windowInnerWidth - fieldWidth) / 2);
        offsetY = Math.round((windowInnerHeight - fieldHeight) / 2);

		currentFullWidth = fullWidth;
		currentFullHeight = fullHeight;

		currentFieldHeight = fieldHeight;
		currentFieldWidth = fieldWidth;

		// alert("actualResize " + currentFullWidth + ", " + currentFullHeight);

		widthRatio = fieldWidth / BASE_WIDTH;
		heightRatio = fieldHeight / BASE_HEIGHT;

		var rootDiv = $('#root');
        if (rootDiv.length > 0) {
            rootDiv['css']("left", offsetXroot);
            rootDiv['css']("top", offsetYroot);
        }

        var allDiv = $('#all');
        if (allDiv.length > 0) {
            allDiv['css']("width", enchancedFieldWidth);
            allDiv['css']("height", enchancedFieldHeight);
            allDiv['css']("marginLeft", -enchancedFieldWidth/2);
            allDiv['css']("marginTop", -enchancedFieldHeight/2);
        }

		// Size for the rect of maximum size with root div
		// of base size in the center
		fullRect.left = -Screen.offsetX();
		fullRect.top = -Screen.offsetY();
		fullRect.right = -Screen.offsetX() + Screen.fullWidth();
		fullRect.bottom = -Screen.offsetY() + Screen.fullHeight();
		fullRect.width = fullRect.right - fullRect.left;
		fullRect.height = fullRect.bottom - fullRect.top;
		fullRect.offsetX = 0;
		fullRect.offsetY = 0;
		return true;
	}
	
	var resizeRotateMsg = function(w, h) {
		var obj = $("#rotateMsg");
		if (typeof rotateMsgHeightWidthRatio != "number") {
			rotateMsgHeightWidthRatio = obj.height() / obj.width();
		}

		var windowInnerWidth = selectValue(w, window.innerWidth);
		var rotateMsgW = Math.min(MAX_WIDTH, windowInnerWidth);
		var rotateMsgH = rotateMsgW * rotateMsgHeightWidthRatio;
		obj.width(rotateMsgW);
		obj.height(rotateMsgH);
	};
	
	function windowOnResize(event, w, h) {
		// TODO Should it be so?
		if (typeof(Native) != "undefined") {
//		    	var BASE_MARGIN_WIDTH = (Native.ScreenWidth - BASE_WIDTH)/2;
//		    	var BASE_MARGIN_HEIGHT  = (Native.ScreenHeight - BASE_HEIGHT)/2;
//		         
//		         ENHANCED_BASE_MARGIN_WIDTH = (ENHANCED_BASE_WIDTH - Native.ScreenWidth)/2;
//		         ENHANCED_BASE_MARGIN_HEIGHT = (ENHANCED_BASE_HEIGHT - Native.ScreenHeight)/2;
//		         
//		    	var rootDiv = $('#root');
//		        if (rootDiv.length > 0) {
//		            rootDiv['css']("left", ENHANCED_BASE_MARGIN_WIDTH);
//		            rootDiv['css']("top", ENHANCED_BASE_MARGIN_HEIGHT);
//		        }
//		        
//		       Native.Screen.SetBaseMargins(BASE_MARGIN_WIDTH, BASE_MARGIN_HEIGHT,
//		    		   ENHANCED_BASE_MARGIN_WIDTH, ENHANCED_BASE_MARGIN_HEIGHT);
 			    		
		    		return;
		}
		
		
		if(DO_NOT_RESIZE){
			return;
		}
		if(fixedWidth){
			w = fixedWidth;
		}
		if(fixedHeight){
			h = fixedHeight;
		}
		
//		oldW = null;
//		oldH = null;
		orientationFlag = null;
		
		if (!Screen.isCorrectOrientation()) {
			if (!Loader.loadingMessageShowed()) {
				resizeRotateMsg(w, h);
				$("#rotateMsg")['css']("display", "block");
				$("#rotateMsg")['css']("z-index", 99999999);
				orientationFlag = true;
			}
		} else {
			// absorb nearly simultaneous calls to resize
			if (Screen.orientationChanged() || (oldW != w || oldH != h)) {
				oldW = w;
				oldH = h;
				
				clearTimeout(resizeTimeoutHandle);
				resizeTimeoutHandle = setTimeout(function() {actualResize(w, h); }, 100);
			}
			
			windowScrollDown();
			
			$("#rotateMsg")['css']("z-index", 0);
			$("#rotateMsg")['css']("display", "none");
			
			orientationFlag = false;
		}
			
		// A little hack for S3
		setTimeout(function() {
			if (!Screen.isCorrectOrientation()) {
				if (!Loader.loadingMessageShowed()) {
					resizeRotateMsg(w, h);
					$("#rotateMsg")['css']("display", "block");
					$("#rotateMsg")['css']("z-index", 99999999);
				}
			} else {
				// absorb nearly simultaneous calls to resize
				clearTimeout(resizeTimeoutHandle);
				resizeTimeoutHandle = setTimeout(function() {actualResize(w, h); }, 100);
				windowScrollDown();

				$("#rotateMsg")['css']("z-index", 0);
				$("#rotateMsg")['css']("display", "none");
			}
		}, 500);
		// alert("resize " + Screen.isCorrectOrientation());
		
		return;
	}

	return { // public interface
		init : function(application, isLandscape, params) {
			appInstance = application;

			params = selectValue(params, {});
			

			// inverse default values
			if (isLandscape === false) {
				var buffer = BASE_HEIGHT;
				BASE_HEIGHT = BASE_WIDTH;
				BASE_WIDTH = buffer;

				buffer = ENHANCED_BASE_HEIGHT;
				ENHANCED_BASE_HEIGHT = ENHANCED_BASE_WIDTH;
				ENHANCED_BASE_WIDTH = buffer;

				buffer = ENHANCED_BASE_MARGIN_HEIGHT;
				ENHANCED_BASE_MARGIN_HEIGHT = ENHANCED_BASE_MARGIN_WIDTH;
				ENHANCED_BASE_MARGIN_WIDTH = buffer;

				buffer = MAX_WIDTH;
				MAX_HEIGHT = MAX_WIDTH;
				MAX_WIDTH = buffer;
			}
			// read user provided values if any
			if(isLandscape === "fixed"){
				this.fixedSize = true;
				fixedWidth = params['width'];
				fixedHeight = params['height'];
//				console.log("FIXED");
//				BASE_WIDTH = selectValue(params['MAX_WIDTH'], BASE_WIDTH);
//				console.log("BASE_WIDTH", BASE_WIDTH);
//				BASE_HEIGHT = selectValue(params['MAX_HEIGHT'], BASE_HEIGHT);
//				console.log("BASE_HEIGHT", BASE_HEIGHT);
//				MAX_WIDTH = selectValue(params['MAX_WIDTH'], MAX_WIDTH);
//				MAX_HEIGHT = selectValue(params['MAX_HEIGHT'], MAX_HEIGHT);
//				ENHANCED_BASE_WIDTH = selectValue(params['MAX_WIDTH'],
//						ENHANCED_BASE_WIDTH);
//				ENHANCED_BASE_HEIGHT = selectValue(params['MAX_HEIGHT'],
//						ENHANCED_BASE_HEIGHT);
//				ENHANCED_BASE_MARGIN_WIDTH = 0;
//				ENHANCED_BASE_MARGIN_HEIGHT = 0;
				
				
			}else{
				BASE_WIDTH = selectValue(params['BASE_WIDTH'], BASE_WIDTH);
				BASE_HEIGHT = selectValue(params['BASE_HEIGHT'], BASE_HEIGHT);
				MAX_WIDTH = selectValue(params['MAX_WIDTH'], MAX_WIDTH);
				MAX_HEIGHT = selectValue(params['MAX_HEIGHT'], MAX_HEIGHT);
				ENHANCED_BASE_WIDTH = selectValue(params['ENHANCED_BASE_WIDTH'],
						ENHANCED_BASE_WIDTH);
				ENHANCED_BASE_HEIGHT = selectValue(params['ENHANCED_BASE_HEIGHT'],
						ENHANCED_BASE_HEIGHT);
				ENHANCED_BASE_MARGIN_WIDTH = selectValue(
						params['ENHANCED_BASE_MARGIN_WIDTH'],
						ENHANCED_BASE_MARGIN_WIDTH);
				ENHANCED_BASE_MARGIN_HEIGHT = selectValue(
						params['ENHANCED_BASE_MARGIN_HEIGHT'],
						ENHANCED_BASE_MARGIN_HEIGHT);
			}
			

			screenConsts = {
				"BASE_WIDTH" : BASE_WIDTH,
				"BASE_HEIGHT" : BASE_HEIGHT,
				"ENHANCED_BASE_WIDTH" : ENHANCED_BASE_WIDTH,
				"ENHANCED_BASE_HEIGHT" : ENHANCED_BASE_HEIGHT,
				"ENHANCED_BASE_MARGIN_WIDTH" : ENHANCED_BASE_MARGIN_WIDTH,
				"ENHANCED_BASE_MARGIN_HEIGHT" : ENHANCED_BASE_MARGIN_HEIGHT,
				"-ENHANCED_BASE_MARGIN_WIDTH" : -ENHANCED_BASE_MARGIN_WIDTH,
				"-ENHANCED_BASE_MARGIN_HEIGHT" : -ENHANCED_BASE_MARGIN_HEIGHT
			};

			if ("onorientationchange" in window
					&& !params['disableOrientation']) {
				if (isLandscape == false) {
					isLandscapeDefault = false;
					$('head')['append']
							('<link rel="stylesheet" href="css/orientationPortrait.css" type="text/css" />');
				} else {
					isLandscapeDefault = true;
					$('head')['append']
							('<link rel="stylesheet" href="css/orientationLandscape.css" type="text/css" />');
				}
			} else {
				isLandscapeDefault = null;
				$('#rotateMsg').remove();
			}

			disableTouchEvents();

			$(window)['resize'](windowOnResize);

			$(window)['bind']("scrollstart", function(e) {
				windowScrollDown();
			});
			$(window)['bind']("scrollstop", function(e) {
				windowScrollDown();
			});

			$(window)['trigger']("orientationchange");

			// For iPhones we will force hiding address bar
			// cause there's no scroll event executes when user shows bar
			// by pressing on status bar panel
			if (Device.is("iphone") || Device.is("ipod")) {
				setInterval(windowScrollDown, 5000);
			}

			// Zynga's viewport single reference in code
			// orientation locking
			$(window)['bind']('viewportready viewportchange', function() {
				$(window)['trigger']("resize");
				return;
			});

            $(window)['trigger']("resize");
		},

		// some portals (like Spil Games) will require manual resize function
		windowOnResize : function(w, h) {
			console.log("Window resize: " + w+ "; " + h);
			windowOnResize(null, w, h);
		},
		
		setLandscapeDefault : function(landscapeDefault) {
			isLandscapeDefault = landscapeDefault;
		},

		isCorrectOrientation : function() {
			var isPortrait = window.innerWidth / window.innerHeight < 1.1;
			// alert("correct orient " + window.innerWidth + ", "
			// + window.innerHeight + ", " + window.orientation);
			return (isLandscapeDefault == null)
					|| (isLandscapeDefault === !isPortrait);
		},
		orientationChanged : function() {
			if (isLandscapeDefault == null) {
				return true;
			} else {
				return !orientationFlag;
			}
		},
		isLandscape : function() {
			if (typeof(Native) != "undefined") {
				// TODO Implement
				console.log("Screen.isLandscape is not implemented");
				return true;
			}
			return viewporter.isLandscape();
		},
		widthRatio : function() {
			if (this.fixedSize == true)
				return 1;
			return widthRatio;
		},
		heightRatio : function() {
			if (this.fixedSize == true)
				return 1;
			return heightRatio;
		},
		// Size of the working screen field
		fieldWidth : function() {
			return currentFieldWidth;
		},
		fieldHeight : function() {
			return currentFieldHeight;
		},
		// Offset for the 'Root' object
		offsetX : function() {
			return offsetX / widthRatio;
		},
		offsetY : function() {
			return offsetY / heightRatio;
		},
		// Size of the whole window
		fullWidth : function() {
			return currentFullWidth / widthRatio;
		},
		fullHeight : function() {
			return currentFullHeight / heightRatio;
		},
		fullRect : function() {
			return fullRect;
		},
		// Screen size by setup by design
		baseWidth : function() {
			return BASE_WIDTH;
		},
		baseHeight : function() {
			return BASE_HEIGHT;
		},
		// for reading numeric constants from JSON
		macro : function(val) {
			if (typeof val == "string") {
				var preprocessedVal = screenConsts[val];
				return preprocessedVal ? preprocessedVal : val;
			}
			return val;
		},
		// Calculating size real in pixels
		// from logic base pixel size
		calcRealSize : function(width, height) {
			if (typeof (width) == "number") {
				width = Math.round(Screen.widthRatio() * width);
			} else if (width == "FULL_WIDTH") {
				width = currentFullWidth;
			}

			if (typeof (height) == "number") {
				height = Math.round(Screen.heightRatio() * height);
			} else if (height == "FULL_HEIGHT") {
				height = currentFullHeight;
			}

			return {
				x : width,
				y : height
			};
		},
		// Calculating size in logic pixels
		// from real pixel's size
		calcLogicSize : function(width, height) {
			return {
				x : (width / Screen.widthRatio()),
				y : (height / Screen.heightRatio())
			};
		},
		isDOMForced : function() {
			return domForced;
		},
		setDOMForced : function(forceDom) {
			domForced = forceDom;
		}
	};
})();


// Global vars for touch event handling
var touchStartX = 0;
var touchStartY = 0;
var touchEndX = 0;
var touchEndY = 0;

var mobileBrowser = null;
function isMobile() {
	// return Crafty.mobile;

	if (mobileBrowser != null) {
		return mobileBrowser;
	}

	var ua = navigator.userAgent.toLowerCase(), match = /(webkit)[ \/]([\w.]+)/.exec(ua) || /(o)pera(?:.*version)?[ \/]([\w.]+)/.exec(ua) || /(ms)ie ([\w.]+)/.exec(ua)
			|| /(moz)illa(?:.*? rv:([\w.]+))?/.exec(ua) || [], mobile = /iPad|iPod|iPhone|Android|webOS/i.exec(ua);

	// if (mobile)
	// Crafty.mobile = mobile[0];
	mobileBrowser = mobile;

	return mobileBrowser;
}

var disableTouchEvents = function() {
	if (isMobile()) {
		document.body.ontouchmove = function(e) {
			e.preventDefault();
		};
		document.body.ontouchstart = function(e) {
			e.preventDefault();
		};
		document.body.ontouchend = function(e) {
			e.preventDefault();
		};
	}
};

var enableTouchEvents = function(push) {
	if (isMobile()) {
		document.body.ontouchstart = function(e) {
			e.preventDefault();
			// if (levelStarted) {
			touchStartX = touchEndX = e.touches[0].pageX;
			touchStartY = touchEndY = e.touches[0].pageY;
			// } else {
			// touchStartX = touchEndX = null;
			// touchStartY = touchEndY = null;
			// }
			return false;
		};

		document.body.ontouchmove = function(e) {
			e.preventDefault();
			// if (levelStarted) {
			touchEndX = e.touches[0].pageX;
			touchEndY = e.touches[0].pageY;
			// }
			//push(e);
			return false;
		};

		document.body.ontouchend = function(e) {
			e.preventDefault();
			if (touchEndX && touchEndY) {
				var e1 = {};
				e1.pageX = touchEndX;
				e1.pageY = touchEndY;
				//push(e1);
			}
			return false;
		};
	}
};
// Last updated September 2011 by Simon Sarris
// www.simonsarris.com
// sarris@acm.org
//
// Free to use and distribute at will
// So long as you are nice to people, etc

// Simple class for keeping track of the current transformation matrix

// For instance:
//    var t = new Transform();
//    t.rotate(5);
//    var m = t.m;
//    ctx.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]);

// Is equivalent to:
//    ctx.rotate(5);

// But now you can retrieve it :)

// Remember that this does not account for any CSS transforms applied to the canvas

/**
 * @constructor
 */
function Transform() {
  this.m = [1,0,0,1,0,0];
}

Transform.prototype.reset = function() {
  this.m = [1,0,0,1,0,0];
};

Transform.prototype.multiply = function(matrix) {
  var m11 = this.m[0] * matrix.m[0] + this.m[2] * matrix.m[1];
  var m12 = this.m[1] * matrix.m[0] + this.m[3] * matrix.m[1];

  var m21 = this.m[0] * matrix.m[2] + this.m[2] * matrix.m[3];
  var m22 = this.m[1] * matrix.m[2] + this.m[3] * matrix.m[3];

  var dx = this.m[0] * matrix.m[4] + this.m[2] * matrix.m[5] + this.m[4];
  var dy = this.m[1] * matrix.m[4] + this.m[3] * matrix.m[5] + this.m[5];

  this.m[0] = m11;
  this.m[1] = m12;
  this.m[2] = m21;
  this.m[3] = m22;
  this.m[4] = dx;
  this.m[5] = dy;
};

Transform.prototype.invert = function() {
  var d = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]);
  var m0 = this.m[3] * d;
  var m1 = -this.m[1] * d;
  var m2 = -this.m[2] * d;
  var m3 = this.m[0] * d;
  var m4 = d * (this.m[2] * this.m[5] - this.m[3] * this.m[4]);
  var m5 = d * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
  this.m[0] = m0;
  this.m[1] = m1;
  this.m[2] = m2;
  this.m[3] = m3;
  this.m[4] = m4;
  this.m[5] = m5;
};

Transform.prototype.rotate = function(rad) {
  var c = Math.cos(rad);
  var s = Math.sin(rad);
  var m11 = this.m[0] * c + this.m[2] * s;
  var m12 = this.m[1] * c + this.m[3] * s;
  var m21 = this.m[0] * -s + this.m[2] * c;
  var m22 = this.m[1] * -s + this.m[3] * c;
  this.m[0] = m11;
  this.m[1] = m12;
  this.m[2] = m21;
  this.m[3] = m22;
};

Transform.prototype.rotateDegrees = function(angle) {
  var rad = angle * Math.PI / 180;
  var c = Math.cos(rad);
  var s = Math.sin(rad);
  var m11 = this.m[0] * c + this.m[2] * s;
  var m12 = this.m[1] * c + this.m[3] * s;
  var m21 = this.m[0] * -s + this.m[2] * c;
  var m22 = this.m[1] * -s + this.m[3] * c;
  this.m[0] = m11;
  this.m[1] = m12;
  this.m[2] = m21;
  this.m[3] = m22;
};

Transform.prototype.translate = function(x, y) {
  this.m[4] += this.m[0] * x + this.m[2] * y;
  this.m[5] += this.m[1] * x + this.m[3] * y;
};

Transform.prototype.scale = function(sx, sy) {
  this.m[0] *= sx;
  this.m[1] *= sx;
  this.m[2] *= sy;
  this.m[3] *= sy;
};

Transform.prototype.transformPoint = function(px, py) {
  var x = px;
  var y = py;
  px = x * this.m[0] + y * this.m[2] + this.m[4];
  py = x * this.m[1] + y * this.m[3] + this.m[5];
  return [px, py];
};/**
 * Device Properties
 */

var USE_NATIVE_RENDER = true;
var Device = (function() {
    // private interface

    var storagePrefix = "";
    var storageSupported = null;

    var reserveStorage = {};

    var userAgentParsed = null;
    var androidOsVersion = null;
    var isAppleMobileOs = null;
    var isIpod = null;
    var iOS = null;
    var isIeBrowser = null;
    var isWebkitBrowser = null;
    var isAndroidStockBrowser = null;

    var userAgent = null;
    var isSupportsToDataURL;

    // result of a benchmark test
    // currently set as percentage of IPhone 4
    var benchmarkTest = 9999;

    var touchStartX, touchStartY, touchEndX, touchEndY;

    var nativeRender = (USE_NATIVE_RENDER && window.NativeRender) ? window.NativeRender
        : null;

    var isNative = typeof(Native) != 'undefined' && Native.Screen ;

    function parseUserAgent() {
        if (userAgentParsed)
            return;
        userAgent = navigator.userAgent.toLowerCase();

        // check apple iOs
        isAppleMobileOs = (/iphone|ipod|ipad/gi).test(navigator.platform);
        isIpod = (/iphone|ipod/gi).test(navigator.platform);

        isWebkitBrowser = userAgent.indexOf("webkit") > -1;

        var nua = navigator.userAgent;
        isAndroidStockBrowser = ((nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1) && !(nua.indexOf('Chrome') > -1));
        // check android version
        var androidStr = "android";
        var idx1 = userAgent.indexOf(androidStr);
        if (idx1 > -1) {
            var idx2 = idx1 + androidStr.length;
            var idx3 = userAgent.indexOf(";", idx2);
            var ver = userAgent.substring(idx2, idx3);
            // TODO make correct version parsing
            androidOsVersion = parseFloat(ver);
        }
        userAgentParsed = true;
    }

    function defaultTouchEvents() {
        if (!Device.isTouch())
            return;

        document.ontouchstart = function(e) {
            e.preventDefault();
            touchStartX = touchEndX = e.touches[0].pageX;
            touchStartY = touchEndY = e.touches[0].pageY;
            return false;
        };

        document.ontouchmove = function(e) {
            e.preventDefault();
            touchEndX = e.touches[0].pageX;
            touchEndY = e.touches[0].pageY;
            return false;
        };

        document.ontouchend = function(e) {
            e.preventDefault();
            if (touchEndX && touchEndY) {
                var e1 = {};
                e1.pageX = touchEndX;
                e1.pageY = touchEndY;
            }
            return false;
        };
    }

    //requestAnimationFrame crossbrowser
    window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame
    })();
    // test to find out relative speed of device
    // and switch graphics resolution accordingly
    function runBenchmark() {
        var IPHONE_4_TIME = 12;
        var time;
        var startTime = new Date(), iterations = 20000;
        while (iterations--) {
            Math.sqrt(iterations * Math.random());
        }
        // adding 1ms to avoid division by zero
        time = (new Date - startTime) + 1;
        benchmarkTest = 100 * IPHONE_4_TIME / time;
        // alert("test " + benchmarkTest + " time " + time);
    }

    function iOSVersion() {
        return parseFloat(
            ('' + (/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [0,''])[1])
                .replace('undefined', '3_2').replace('_', '.').replace('_', '')
        ) || false;
    }

    function supportsHtml5Storage() {
        if (storageSupported == null) {
            try {
                storageSupported = 'localStorage' in window
                    && window['localStorage'] !== null;
                // making full test, because while in "private" browsing
                // mode on safari setItem is forbidden
                var storage = window['localStorage'];
                storage.setItem("test", "test");
                storage.getItem("test");
            } catch (e) {
                console.error("Local storage not supported!");
                storageSupported = false;
            }
        }
        return storageSupported;
    }

    return { // public interface
        init : function(params) {
            parseUserAgent();

            /*
             * Add web icons icon114x114.png - with opaque background for iOS
             * devices icon114x114alpha.png - with alpha background for Androids
             *
             */
            params = selectValue(params, {});
            Device.setStoragePrefix(selectValue(params.name, ""));

            var icon114x114 = selectValue(params.icon, "images/icon114x114.png");
            var icon114x114alpha = selectValue(params.iconAlpha,
                "images/icon114x114alpha.png");

            $('head')['append']('<link rel="apple-touch-icon"  href="'
                + icon114x114 + '" />');
            if (Device.isAndroid()) {
                // add web app icon with alpha, otherwise it will
                // overwrite iPad icon
                $('head')['append']
                ('<link rel="apple-touch-icon-precomposed" href="'
                    + icon114x114alpha + '" />');
            }

            defaultTouchEvents();
            runBenchmark();

            /**
             *
             * @return {boolean} support context.GetImageData()
             */
            function supportsToDataURL() {
                if (isAndroidStockBrowser || Device.isNative()) {
                    console.log("supportsToDataURL is not implemented")
                    return false;
                }
                var c = document.createElement("canvas");
                var data = c.toDataURL("image/png");
                return (data.indexOf("data:image/png") == 0);
            }

            isSupportsToDataURL = supportsToDataURL();
        },
        setStoragePrefix : function(val) {
            assert(typeof(val) == "string", "Wrong storage prefix: " + val);
            storagePrefix = val + "_";
        },
        setStorageItem : function(key, val) {
            if (Device.isNative()) {
                if (typeof(val) == "undefined" || typeof(val) == "function")
                    return;
                switch(typeof(val)) {
                    case "string":
                        break;
                    case "number":
                        break;
                    case "object":
                        val = JSON.stringify(val);
                        break;
                };
                Native.Storage.SaveToIsolatedStorage(storagePrefix + key, val);
                return;
            }
            if (supportsHtml5Storage()) {
                var storage = window['localStorage'];
                storage.setItem(storagePrefix + key, val);
            } else {
                reserveStorage[storagePrefix + key] = val;
            }
        },
        getStorageItem : function(key, defaultVal) {
            if (Device.isNative()){
                var answer = Native.Storage.GetFromIsolatedStorage(storagePrefix + key);
                if (answer == null || answer == "" || answer == "null")
                    answer = defaultVal;
                else if (!isNaN(answer))
                    answer *= 1;
                else if (answer == "true")
                    answer = true;
                else if (answer == "false")
                    answer = false;
//	        	else if (answer.indexOf("{") == 0)
//	        		answer = JSON.parse(answer);
                return answer;
            }
            if (supportsHtml5Storage()) {
                var storage = window['localStorage'];
                var val = storage.getItem(storagePrefix + key);
                return (val != null) ? val : defaultVal;
            } else {
                if (reserveStorage[storagePrefix + key])
                    return reserveStorage[storagePrefix + key];
                return defaultVal;
            }
        },

        removeStorageItem : function(key) {
            if (Device.isNative()) {
                ///TODO Implement Storage item removal for native
                return;
            }
            if (supportsHtml5Storage()) {
                var storage = window['localStorage'];
                storage.removeItem(key);
            } else {
                if (reserveStorage[key])
                    delete reserveStorage[key];
            }
        },

        is : function(deviceName) {
            if (Device.isNative()) {
                ///TODO Implement
                return "Not implemented";
            }
            return (userAgent.indexOf(deviceName) > -1);
        },
        isAndroid : function() {
            if (Device.isNative()) {
                ///TODO Implement
                return "Not implemented";
            }
            return androidOsVersion != null;
        },

        androidVersion : function() {
            if (Device.isNative()) {
                ///TODO Implement
                return "Not implemented";
            }
            return androidOsVersion;
        },

        isWebkit : function() {
            if (Device.isNative()) {
                ///TODO Implement
                return "Not implemented";
            }
            return isWebkitBrowser;
        },

        isAppleMobile : function() {
            if (Device.isNative()) {
                ///TODO Implement
                return "Not implemented";
            }
            return isAppleMobileOs;
        },

        isIpodDevice : function() {
            if (Device.isNative()) {
                ///TODO Implement
                return "Not implemented";
            }
            return isIpod;
        },

        isMobile : function() {
            if (Device.isNative()) {
                ///TODO Implement
                return "Not implemented";
            }
            return Device.isTouch();
        },

        isNative : function() {
            return isNative;
        },

        supports3dTransfrom : function() {
            return false;//Modernizr.csstransforms3d;
        },
        nativeRender : function() {
            if (Device.isNative()) {
                ///TODO Not implemented
                return null;
            }
            return nativeRender;
        },

        /*
         * Touch events
         *
         */

        isTouch : function() {
            if (Device.isNative()) {
                ///TODO Not implemented
                return false;
            }
            return 'ontouchstart' in document.documentElement;
        },
        getPositionFromEvent : function(e) {
            if (e['originalEvent'] && e['originalEvent'].touches && e['originalEvent'].touches[0]) {
                // alert(" touch " + e.touches[0].pageX);
                return {
                    x : e['originalEvent']['touches'][0].pageX,
                    y : e['originalEvent']['touches'][0].pageY
                };
            }
            if (e['originalEvent'] && !e['originalEvent'].touches) {
                if (e['originalEvent'].pageX) {
                    return {
                        x : e['originalEvent'].pageX,
                        y : e['originalEvent'].pageY
                    };
                }
            }
            if (e['touches']) {
                return {
                    x : e['touches'][0].pageX,
                    y : e['touches'][0].pageY
                };
            }

            return {
                x : e.pageX,
                y : e.pageY
            };
        },
        getLogicPositionFromEvent : function(e) {
            var pos = Device.getPositionFromEvent(e);
            return {
                x : pos.x / Screen.widthRatio() - Screen.offsetX(),
                y : pos.y / Screen.heightRatio() - Screen.offsetY()
            };
        },
        event : function(eventName) {
            var result;
            switch (eventName) {
                case 'click':
                    result = Device.isTouch() ? 'touchstart' : 'click';
                    break;
                case 'cursorDown':
                    result = Device.isTouch() ? 'touchstart' : 'mousedown';
                    break;
                case 'cursorUp':
                    result = Device.isTouch() ? 'touchend' : 'mouseup';
                    break;
                case 'cursorMove':
                    result = Device.isTouch() ? 'touchmove' : 'mousemove';
                    break;
                case 'cursorOut':
                    result = Device.isTouch() ? 'touchstart' : 'mouseout';
                    break;
                case 'cursorOver':
                    result = Device.isTouch() ? 'touchstart' : 'mouseover';
                    break;
                default:
                    assert(false, "Unrecognizible event " + eventName);
                    result = eventName;
                    break;
            }
            return result;
        },

        touchStartX : function() {
            return touchStartX;
        },
        touchStartY : function() {
            return touchStartY;
        },
        touchEndX : function() {
            return touchEndX;
        },
        touchEndY : function() {
            return touchEndY;
        },
        isWindowsPhone: function () {
            var regExp = new RegExp("Windows Phone", "i");
            return navigator.userAgent.match(regExp);
        },

        // becnmark test for slow devices
        isSlow : function() {
            if (Device.isNative() || Device.isWindowsPhone()) {
//				 alert("I'm native, or windows");
                return false;
            }
//			if (Device.isIpodDevice()) {
////				 alert("I'm ipod");
//				return true;
//			}
            if (Device.isAppleMobile()) {
                if (iOSVersion() < 7) {
//					alert("I'm too old for this... iOS"+iOSVersion());
                    return true;
                } else {
//					alert("I'm so good... iOS"+iOSVersion());
                }
            }
            if ((Device.isAndroid() && Device.androidVersion() < 2.3)
                || benchmarkTest < 80) {
//				 alert("Yes, we are slow = " + benchmarkTest);
                return true;
            } else {
//				 alert("We are fast = " + benchmarkTest);
                return false;
            }
        },

        isSupportsToDataURL: function () {
            return isSupportsToDataURL;
        },

        isAndroidStockBrowser: function() {
            return isAndroidStockBrowser;
        },

        /*
         * Miscellaneous functions
         */

        // shows apple 'Add to home' pop-up
        addToHomeOpenPopup : function() {
            window['addToHomeOpen']();
        }
    };
})();/**
 * Drag'n'Drop utilities
 */

var DragManager = (function() {
	// private interface
	var dragItem = null;

	var dragListeners = new Array();

	function cursorMove(e) {
		// console.log("cursorMove");
		if (dragItem) {
			// console.log("cursorMove dragItem");
			dragItem.dragMove(e);
			// notify listeners
			$['each'](dragListeners, function(id, obj) {
				if (obj.isEventIn(e)) {
					if (!obj.dragItemEntered) {
						// item enters listener zone
						// for the first time
						if (obj.onDragItemEnter) {
							obj.onDragItemEnter(dragItem);
						}
						obj.dragItemEntered = true;
					}
				} else if (obj.dragItemEntered) {
					// item moves out from listener zone
					if (obj.onDragItemOut) {
						obj.onDragItemOut(dragItem);
					}
					obj.dragItemEntered = false;
				}
			});
		}
	}

	function cursorUp() {
		if (dragItem) {

			// notify listeners
			var dragListenerAccepted = null;
			$['each'](dragListeners, function(id, obj) {
				if (obj.dragItemEntered) {
					if (!dragListenerAccepted && obj.onDragItemDrop) {
						if (obj.onDragItemDrop(dragItem)) {
							dragListenerAccepted = obj;
						}
					} else if (obj.onDragItemOut) {
						obj.onDragItemOut(dragItem);
					}
					obj.dragItemEntered = false;
				}
			});
			// console.log("dragCursorUp");
			dragItem.dragEnd(dragListenerAccepted);
			dragItem = null;
		}
	}

	var isInit = false;
	function init() {
		$(document)['bind'](Device.event("cursorUp"), cursorUp);
		$(document)['bind'](Device.event("cursorMove"), cursorMove);
		isInit = true;
	}

	return { // public interface
		//
		addListener : function(listener) {
			assert(listener instanceof GuiDiv,
					"Trying to add illegal drag'n'drop listener. Should be GuiDiv");
			listener.dragItemEntered = false;
			dragListeners.push(listener);
			// sort listeners by priority
			dragListeners.sort(function(l1, l2) {
				var z1 = l1.dragListenerPriority ? l1.dragListenerPriority : 0;
				var z2 = l2.dragListenerPriority ? l2.dragListenerPriority : 0;
				return z2 - z1;
			});
		},
		removeListener : function(listener) {
			popElementFromArray(listener, dragListeners);
		},
		setItem : function(item, e) {
			if (!isInit) {
				init();
			}

			if (dragItem && dragItem.dragEnd) {
				dragItem.dragEnd();
			}
			dragItem = item;

			// immediately update dragListeners
			cursorMove(e);
		},
		getItem : function() {
			return dragItem;
		}
	};
})();
/*
 *  Abstract Factory 
 */
/**
 * @constructor
 */
function AbstractFactory() {
	var objectLibrary = new Object();

	this.addClass = function(clazz, createFunction) {
		var classId;
		if(typeof(clazz) == "function") {
			classId = clazz.prototype.className;
			createFunction = clazz.prototype.createInstance;
		} else {
			classId = clazz;
		}
		
		assert(typeof (classId) == "string", "Invalid classId: " + classId);
		assert(typeof (createFunction) == "function", "Invalid createInstance function for" + " classId " + classId);
		objectLibrary[classId] = createFunction;
	};

	this.createObject = function(classId, args) {
		var createFunc = objectLibrary[classId];
		assert(typeof (createFunc) == "function", "classId: " + classId + " was not properly registered.");
		var obj = null;
		if (typeof (args) == "array") {
			obj = createFunc.apply(null, args);
		} else {
			obj = createFunc.call(null, args);
		}
		return obj;
	};

	this.createObjectsFromJson = function(jsonData, preprocessParamsCallback, onCreateCallback) {
		var objects = new Object();
		var that = this;
		$['each'](jsonData, function(name, value) {
			var params = value["params"];
			assert(params, "Params field not specified in '" + name + "'");
			params['name'] = name;
			if (preprocessParamsCallback) {
				preprocessParamsCallback(name, params);
			}
            var obj = that.createObject(value["class"], params);
			objects[name] = obj;
			if (onCreateCallback) {
				onCreateCallback(name, obj, params);
			}
		});

		return objects;
	};
};
//////////////////
/**
 * Resource Manager
 */

var Resources = (function() {
	// private interface
	var assets = new Array();

	var images = new Array();
	var resolutions = new Object();

	// enum of strings of current language
	var strings = new Object();

	var currentResolution = null;
	var defaultResolution = null;

	var loadImage = function(src, callback) {
		var image = new Image();
		image.src = src;
		image.onload = callback;
		return image;
	};

	return { // public interface

		init : function() {
		},

		setResolution : function(resolutionName) {
			assert(resolutions[resolutionName], "Resolution " + resolutionName
					+ " not exists!");
			currentResolution = resolutionName;
		},
		// if there's no picture in current resolution
		// it will be looking in default
		setDefaultResolution : function(resolutionName) {
			assert(resolutions[resolutionName], "Resolution " + resolutionName
					+ " not exists!");
			defaultResolution = resolutionName;
		},

		addResolution : function(resolutionName, imagesFolder, isDefault) {
			assert(!resolutions[resolutionName], "Resolution " + resolutionName
					+ " already exists!");
			resolutions[resolutionName] = {
				folder : imagesFolder,
				images : new Object()
			};

			if (isDefault) {
				Resources.setResolution(resolutionName);
				Resources.setDefaultResolution(resolutionName);
			}
		},

		addImage : function(name, resolution) {
			var resArray;
			if (typeof (resolution) == "string") {
				resArray = new Array();
				resArray(resolution);
			} else if (typeof (resolution) == "array") {
				resArray = resolution;
			} else {
				// adding on available resolutions
				resArray = new Array();
				for ( var i in resolutions) {
					resArray.push(i);
				}
			}

			for ( var i = 0; i < resArray.length; i++) {
				var resolutionName = resArray[i];
				assert(resolutions[resolutionName], "Resolution "
						+ resolutionName + " not exists!");
				resolutions[resolutionName].images[name] = name;
			}
		},
		// returnes string
		getString : function(stringId, rand) {
			if (strings[stringId]) {
			var str = strings[stringId];
				if(strings[stringId] instanceof Array){
					if (rand == false) {
						return strings[stringId];
					}
					var lbl = str[Math.floor(Math.random() * strings[stringId].length)];
					return lbl; 
				}
				return strings[stringId];
			} else {
				// console.error(stringId + " Not Found");
				return stringId;
			}

		},
		// loads json with set language
		setLanguage : function(language, array) {
			if ((array == true) && (typeof language == "object")) {
				strings = language;
			} else {
				var fileName = "resources/localization/" + language + ".json";
				$['getJSON'](fileName, function(data) {
					strings = data;
				});
			}
		},
		// returns filename of an image for current resolution
		getImage : function(name, preload, preloadCallback) {
			var imageFilename = null;
			var image = null;

			// we are not using resolutions
			if (!currentResolution) {
				if (preload) {
					image = loadImage(name, preloadCallback);
				}
				imageFilename = name;
			} else {
				if (resolutions[currentResolution].images[name]) {
					imageFilename = resolutions[currentResolution].folder
							+ resolutions[currentResolution].images[name];
				}

				if (!imageFilename && defaultResolution
						&& defaultResolution != currentResolution
						&& resolutions[defaultResolution].images[name]) {
					imageFilename = resolutions[defaultResolution].folder
							+ resolutions[defaultResolution].images[name];
				}

				// when we are lazy to add all images by the Resource.addImage
				// function
				// we simply add current resolution folder to the requesting
				// name
				// supposing that we have all images for this resolution
				// available
				if (!name || name == 'undefined') {
					return null;
				} 
				
				if (!imageFilename) {
					imageFilename = resolutions[currentResolution].folder
							+ name;
				}

				if (preload) {
					image = loadImage(name, preloadCallback);
				}
			}

			if (preloadCallback && image && image.complete) {
				preloadCallback();
			}
			
			if(assets[name]){
//				console.log("IN ASS", assets[name].complete);
			}

			return imageFilename;
		},

		// return an asset preloaded
		getAsset : function(id) {
			if (assets[id]) {
				return assets[id];
			}
			return false;
		},
		
		getImageAsset : function(id, callback) {
			if (assets[id]) {
				if (callback)
					callback(assets[id]);
				return assets[id];
			}
			var obj = new Image();
			obj.src = Resources.getImage(id);
			obj.onload = function() {
				if (callback)
					callback(obj);
				assets[id] = obj;
			};
			return obj;
		},		
		// return an array of registered images filenames,
		// used for preloading
		getUsedImages : function() {
			var images = new Array();

			// walking through default resolution for all images
			// looking for images in current resolution
			for ( var i in resolutions[defaultResolution].images[i]) {
				if (resolutions[currentResolution].images[i]) {
					images.push(Resources.getImage(i));
				}
			}
			return images;
		},

		// "preloading" font by creating and destroying item with all fonts
		// classes
		preloadFonts : function(fontClasses) {
			for ( var i = 0; i < fontClasses.length; ++i) {
				$("#root")['append']("<div id='fontsPreload" + i
						+ "' + style='opacity:0.1;font-size:1px'>.</div>");
				var testDiv = $("#fontsPreload" + i);
				testDiv['addClass'](fontClasses[i]);
				setTimeout(function() {
					testDiv.remove();
				}, 1000);
			}
		},

		// temporary borrowed from CraftyJS game engine
		// TODO rewrite
		loadMedia : function(data, oncomplete, onprogress, onerror) {
			var i = 0, l = data.length, current, obj, total = l, j = 0, ext;
			for (; i < l; ++i) {
				current = data[i];
				ext = current.substr(current.lastIndexOf('.') + 1)
						.toLowerCase();

				if ((ext === "mp3" || ext === "wav" || ext === "ogg" || ext === "mp4")) {
					obj = new Audio(current);
					// Chrome doesn't trigger onload on audio, see
					// http://code.google.com/p/chromium/issues/detail?id=77794
					if (navigator.userAgent.indexOf('Chrome') != -1)
						j++;
				} else if (ext === "jpg" || ext === "jpeg" || ext === "gif"
						|| ext === "png") {
					obj = new Image();
					obj.src = Resources.getImage(current);
				} else {
					total--;
					continue; // skip if not applicable
				}

				// add to global asset collection
				assets[current] = obj;

				obj.onload = function() {
					++j;
					// if progress callback, give information of assets loaded,
					// total and percent
					if (onprogress) {
						onprogress.call(this, {
							loaded : j,
							total : total,
							percent : (j / total * 100)
						});
					}
					if (j === total) {
						if (oncomplete)
							oncomplete();
					}
				};

				// if there is an error, pass it in the callback (this will be
				// the object that didn't load)
				obj.onerror = function() {
					if (onerror) {
						onerror.call(this, {
							loaded : j,
							total : total,
							percent : (j / total * 100)
						});
					} else {
						j++;
						if (j === total) {
							if (oncomplete)
								oncomplete();
						}
					}
				};
			}
		}
	};
})();
/*WebSound*/
var WebSound = function(context) {
	this.context = context;
	this.volume = 1;
	this.fade = false;
	this.deprecated = false;
//	if (context.createGain) {
//		this.gainNode = context.createGain();
//		alert('context.createGain')
//	}
};

WebSound.prototype.createSource = function(buffer) {
	  var source = this.context.createBufferSource();
	  source.buffer = buffer;
	  
	  source = this.createGain(source);

	  return source;
};

WebSound.prototype.createGain = function(source) {
	  if (!this.context.createGain)
		  return false;
	  var gainNode = this.context.createGain();
	  source.connect(gainNode);
	  gainNode.connect(this.context.destination);
	  source.gain = gainNode.gain;
	  
	  return source;
};

WebSound.prototype.play = function(sndInst, callback) {
	var that = this;
	if (this.deprecated) {
		this.playDeprecated(sndInst, callback);
	}
	if(!sndInst.buffer){
		return;
	}
	sndInst.source = this.createSource(sndInst.buffer);
	
	if (!sndInst.source) {
		this.deprecated = true;
		this.playDeprecated(sndInst, callback);
		return;
	}
	sndInst.source.loop = sndInst.loop;
	sndInst.source.gain.value = sndInst.volume;
	sndInst.source.start(0, sndInst.offset, sndInst.duration);
//  deprecated
//	sndInst.source.noteGrainOn(0, sndInst.offset, sndInst.duration);
	var buf = sndInst.buffer;
	if (!sndInst.loop) {
		this.playTimeout = setTimeout(function() {
			sndInst.source = that.createSource(buf);
			if (callback) {
				callback();
			}
		}, sndInst.duration * 1000);
	}
};


WebSound.prototype.playDeprecated = function(sndInst, callback) {
	var that = this;
	var source = this.context.createBufferSource();
	sndInst.source = source;
	sndInst.source.connect(this.context.destination);
	if(!sndInst.buffer){
		return;
	}
	sndInst.source.buffer = sndInst.buffer;
	sndInst.source.loop = sndInst.loop;
	sndInst.source.gain.value = sndInst.volume;
	sndInst.source.noteGrainOn(0, sndInst.offset, sndInst.duration);
	var buf = sndInst.buffer;
	if (!sndInst.loop) {
		this.playTimeout = setTimeout(function() {
			sndInst.source = that.context.createBufferSource();
			sndInst.source.buffer = buf;
			if (callback) {
				callback();
			}
		}, sndInst.duration * 1000);
	}
};


WebSound.prototype.stop = function(sndInst) {
	if (sndInst && sndInst.source) {
		try{
			sndInst.source.noteOff(0);
		}catch(e){
//			alert("WEB STOPERR:"+e);
		}
	}
};

WebSound.prototype.mute = function(channel) {
	this.muted = true;
	if(channel){
		channel.playing.source = this.createGain(channel.playing.source);
		channel.playing.source.gain.value = 0;
	}else{
		this.volume = 0;
	}
};

WebSound.prototype.unmute = function(channel) {
	this.muted = false;
	if(channel){
		channel.playing.source = this.createGain(channel.playing.source);
		channel.playing.source.gain.value = channel.volume;
	}else{
		this.volume = 1;
	}
};


WebSound.prototype.fadeTo = function(fadeInst) {
	if(this.muted){
		return;
	}
	var fadeStep = 10;
	if(this.fade == fadeInst.sndInst.id){
		return;
	}
	this.fade = fadeInst.sndInst.id;
	var that = this;
	fadeInst.sndInst.source = that.createGain(fadeInst.sndInst.source);
	fadeInst.dVol = fadeInst.volume - fadeInst.sndInst.source.gain.value;
	if(fadeInst.dVol == 0){
		return;
	}
	fadeInst.dVol = Math.round((fadeInst.dVol/(fadeInst.time/fadeStep)) * 10000)/10000;
	if (fadeInst.sndInst) {
		this.fading = true;
		var int = setInterval(function(){
			if(Math.abs(fadeInst.sndInst.source.gain.value - fadeInst.volume) >= Math.abs(2 * fadeInst.dVol)){
				fadeInst.sndInst.source.gain.value += fadeInst.dVol;
			}else{
				fadeInst.sndInst.source.gain.value = fadeInst.volume;
				fadeInst.sndInst.source.gain.value = Math.round(fadeInst.sndInst.source.gain.value * 10000)/10000;
				that.fade = false;
				if(fadeInst.callback){
					fadeInst.callback();
				}
				clearInterval(int);
			}
		},fadeStep);
	}
};

WebSound.prototype.loadSprite = function(name, callback) {
	this.loadSound(name, callback);
};

WebSound.prototype.loadSound = function(name, callback) {
	var that = this;
	
	var canPlayMp3, canPlayOgg = null;
	var myAudio = document.createElement('audio');
	if (myAudio.canPlayType) {
		canPlayMp3 = !!myAudio.canPlayType
				&& "" != myAudio.canPlayType('audio/mpeg');
		canPlayOgg = !!myAudio.canPlayType
				&& "" != myAudio.canPlayType('audio/ogg; codecs="vorbis"');
	}
	var ext;
	if(canPlayOgg) {
		ext = ".ogg";
	} else {
		ext = ".mp3";
		//this.soundOffset = this.mp3offset;
	}

	var request = new XMLHttpRequest();
	request.open('GET', name + ext, true);
	request.responseType = 'arraybuffer';
	// Decode asynchronously
	request.onload = function() {
		that.context.decodeAudioData(request.response, function(buffer) {
			var source = that.context.createBufferSource();
			source.buffer = buffer;
			if (callback) {
				callback(buffer);
			}
		}, function() {
			console.error("Unable to load sound:" + name + EXTENTION);
		});
	};
	request.send();
};
var jSound = function() {
	this.chCount = 10;
	this.sprites = null;
	this.i = 0;
};

jSound.prototype.playSprite = function(sndInst, callback) {
	var that = this;

	this.jPlayerInstance['jPlayer']("pause", sndInst.offset);
	this.jPlayerInstance['jPlayer']("play", sndInst.offset);

	audioSpriteEndCallback = function() {

		if (sndInst.loop) {
			that.play(sndInst, callback);
		} else {
			that.stop();
			if (callback) {
				callback();
			}
		}

	};

	this.audioSpriteTimeoutHandler = setTimeout(audioSpriteEndCallback, sndInst.duration * 1000);

};
jSound.prototype.play = function(sndInst, callback) {
	var that = this;
	var sriteInst = this.sprites[sndInst.spriteName];
	if (!sriteInst) {
		return;
	}
	sriteInst.volume = sndInst.volume;
	sriteInst.play(sndInst, callback);
};

jSound.prototype.fadeTo = function(fadeInst) {
	var fadeStep = 10;
	if (this.fade == fadeInst.sndInst.spriteName) {
		return;
	}

	var spriteInst = this.sprites[fadeInst.sndInst.spriteName];
	if (spriteInst.muted) {
		return;
	}
	this.fade = fadeInst.sndInst.spriteName;
	var that = this;
	fadeInst.dVol = fadeInst.volume - spriteInst.volume;
	if (fadeInst.dVol == 0) {
		return;
	}
	fadeInst.dVol /= fadeInst.time / fadeStep;
	if (fadeInst.sndInst) {
		this.fading = true;
		spriteInst.int = setInterval(function() {
			if (Math.abs(spriteInst.volume - fadeInst.volume) >= Math.abs(fadeInst.dVol)) {
				spriteInst.volume += fadeInst.dVol;
				spriteInst.setVolume(fadeInst.sndInst.id, spriteInst.volume);
			} else {
				spriteInst.volume = fadeInst.volume;
				spriteInst.setVolume(fadeInst.sndInst.id, fadeInst.volume);
				that.fade = false;
				if (fadeInst.callback) {
					fadeInst.callback();
				}
				clearInterval(spriteInst.int);
			}
		}, fadeStep);
	}
};

jSound.prototype.stop = function(sndInst) {
	if (this.sprites == null) {
		return;
	}
	if (sndInst) {
		if (!this.sprites[sndInst.spriteName]) {
			return;
		}
		this.sprites[sndInst.spriteName].stop();
		if(this.sprites[sndInst.spriteName].int){
			clearInterval(this.sprites[sndInst.spriteName].int);				
		}
	} else {
		$['each'](this.sprites, function(index, value) {
			value.audio.stop();
			if(value.int){
				clearInterval(value.int);				
			}
		});
	}
};

jSound.prototype.mute = function(channel) {
	if (this.sprites == null) {
		return;
	}
	if (channel) {
		this.sprites[channel.playing.spriteName].mute();
	} else {
		$['each'](this.sprites, function(index, value) {
			value.mute();
		});
	}
	// this.stop();
};

jSound.prototype.unmute = function(channel) {
	if (this.sprites == null) {
		return;
	}
	if (channel) {
		this.sprites[channel.playing.spriteName].unmute(channel.volume);
	} else {
		$['each'](this.sprites, function(index, value) {
			value.unmute();
		});
	}
};

jSound.prototype.loadSound = function(audioSpriteName, callback, createChannels) {
	if (this.sprites == null) {
		this.sprites = {};
	}
	var that = this;
	if (Device.isAppleMobile()) {
		playOffset = APPLE_OFFSET;
	}
	var name = audioSpriteName;
	var slashInd = audioSpriteName.indexOf("/");// jPlayer's div id must not to
	// include "/"
	if (slashInd >= 0) {
		var ss = audioSpriteName.split('/');
		name = ss[ss.length - 1];
	}

	var jArr = [];
	var n = 1;
	if (createChannels) {
		n = this.chCount;
	}
	for ( var i = 0; i < n; i++) {
		var jPlayer = this.generateJplayer(name + i, audioSpriteName);
		jArr.push(jPlayer);
	}

	this.sprites[audioSpriteName] = this.generateSpriteChannels(jArr);
	if (callback) {
		setTimeout(callback, 1000);
	}
};

jSound.prototype.loadSprite = function(audioSpriteName) {
	var that = this;
	var PATH_TO_JPLAYER_SWF = "js/";
	if (this.sprites == null) {
		this.sprites = {};
	}
	// add jPlayer
	// jQuery['getScript'](PATH_TO_JPLAYER_SWF + 'jquery.jplayer.min.js',
	// function() {
	$("body")['append']("<div id='jPlayerInstanceId" + audioSpriteName
			+ "' style='position:absolute; left:50%; right:50%; width: 0px; height: 0px;'></div>");
	that.sprites[audioSpriteName] = $("#jPlayerInstanceId" + audioSpriteName);
	that.sprites[audioSpriteName]['jPlayer']({
		ready : function() {
			$(this)['jPlayer']("setMedia", {
				oga : "sounds/" + audioSpriteName + ".ogg",
				m4a : "sounds/" + audioSpriteName + ".mp4",
				mp3 : "sounds/" + audioSpriteName + ".mp3"
			});
		},
		supplied : "oga, mp3, m4a",
		solution : "html, flash",
		// solution : "html",//, flash",
		swfPath : PATH_TO_JPLAYER_SWF,

		ended : function() { // The
			// $.jPlayer.event.ended
			// event
			// console.log("Jplayer ended");
		},
		playing : function(event) { // The
			// $.jPlayer.event.ended
			// event
			var timeNow = event['jPlayer'].status.currentTime;
			// console.log("Jplayer playing " +
			// timeNow);
		},
		timeupdate : function(event) { // The
			// $.jPlayer.event.ended
			// event
			var timeNow = event['jPlayer'].status.currentTime;
			// console.log("Jplayer timeupdate "
			// + timeNow);
		}
	});
	// });

};

jSound.prototype.generateJplayer = function(id, audioSpriteName) {
	var PATH_TO_JPLAYER_SWF = "js/";
	var playerDiv = "<div id='" + id + "' style='position:absolute; left:50%; right:50%; width: 0px; height: 0px;'></div>";
	$("body")['append'](playerDiv);
	var jPlayerInstance = $("#" + id);
	// that.sprites[audioSpriteName] = jPlayerInstance;
	// console.log("JPJPJPJPJPJPJJ", jPlayerInstance);
	jPlayerInstance['jPlayer']({
		ready : function() {
			$(this)['jPlayer']("setMedia", {
				oga : audioSpriteName + ".ogg",
				// m4a : audioSpriteName + ".mp4",
				mp3 : audioSpriteName + ".mp3"
			});
		},
		supplied : "oga, mp3, m4a",
		solution : "html, flash",
		preload : "auto", 
		// solution : "html",//, flash",
		swfPath : PATH_TO_JPLAYER_SWF,

		ended : function() { // The
			// $.jPlayer.event.ended
			// event
			// console.log("Jplayer ended");
		},
		playing : function(event) { // The
			// $.jPlayer.event.ended
			// event
			var timeNow = event['jPlayer'].status.currentTime;
			// console.log("Jplayer playing " + timeNow);
		},
		timeupdate : function(event) { // The
			// $.jPlayer.event.ended
			// event
			var timeNow = event['jPlayer'].status.currentTime;
			// console.log("Jplayer timeupdate " + timeNow);
		}
	});
	return jPlayerInstance;
};

jSound.prototype.generateSpriteChannels = function(jArr) {
	var that = this;
	var spriteInst = {
		volume : 1,
		channels : [],
		play : function(sndInst, callback) {
			var ch = this.getFree();
			if (ch) {
				if(this.muted){
					ch.audio['jPlayer']("volume", 0);	
				}else{
					ch.audio['jPlayer']("volume", this.volume);
				}
				ch.audio['jPlayer']("play", sndInst.offset);
				ch.playing = sndInst;
				audioSpriteEndCallback = function() {
					ch.audio['jPlayer']("pause");
					ch.playing = null;
					if (sndInst.loop) {
						that.play(sndInst, callback);
					} else {
						if (callback) {
							callback();
						}
					}
				};

				ch.audioSpriteTimeoutHandler = setTimeout(audioSpriteEndCallback, sndInst.duration * 1000);
			}
		},
		stop : function() {
			$['each'](this.channels, function(index, value) {
				if (value.playing) {
					 value.audio['jPlayer']("pause");
					 value.playing = null;
					 clearTimeout(value.audioSpriteTimeoutHandler);
				}
			});
		},
		getFree : function() {
			for ( var i = 0; i < this.channels.length; i++) {
				if (!this.channels[i].playing) {
					return this.channels[i];
				}
			}
			console.log("NO FREE CHANNEL");
			return null;
		},
		mute : function() {
			this.muted = true;
			$['each'](this.channels,function(index, value){
//				value.audio['jPlayer']("mute");
				value.audio['jPlayer']("volume", 0);
			});
		},
		unmute : function(vol) {
			this.muted = false;
			$['each'](this.channels,function(index, value){
//				value.audio['jPlayer']("unmute");
				value.audio['jPlayer']("volume", vol);
			});
		},
		setVolume : function(id, vol) {
			$['each'](this.channels, function(index, value) {
				if (value.playing && value.playing.id == id) {
					value.audio['jPlayer']("volume", vol);
				}
			});
		}
	};
	$['each'](jArr, function(index, value) {
		var chInst = {
			audio : value,
			playing : null
		};
		spriteInst.channels.push(chInst);
	});
	return spriteInst;
};/*
 * Standard HTML5 sound 
 */

var htmlSound = function() {
	this.soundOffset = 0;
	this.mp3offset = 0.001;// ;-0.05;
	this.audioSpriteInstance = {};
	this.fade = false;

	this.startTime = 0;
	this.endTime = 0;
};

htmlSound.prototype.play = function(sndInst, callback) {
	var spriteInst = this.audioSpriteInstance[sndInst.spriteName];

	if (!spriteInst || spriteInst.play) {
		if (spriteInst.priority <= sndInst.priority) {
			this.stop(sndInst);
		} else {
			return;
		}
	}

	spriteInst.priority = sndInst.priority;
	spriteInst.stopCallback = callback;
	spriteInst.audio.volume = sndInst.volume;
	spriteInst.audio.pause();
	if (sndInst.loop) {
		spriteInst.audio.addEventListener('ended', function() {
			this.currentTime = 0;
			this.play();
		}, false);
	}

	spriteInst.startTime = sndInst.offset + this.soundOffset;
	spriteInst.endTime = spriteInst.startTime + sndInst.duration;
	spriteInst.audio.currentTime = spriteInst.startTime;
	spriteInst.play = true;
	spriteInst.audio.play();
};

htmlSound.prototype.stop = function(sndInst) {
	if (this.audioSpriteInstance == null) {
		return;
	}
	if (sndInst) {
		if (!this.audioSpriteInstance[sndInst.spriteName]) {
			return;
		}
		this.audioSpriteInstance[sndInst.spriteName].audio.pause();
		this.audioSpriteInstance[sndInst.spriteName].play = false;
	} else {
		$['each'](this.audioSpriteInstance, function(index, value) {
			value.audio.pause();
			value.play = false;
		});
	}
	// this.audioSpriteInstance.pause();
};

htmlSound.prototype.mute = function(channel) {
	if (this.audioSpriteInstance == null) {
		return;
	}
	if (channel) {
		this.audioSpriteInstance[channel.playing.spriteName].audio.muted = true;
		this.audioSpriteInstance[channel.playing.spriteName].muted = true;
	} else {
		$['each'](this.audioSpriteInstance, function(index, value) {
			value.audio.muted = true;
			value.muted = true;
		});
	}
	// this.stop();
};

htmlSound.prototype.unmute = function(channel) {
	if (this.audioSpriteInstance == null) {
		return;
	}
	if (channel) {
		this.audioSpriteInstance[channel.playing.spriteName].audio.muted = false;
		this.audioSpriteInstance[channel.playing.spriteName].muted = false;
	} else {
		$['each'](this.audioSpriteInstance, function(index, value) {
			value.audio.muted = false;
			value.muted = false;
		});
	}
};

htmlSound.prototype.fadeTo = function(fadeInst) {
	var fadeStep = 10;
	if (this.fade == fadeInst.sndInst.id) {
		return;
	}

	var audio = this.audioSpriteInstance[fadeInst.sndInst.spriteName].audio;
	if (this.audioSpriteInstance[fadeInst.sndInst.spriteName].muted) {
		return;
	}
	this.fade = fadeInst.sndInst.id;
	var that = this;
	fadeInst.dVol = fadeInst.volume - audio.volume;
	if (fadeInst.dVol == 0) {
		return;
	}
	fadeInst.dVol /= fadeInst.time / fadeStep;
	if (fadeInst.sndInst) {
		this.fading = true;
		var int = setInterval(function() {
			if (Math.abs(audio.volume - fadeInst.volume) >= Math.abs(fadeInst.dVol)) {
				audio.volume += fadeInst.dVol;
			} else {
				audio.volume = fadeInst.volume;
				that.fade = false;
				if (fadeInst.callback) {
					fadeInst.callback();
				}
				clearInterval(int);
			}
		}, fadeStep);
	}
};

htmlSound.prototype.loadSound = function(audioSpriteName, callback) {
	var canPlayMp3, canPlayOgg = null;
	var myAudio = document.createElement('audio');
	// myAudio.preload = "auto";
	if (myAudio.canPlayType) {
		canPlayMp3 = !!myAudio.canPlayType && "" != myAudio.canPlayType('audio/mpeg');
		canPlayOgg = !!myAudio.canPlayType && "" != myAudio.canPlayType('audio/ogg; codecs="vorbis"');
	}
	var ext;
	if (canPlayOgg) {
		ext = ".ogg";
	} else {
		ext = ".mp3";
		this.soundOffset = this.mp3offset;
	}

	var audio = new Audio(audioSpriteName + ext);
	audio.preload = "auto";
	var that = this;
	if (callback) {

		audio.addEventListener('abort', function() {
//			alert(audioSpriteName + " aborted");
		}, true);

		audio.addEventListener('error', function() {
//			alert(audioSpriteName + " error");
		}, true);

		audio.addEventListener('suspend', function() {
//			alert(audioSpriteName + " suspend");
		}, true);

		var canplay = function() {
			that.audioSpriteInstance[audioSpriteName] = {
				audio : audio,
				startTime : 0,
				endTime : 0
			};
			callback(that.audioSpriteInstance[audioSpriteName]);
			audio.removeEventListener("canplaythrough", canplay, false);
		};
		audio.addEventListener('canplaythrough', canplay, false);
		audio.addEventListener('timeupdate', function() {
			var spriteInst = that.audioSpriteInstance[audioSpriteName];
			if (spriteInst.audio.currentTime < spriteInst.startTime) {
				spriteInst.audio.currentTime = spriteInst.startTime;
			}
			if (spriteInst.audio.currentTime >= spriteInst.endTime) {
				spriteInst.audio.pause();
				spriteInst.play = false;
				if (spriteInst.stopCallback) {
					spriteInst.stopCallback();
					spriteInst.stopCallback = null;
				}
			}
		}, false);
	} else {
		console.log("NO CALLBACK ON SOUND INIT");
		that.audioSpriteInstance[audioSpriteName] = audio;
	}
};// There few approaches to audio support:
// Audio sprites and separate audio files
// Audio can be played via Flash by JPlayer, HTML5 Audio, Web Audio API
var Sound;
if (typeof(Native) != "undefined")
	Sound = Native.Sound;
else
	Sound = (function() {
		var snd = {
			channels : {
				"default" : {
					playing : null,
					volume : 1
				},
				"background" : {
					playing : null,
					volume : 0.2
				}
			},
			channelCount : 2,
			spriteName : null,
			sprite : {},
			sprites : {},
			forceSprite : false,
			soundBuffers : {},
			getChannel : function(channel) {
				if (!channel || channel == "default") {
					return this.channels["default"];
				} else {
					return this.channels[channel];
				}
			},
			addChannel : function(channel, name) {
				for ( var i = 0; i < this.channels.length; i++) {
					if (this.channels[i] == channel) {
						return;
					}
				}
				if (!channel) {
					return;
				}
	
				this.channels[name] = channel;
			},
			stop : function(channel) {
				var that = this;
				if (channel) {
					var ch = this.getChannel(channel);
					if (ch) {
						this.instance.stop(ch['playing']);
					}
				} else {
					$['each'](this.channels, function(index, value) {
						try{
							if (index != "background" && value && value.playing != null) {
								that.instance.stop(value['playing']);
							}
						}catch(e){
	//						console.err("STOPERR"+e);
						}
					});
				}
			},
			isOn : function() {
				var on = Device.getStorageItem("soundOn", "true") == "true";
				return on;
			},
			mute : function(channel) {
				var that = this;
				var ch = this.getChannel(channel);
				ch.initVol = ch.volume;
				// ch.volume = 0;
				if (ch) {
					if (ch.playing) {
						this.instance.mute(ch);
						ch.muted = true;
					} else {
						// ch.volume = 0;
						ch.muted = true;
					}
				} else {
					$['each'](this.channels, function(index, value) {
						if (index != "background") {
							if (value.playing) {
								that.instance.mute(value);
								value.muted = true;
							} else {
								// value.volume = 0;
								value.muted = true;
							}
						}
					});
				}
			},
			unmute : function(channel) {
				var that = this;
				var ch = this.getChannel(channel);
				ch.initVol = ch.volume;
				// ch.volume = 0;
				if (ch) {
					if (ch.playing) {
						this.instance.unmute(ch);
						ch.muted = false;
					} else {
						// ch.volume = 1;
						ch.muted = false;
					}
				} else {
					$['each'](this.channels, function(index, value) {
						if (index != "background") {
							if (value.playing) {
								that.instance.unmute(value);
								value.muted = false;
							} else {
								// value.volume = 1;
								value.muted = false;
							}
						}
					});
				}
			},
			turnOn : function(isOn) {
				var soundOn = isOn;
				Device.setStorageItem("soundOn", soundOn);
				if (soundOn) {
					this.unmute();
				} else {
					this.mute();
					// this.stop();
				}
			},
			add : function(id, offset, duration, spriteName, priority) {
				// if (this.forceSprite) {
				this.soundBuffers[id] = {
					priority : priority ? priority : 0,
					offset : offset,
					spriteName : spriteName ? spriteName : id,
					duration : duration
				};
				// }
			},
			play : function(id, loop, priority, channel) {
//				try {
					var that = this;
					if (!this.soundBuffers[id] || (!this.isOn() && channel != "background")) {
						return;
					}
					var callback = null;
	
					var ch = this.getChannel(channel);
					var sound = this.soundBuffers[id];
					if (typeof loop === 'function') {
						callback = loop;
						loop = false;
					}
					var sndInstance = {
						id : id,
						priority : priority ? priority : sound.priority,
						loop : loop ? true : false,
						offset : sound.offset,
						volume : ch.muted ? 0 : ch.volume,
						duration : sound.duration,
						spriteName : sound.spriteName,
						buffer : this.sprites[sound.spriteName] ? this.sprites[sound.spriteName] : this.sprite
					};
					if (ch.playing != null) {
						var num = this.channelCount++;
						var chName = "channel" + num;
						this.channels[chName] = {
							playing : null,
							volume : 1
						};
						ch = this.channels[chName];
						ch.playing = sndInstance;
						this.instance.play(sndInstance, function() {
							if (callback) {
								callback();
							}
							ch.playing = null;
							that.channels[chName] = null;
							delete that.channels[chName];
						});
	
						// if (ch.playing.priority > sndInstance.priority) {
						// return;
						// } else {
						// this.instance.stop(ch.playing);
						// ch.playing = sndInstance;
						// this.instance.play(sndInstance, function() {
						// if(callback){
						// callback();
						// }
						// ch.playing = null;
						// });
						// }
					} else {
						ch.playing = sndInstance;
						this.instance.play(sndInstance, function() {
							if (callback) {
								callback();
							}
							ch.playing = null;
						});
					}
//				}
//				catch (e) {console.log(e);}
			},
	        playWithVolume : function(id, volume, priority, loop) {
	            try {
	                var that = this;
	                var callback = null;
	                var ch = this.getChannel("default");
	                ch.volume = volume != null ? volume : 1;
	                var sound = this.soundBuffers[id];
	                if (typeof loop === 'function') {
	                    callback = loop;
	                    loop = false;
	                }
	                var sndInstance = {
	                    id : id,
	                    priority : priority ? priority : sound.priority,
	                    loop : loop ? true : false,
	                    offset : sound.offset,
	                    volume : ch.muted ? 0 : ch.volume,
	                    duration : sound.duration,
	                    spriteName : sound.spriteName,
	                    buffer : this.sprites[sound.spriteName] ? this.sprites[sound.spriteName] : this.sprite
	                };
	                if (ch.playing != null) {
	                    var num = this.channelCount++;
	                    var chName = "channel" + num;
	                    this.channels[chName] = {
	                        playing : null,
	                        volume : 1
	                    };
	                    ch = this.channels[chName];
	                    ch.playing = sndInstance;
	                    this.instance.play(sndInstance, function() {
	                        if (callback) {
	                            callback();
	                        }
	                        ch.playing = null;
	                        that.channels[chName] = null;
	                        delete that.channels[chName];
	                    });
	                } else {
	                    ch.playing = sndInstance;
	                    this.instance.play(sndInstance, function() {
	                        if (callback) {
	                            callback();
	                        }
	                        ch.playing = null;
	                    });
	                }
	            }
	            catch (e) {console.error(e);}
	        },
			init : function(name, forceSprite, callback, createChannels) {
				// createChannels is using only in jSound
				var that = this;
				this.forceSprite = forceSprite ? true : false;
				if (this.forceSprite) {
	
					// console.log("INIT "+name);
					this.instance.loadSound(name, function(buf) {
						that.sprites[name] = buf;
						// set initial mute state
						// Sound.turnOn(Sound.isOn());
						if (callback) {
							callback();
						}
					}, createChannels);
				}
			},
			fadeTo : function(channel, time, volume, callback) {
				var that = this;
				var ch = this.getChannel(channel);
				var playing = ch.playing;
				if (!playing || ch.muted) {
	//				console.log(playing, ch);
					return;
				}
				var fadeInst = {
					channel : channel,
					time : time,
					sndInst : playing,
					volume : volume,
					callback : callback
				};
				this.instance.fadeTo(fadeInst);
			},
			addSprite : function(name) {
				var that = this;
				// this.forceSprite = forceSprite ? true : false;
				// if (this.forceSprite) {
				this.instance.loadSprite(name, function(buf) {
					that.sprites[name] = buf;
				});
				// }
			}
		};
		var context = null;
	
		try {
			context = new (window.AudioContext || window.webkitAudioContext)();
	//		context = null;
		} catch (e) {
			context = null;
			console.log("WEB Audio not supported");
		}
		if (context != null) {
			snd.type = "webAudio";
			snd.instance = new WebSound(context);
		} else {
			snd.type = "htmlSound";
//			snd.instance = new jSound();
			snd.instance = new htmlSound();
		}
	
		return snd;
	})();/**
 * Entity Factory
 */

var entityFactory = new AbstractFactory();

/**
 * @constructor
 */
entityFactory.createEntitiesFromJson = function(json) {
	this.createObjectsFromJson(json, function(name, params) {
		params['id'] = name;
	}, function(name, obj, params) {
		assert(Account.instance);
		Account.instance.addEntity(obj, name, params);
	});
};
/*
 *  Entity is a main logic item of simulation. 
 *  Entities is a mirroring of server object on client. 
 */

/**
 * @constructor
 */
function Entity() {
};

Entity.prototype.init = function(params) {
	this.params = params;
	this.id = params['id'];

	// Variables values for synchronizing with server
	this.properties = {};

	if (params['parent']) {
		// find parent among entities in account
		var parent = params['parent'];
		if (typeof params['parent'] == "string") {
			parent = Account.instance.getEntity(params['parent']);
			this.assert(parent, " No parent found with id='" + params['parent']
					+ "' ");
		}
		parent.addChild(this);
	} else {
		console.log(" No parent provided for entity with id='" + this.id + "'");
	}

	var enabled = selectValue(params['enabled'], true);
	this.setEnable(enabled);

	// this.readUpdate(params);
	this.timeouts = null;
	this.intervals = null;
};

Entity.prototype.assert = function(cond, msg) {
	assert(cond, msg + " for entity id='" + this.id + "'");
};

Entity.prototype.log = function(msg) {
	console.log("Entity id='" + this.id + "', " + msg);
};

Entity.prototype.destroy = function() {
		//TODO WTF is happening?
		if (this.clearTimeouts)
			this.clearTimeouts();
		else
			console.warn("Very suspicious accident! Some shit happened!");
		var child;
		if (this.parent) {
			//TODO WTF is happening?
			if (this.parent.removeChild)
				this.parent.removeChild(this);
			else
				console.warn("Very suspicious accident! Yep, shit happens...");
		}
		if (this.children) {
			for ( var i = 0; i < this.children.length; i++) {
				child = this.children[i];
				// child.destroy();//may be not necessary
				this.removeChild(child);
				Account.instance.removeEntity(child.id);
				i--;
			}
		}
};

Entity.prototype.addChild = function(child) {
	this.children = this.children ? this.children : new Array();
	this.assert(child != this, "Can't be parent for itself");
	this.assert(child.parent == null, "Can't assign as child id='" + child.id
			+ "' since there's parent id='"
			+ (child.parent ? child.parent.id : "") + "' ");
	child.parent = this;
	this.log("Entity.addChild " + child.id);
	this.children.push(child);
};

Entity.prototype.removeChild = function(child) {
	assert(this.children, "no children been assigned");
	popElementFromArray(child, this.children);
};

Entity.prototype.getChild = function(childId) {
	assert(this.children, "no children been assigned");
	var child;
	$.each(this.children, function(id, val) {
		if (val.id == childId)
			child = val;
	});
	assert(child, "No child with id = " + childId + " has been assigned");
	return child;
};

Entity.prototype.initChildren = function(params) {
	if (params && params['children']) {
		Account.instance.readGlobalUpdate(params['children']);
	}
};

// scheduled update
Entity.prototype.update = null;

Entity.prototype.isEnabled = function() {
	return this.enabled;
};

Entity.prototype.setEnable = function(isTrue) {
	this.enabled = isTrue;
	if (typeof (this.update) == "function") {
		if (isTrue) {
			Account.instance.addScheduledEntity(this);
		} else {
			Account.instance.removeScheduledEntity(this);
		}
	}
};

// Synchronization with server
Entity.prototype.setDirty = function() {
	var that = this;
	$['each'](arguments, function(id, val) {
		that.dirtyFlags[val] = true;
	});
};

Entity.prototype.clearDirty = function() {
	var that = this;
	$['each'](arguments, function(id, val) {
		that.dirtyFlags[val] = null;
	});
};

Entity.prototype.isDirty = function(name) {
	return this.dirtyFlags[name] == true;
};

Entity.prototype.clearAllDirty = function() {
	this.dirtyFlags = {};
};

Entity.prototype.readUpdate = function(data) {
	var parentId = this.parent ? this.parent['id'] : null;
	// if (data['parent']) {
	if (data['parent'] != parentId) {
		if (this.parent != null) {
			this.parent.removeChild(this);
			this.parent = null;
		}
		if (data['parent']) {
			Account.instance.getEntity(data['parent']).addChild(this);
		}
	}
	// }
};

Entity.prototype.readUpdateProperty = function(data, name) {
	this.properties[name] = data[name];
	return data[name];
};

Entity.prototype.writeUpdateProperty = function(data, name, value) {
	if (this.properties[name] != value) {
		data[name] = value;
		this.properties[name] = value;
	}
};

Entity.prototype.writeUpdate = function(globalData, entityData) {
	globalData[this.id] = entityData;
	// entityData['class'] = this.params['class'];
	this.writeUpdateProperty(entityData, "class", this.params['class']);
	// entityData['parent'] = this.params['parent'];
	this.writeUpdateProperty(entityData, "parent", this.params['parent']);
	if (this.children) {
		$['each'](this.children, function(idx, entity) {
			entity.writeUpdate(globalData, new Object());
		});
	}
};

// Timing of entity
Entity.prototype.setInterval = function(func, time) {
	var handle = setInterval(func, time);
	this.intervals = this.intervals ? this.intervals : new Array();
	this.intervals.push(handle);
	return handle;
};

Entity.prototype.setTimeout = function(func, time) {
	var handle = setTimeout(func, time);
	this.timeouts = this.timeouts ? this.timeouts : new Array();
	this.timeouts.push(handle);
	return handle;
};

Entity.prototype.clearTimeout = function(handle) {
	clearTimeout(handle);
	// TODO add removing from array
};

Entity.prototype.clearInterval = function(handle) {
	clearInterval(handle);
	// TODO add removing from array
};

Entity.prototype.clearTimeouts = function() {
	// TODO deal with infinite timeout and interval array increasing
	for ( var i in this.intervals) {
		clearInterval(this.intervals[i]);
	}
	this.intervals = new Array();

	for ( var i in this.timeouts) {
		clearTimeout(this.timeouts[i]);
	}
	this.timeouts = new Array();
};
/**
 * BaseState - abstract class - current state of the game.
 * Loads GUI preset and operate with GUI elements.
 * Preloads any required resources
 */

/**
 * @constructor
 */
function BaseState() {
	BaseState.parent.constructor.call(this);
};

BaseState.inheritsFrom(Entity);

BaseState.prototype.init = function(params) {
	BaseState.parent.init.call(this, params);
	this.guiContainer = new GuiContainer();
	this.guiContainer.init();
	this.guiContainer.resize();
};

BaseState.prototype.destroy = function() {
	BaseState.parent.destroy.call(this);
	this.guiContainer.clear();
};

BaseState.prototype.addGui = function(entity, name) {
	this.guiContainer.addGui(entity, name);
};
BaseState.prototype.removeGui = function(entity) {
	this.guiContainer.removeGui(entity);
};
BaseState.prototype.getGui = function(name) {
	return this.guiContainer.getGui(name);
};

BaseState.prototype.resize = function() {
	this.guiContainer.resize();
};

// Activate will either init object immediately or
// preload required resources and then call init
BaseState.prototype.activate = function(params) {
	this.id = params ? params['id'] : null;
	this.params = params;
	if (this.resources) {
		this.preload();
	} else {
		this.init(this.params);
	}
};

BaseState.prototype.hide = function (setEnable) {
    this.getGui("enhancedScene").hide();
    if (!setEnable) {
        this.guiContainer.resetUpdateInterval();
        this.setEnable(false);
    }
};

BaseState.prototype.show = function (setEnable) {
    if (typeof (setEnable) == "undefined")
        setEnable = true;
    this.getGui("enhancedScene").show();
    if (setEnable) {
        this.guiContainer.setUpdateInterval(GLOBAL_UPDATE_INTERVAL);
        this.setEnable(true);
    }
};

// Preloading of static resources - resources that
// should be upload before the use of the state
BaseState.prototype.preload = function() {
	// Loading JSONs first
	var totalToLoad = 0;
	var that = this;
	if (!this.resources) {
		this.preloadComplete();
		return;
	}
	
	if (this.resources.json) {
		totalToLoad = countProperties(that.resources.json);
		$['each'](this.resources.json, function(key, val) {
			$['getJSON'](key, function(data) {
				that.resources.json[key] = data;
			}).error(function() {
				assert(false, "error reading JSON " + key);
			}).complete(function() {
				totalToLoad--;
				if (totalToLoad <= 0)
					that.jsonPreloadComplete();
				
			});
		});
	} else {
		this.jsonPreloadComplete();
	}
};

BaseState.prototype.jsonPreloadComplete = function() {
	var that = this;
	if (this.resources.media) {
		var startTime = new Date();
		Resources.loadMedia(this.resources.media, function() {
			//console.log("Media loaded for %d ms", (new Date() - startTime));
			that.preloadComplete();
		}, this.preloadingCallback);
	} else {
		this.preloadComplete();
	}
};

BaseState.prototype.preloadComplete = function() {
	// loading complete, make initializing
	this.init(this.params);
};

BaseState.prototype.preloadJson = function(jsonToPreload) {
	if (!this.resources)
		this.resources = new Object();
	if (!this.resources.json)
		this.resources.json = new Object();
	if (typeof jsonToPreload === "string") {
		this.resources.json[jsonToPreload] = null;
	} else if (typeof jsonToPreload === "array") {
		$['each'](this.resources.json, function(key, val) {
			this.resources.json[val] = null;
		});
	} else {
		console.error("Invalid argument for preloadJson: should be array of json urls or single url.");
	}
	//this.jsonPreloadComplete();
};

BaseState.prototype.preloadMedia = function(mediaToPreload, callback) {
	if (!this.resources)
		this.resources = new Object();
	if (!this.resources.media)
		this.resources.media = new Array();
	
	this.preloadingCallback = callback;

	// if (typeof mediaToPreload === "array") {
	if (mediaToPreload instanceof Array) {
		// this.resources.media.concat(mediaToPreload);
		this.resources.media = mediaToPreload;
	} else {
		console.error("Invalid argument for preloadMedia: array of media urls.");
	}
};
/**
 * Account - root entity that is parent to all active entities
 */

var GLOBAL_UPDATE_INTERVAL = 50;
var DOM_MODE = false;

/**
 * @constructor
 */
function Account(parent) {
	Account.parent.constructor.call(this);
};

Account.inheritsFrom(BaseState);

Account.prototype.init = function(params) {
	var that = this;
	params = params ? params : {};
	Account.parent.init.call(this, params);
	// associative array of all active entities
	this.allEntities = new Object();
	// entities that should be update on timely basis
	this.scheduledEntities = new Object();
	this.renderEntities = new Object();

	//GuiSprites that have separate from visual entities updates
	this.staticSprites = {};
	
	// time interval for scheduled synchronization with server
	this.syncWithServerInterval = params['syncWithServerInterval'];
	// adding itself to allEntities for reading updates
	// in automatic mode
	this.id = selectValue(params['id'], "Account01");
	this.globalUpdateInterval = selectValue(params['globalUpdateInterval'],
			GLOBAL_UPDATE_INTERVAL);

	this.addEntity(this);
	// permanent GUI element
	this.backgroundState = new BackgroundState();
	params['backgroundState'] = selectValue(params['backgroundState'], {});
	params['backgroundState']['id'] = selectValue(
			params['backgroundState']['id'], "backgroundState01");
	this.backgroundState.activate(params['backgroundState']);

	// a singleton object
	assert(Account.instance == null,
			"Only one account object at time are allowed");
	Account.instance = this;
	
//	 this.debuggerInstance = turnOnOnScreenDebug();
//	 this.debuggerInstance.fps = {};
//	 this.debuggerInstance.fps.total = 0;
//	 this.debuggerInstance.fps.calls = 0;

	
	
	this.tabActive = true;
//	$(window).blur(function(e) {
//		that.tabActive = false;
//	});
//	$(window).focus(function(e) {
//		that.tabActive = true;
//		that.activateUpdateAndRender();
//
//	});
    this.backgroundState.resize();
};

Account.prototype.addEntity = function(newEntity) {
	assert(typeof (newEntity.id) == "string", "Entity ID must be string");
	assert(this.allEntities[newEntity.id] == null, "Entity with ID '"
			+ newEntity.id + "' already exists");
	this.allEntities[newEntity.id] = newEntity;
};

Account.prototype.getEntity = function(id) {
	return this.allEntities[id];
};

Account.prototype.removeEntity = function(id, dontDestroy) {
	var entity = this.allEntities[id];
	if (entity) {
		if (!dontDestroy) {
			this.removeScheduledEntity(entity);
			this.removeChild(entity);
			entity.destroy();
		}

		delete this.allEntities[id];

	}
};

Account.prototype.removeAllEntities = function(id, dontDestroy) {
	$['each'](this.allEntities, function(id, entity) {
		if (entity !== Account.instance) {
			Account.instance.removeEntity(id, false);
		}
	});
};



/*
 * restart for update and render with reqAnimFrame
 */
Account.prototype.activateUpdateAndRender = function() {
	var that = this;

	this.cancelUpdate = true;

	setTimeout(function() {
		that.prevUpdateTime = Date.now();
		that.cancelUpdate = false;
		that.globalUpdateIntervalHandle = window.requestAnimationFrame(function() {
			that.update(100);
		});
		that.globalRenderFrameHandle = window.requestAnimationFrame(function() {
			that.render();
		});
	}, 500);
};

//Account.prototype.activateUpdateAndRender = function() {
//	var that = this;
//
//	that.debuggerInstance.log(" activateUpdateAndRender");
//	clearTimeout(this.globalUpdateIntervalHandle);
//	clearTimeout(this.globalRenderFrameHandle);
//
//	that.debuggerInstance.log(" clear");
//	window.cancelAnimationFrame(this.globalUpdateIntervalHandle);
//	window.cancelAnimationFrame(this.globalRenderFrameHandle);
//
//	that.debuggerInstance.log(" cancel");
//	setTimeout(function() {
//		that.debuggerInstance.log(" timeout");
//		that.globalUpdateIntervalHandle = window.requestAnimationFrame(function() {
//			that.update(100);
//		});
//		that.globalRenderFrameHandle = window.requestAnimationFrame(function() {
//			that.render();
//		});
//	}, 500);
//};

/*
 * Scheduling for children entities
 */
Account.prototype.addScheduledEntity = function(newEntity) {
	assert(typeof (newEntity.id) == "string", "Entity ID must be string");
	var that = this;
	var dt = this.globalUpdateInterval;
	// if adding first object to scheduling queue start update interval
	if (!this.globalUpdateIntervalHandle) {
		that.prevUpdateTime = Date.now();
//		this.globalUpdateIntervalHandle = this.setInterval(function() {
//			that.update(dt);
//		}, dt);
		this.globalUpdateIntervalHandle = window.requestAnimationFrame(function() {
			that.update(dt);
		});

	}
	this.scheduledEntities[newEntity.id] = newEntity;
};

Account.prototype.removeScheduledEntity = function(entity) {
	assert(typeof (entity.id) == "string", "Entity ID must be string");
	delete this.scheduledEntities[entity.id];
	// if nothing to schedule anymore stop interval either
	if (!this.globalUpdateIntervalHandle
			&& $['isEmptyObject'](this.scheduledEntities)) {
		this.clearInterval(this.globalUpdateIntervalHandle);
		this.globalUpdateIntervalHandle = null;
	}
};
/*
 * Rendering for children entities
 */
// Если ничего нет - возвращаем обычный таймер
window.requestAnimationFrame = (function () {
    return  window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        /**
         *
         * @param {function} callback
         * @param element DOM element
         */
            function (callback, element) {
            window.setTimeout(callback, 1000 / 50);
        };
})();

Account.prototype.addRenderEntity = function(newEntity) {
	assert(typeof (newEntity.id) == "string", "Entity ID must be string");
	var that = this;
	// if adding first object to rendering queue start update interval
	if (!this.globalRenderFrameHandle) {
		this.lastRenderTime = Date.now();
		this.globalRenderFrameHandle = window.requestAnimationFrame(function() {
			that.render();
		});
	}
	this.renderEntities[newEntity.id] = newEntity;
};

Account.prototype.removeRenderEntity = function(entity) {
	assert(typeof (entity.id) == "string", "Entity ID must be string");
	delete this.renderEntities[entity.id];
	// if nothing to schedule anymore stop interval either
	if (!this.globalRenderFrameHandle
			&& $['isEmptyObject'](this.renderEntities)) {
		this.clearInterval(this.globalRenderFrameHandle);
		this.globalRenderFrameHandle = null;
	}
};

// Regular render update for registered enities
Account.prototype.render = function() {
	var that = this;
//	var dt = Date.now() - this.lastRenderTime;
//	if(dt != 0){
	
	var canvas = null;
		$['each'](this.renderEntities, function(id, entity) {
			if (entity && entity.isVisible && entity.isVisible()) {
				if (!canvas)
					canvas = entity;
				entity.render();
			}
		});
//	}
//	var that = this;
//	this.lastRenderTime = Date.now();
		
	if (!this.cancelUpdate) {
		this.globalRenderFrameHandle = window.requestAnimationFrame(function() {
			that.render();
		}, canvas);
	}
};

// Regular scheduled update for registered enities
Account.prototype.update = function(dt) {
	var that = this;
	var date = Date.now();
	if(date - this.prevUpdateTime >= this.globalUpdateInterval){
		dt = date - this.prevUpdateTime;
//		if (this.debuggerInstance) {
//			this.debuggerInstance.fps.total += dt;
//			this.debuggerInstance.fps.calls++;
//			if (this.debuggerInstance.fps.total > 1000) {
//				this.debuggerInstance.log2(this.debuggerInstance.fps.calls);
//				
//				this.debuggerInstance.fps.total = 0;
//				this.debuggerInstance.fps.calls = 0;
//			}
//		}
//		dt = this.globalUpdateInterval;
		this.prevUpdateTime = Date.now();
		$['each'](this.scheduledEntities, function(id, entity) {
			if (entity && entity.isEnabled()) {
				entity.update(dt);
			}
		});
		
		$['each'](this.staticSprites, function(name, sprite) {
			sprite.update(dt);
		});
		
	}else{
		dt += date - this.prevUpdateTime;
	}
	
	if (!this.cancelUpdate) {
		this.globalUpdateIntervalHandle = window.requestAnimationFrame(function() {
			that.update(dt);
		});
	}
};
Account.prototype.setEnable = function(isTrue) {

};

// called from outside, to notify entities about
// screen resize
Account.prototype.resize = function() {
	if (this.backgroundState) {
		this.backgroundState.resize();
	}
	if (this.children == null)
		return;
	$['each'](this.children, function(idx, entity) {
		if (entity && entity.resize) {
			entity.resize();
		}
	});
};

/*
 * NETWORKING FUNCTIONS dealing with external server /* NETWORKING FUNCTIONS
 * dealing with external server
 */
// Creates/Updates/Destroy all active entities
Account.prototype.readGlobalUpdate = function(data) {
	var that = this;
	$['each'](data, function(id, element) {
		// console.log("readGlobalUpdate key is ", id, element);
		var entity = Account.instance.getEntity(id);
		// entity already exists
		if (entity) {
			// entity should be destroyed with all of its children
			if (element["destroy"]) {
				// console.log("!!!!!Destroy entity '" + entity.id + "'");
				that.removeEntity(id);
				// remove entity from data
				delete data[id];
			} else {
				// updating the entity
				entity.readUpdate(element);
			}
			return;
		} else {
			var parentEntity = Account.instance.getEntity(element['parent']);
			if (parentEntity) {
				// create new entity
				element["id"] = id;
				entity = entityFactory.createObject(element["class"], element);
				// viking test
				// entity.parent = element.parent;
				that.addEntity(entity);
				// console.log("New entity '" + entity.id + "' of class "
				// + element["class"] + " with parent '"
				// + (entity.parent ? entity.parent.id : "no parent") + "'");
			} else
				console.error("Can`t find parent with id = " + element['parent']+"  for entity = " + id);
		}
	});
};

// Serialize all entities to JSON
Account.prototype.writeGlobalUpdate = function() {
	var data = {};
	this.writeUpdate(data, new Object());
	return data;
};

// read update data from server
Account.prototype.getUpdateFromServer = function(callback) {
	this.server.receiveData(callback);
};

// send data to server
Account.prototype.saveUpdateToServer = function(data, callback) {
	this.server.sendData(data, callback);
};

// perform specific command on server
Account.prototype.commandToServer = function(name, args, callback) {
	var that = this;
	this.server.command(name, args, function(result, data) {
		that.readGlobalUpdate(data);
		callback(result);
	});
};

// make sure client and server are synchronized at the moment
// var acc = 0;
Account.prototype.syncWithServer = function(callback, data, syncInterval) {
	// console.log("startShedule#",acc++);
	// var d = new Date();
	// var g = d.getTime();
	var writeData = this.writeGlobalUpdate();
	if (data) {
		$['extend'](true, writeData, data);
	}
	var that = this;
	this.server.sendData(writeData, function(data) {
		that.readGlobalUpdate(data);
		if (callback) {
			callback();
		}
	});
	syncInterval = selectValue(syncInterval, this.syncWithServerInterval);
	if (syncInterval != null) {
		this.clearTimeout(this.syncWithServerTimeoutId);
		var that = this;
		this.syncWithServerTimeoutId = this.setTimeout(function() {
			that.syncWithServer();
		}, 5000);
		// console.log("sheduleStoped"+(acc-1),((new Date()).getTime() - g));
	}
};
/**
 * VisualEntity - Entity with visual representation
 */

/**
 * @constructor
 */
function VisualEntity() {
	VisualEntity.parent.constructor.call(this);
};

VisualEntity.inheritsFrom(Entity);

VisualEntity.prototype.init = function(params) {
	VisualEntity.parent.init.call(this, params);
	this.x = params['x'];
	this.y = params['y'];
	this.z = params['z'];
	this.width = params['width'];
	this.height = params['height'];
	this.visible = selectValue(params['visible'], true);
	this.visuals = {}; // associative array of all attached visuals
	this.updateTime = GLOBAL_UPDATE_INTERVAL;
	var renderable = selectValue(params['renderable'], false);
	this.setRenderable(renderable);
};

VisualEntity.prototype.createVisual = function() {
	this.description = Account.instance.descriptionsData[this.params['description']];
	this.assert(this.description, "There is no correct description");
};

VisualEntity.prototype.addVisual = function(visualId, visualInfo) {
	var id = (visualId == null) ? 0 : visualId;
	this.assert(this.visuals[id] == null, "Visual id = '" + id
			+ "' is already created.");
	this.visuals[id] = visualInfo;

};


VisualEntity.prototype.isRenderable = function() {
	return this.renderable;
};

VisualEntity.prototype.setRenderable = function(isTrue, justUpdate) {
	this.renderable = isTrue;
	if (typeof (this.render) == "function") {
		if (isTrue) {
			Account.instance.addRenderEntity(this);
		} else {
			Account.instance.removeRenderEntity(this);
		}
	}
	this.justUpdate = justUpdate ? true : false; 
};

VisualEntity.prototype.getVisual = function(visualId) {
	var id = (visualId == null) ? 0 : visualId;
	return this.visuals[id] ? this.visuals[id].visual : null;
};

VisualEntity.prototype.removeVisual = function(visualId) {
	var id = (visualId == null) ? 0 : visualId;
	var visual = this.visuals[id].visual;
	this.guiParent.removeGui(visual);
	delete this.visuals[id];
};

VisualEntity.prototype.getVisualInfo = function(visualId) {
	var id = (visualId == null) ? 0 : visualId;
	return this.visuals[id];
};

VisualEntity.prototype.attachToGui = function(guiParent, clampByParentViewport) {
	if (!this.visual) {
		this.guiParent = guiParent ? guiParent : this.params['guiParent'];
		this.assert(this.guiParent, "No guiParent provided");
		this.createVisual();

		var that = this;
		$['each'](that.visuals, function(id, visualInfo) {
			visualInfo.visual.visualEntity = that;
			that.guiParent.addGui(visualInfo.visual);
			if (visualInfo.visual.clampByParentViewport)
				visualInfo.visual.clampByParentViewport(clampByParentViewport);
		});
	}

};

VisualEntity.prototype.destroy = function(dontRemoveVisual) {
	VisualEntity.parent.destroy.call(this);
	if (this.guiParent && !dontRemoveVisual) {
		var that = this;
		$['each'](this.visuals, function(id, visualInfo) {
			visualInfo.visual.hide();
			that.guiParent.removeGui(visualInfo.visual);
		});
	}
};

VisualEntity.prototype.setZ = function(z) {
	if (typeof z == "number") {
		this.z = z;
	}
	var that = this;
	$['each'](that.visuals, function(id, visualInfo) {
		if (typeof that.z == "number") {
			var visualZ = typeof visualInfo.z == "number" ? visualInfo.z : 0;
			visualInfo.visual.setZ(that.z + visualZ);
		}
	});
};
VisualEntity.prototype.setPosition = function(x, y) {
	this.x = x;
	this.y = y;

	var that = this;
	$['each'](that.visuals, function(id, visualInfo) {
		// dont' move dependent
		if (visualInfo.dependent) {
			return;
		}
		var x = that.x, y = that.y;
		if (typeof visualInfo.offsetX == "number") {
			x -= visualInfo.offsetX;
		}
		if (typeof visualInfo.offsetY == "number") {
			y -= visualInfo.offsetY;
		}

		visualInfo.visual.setPosition(x, y);
	});
};

VisualEntity.prototype.move = function(dx, dy) {
	this.setPosition(this.x + dx, this.y + dy);
};

// Aligns logic position of visualEntity to the one
// of actual visual
VisualEntity.prototype.setPositionToVisual = function(visualId) {
	var visualInfo = this.getVisualInfo(visualId);
	this.x = visualInfo.visual.x + visualInfo.offsetX;
	this.y = visualInfo.visual.y + visualInfo.offsetY;
	this.setPosition(this.x, this.y);
};

VisualEntity.prototype.show = function() {
	this.visible = true;
	$['each'](this.visuals, function(id, visualInfo) {
		visualInfo.visual.show();
	});
};

VisualEntity.prototype.isVisible = function() {
	return this.visible;
};

VisualEntity.prototype.hide = function() {
	this.visible = false;
	$['each'](this.visuals, function(id, visualInfo) {
		visualInfo.visual.hide();
	});
};

VisualEntity.prototype.resize = function() {
	var that = this;
	$['each'](this.visuals, function(id, visualInfo) {
		visualInfo.visual.resize();
	});
};

VisualEntity.prototype.update = function(updateTime, x, y){
	if(x && y){
		this.stpX = x - this.x;
		this.stpY = y - this.y;
	}
};

VisualEntity.prototype.render = function(renderTime){
//	console.log("RENDER", this.newX, this.newY);
//	if(renderTime == 0){
//		return;
//	}
//	if(this.isEnabled()){
//		console.log("enabled");
//	}
//	if(this.isRenderable()){
////		console.log("renderable");
//	}
//	var interval = GLOBAL_UPDATE_INTERVAL;
//	this.updateTime -= renderTime;
//	if(this.updateTime == 0 ){
//		this.update(interval);
//		this.updateTime = interval;
//		return;
//	}
//	if(this.updateTime < 0 ){
//		this.update(interval);
//		this.updateTime = interval + this.updateTime ;
//		return;
//	}
//	if(this.stpX && this.stpY && !this.justUpdate){
//		this.x += renderTime/interval * this.stpX;//(1 - renderTime/interval) * this.x + renderTime/interval * this.newX;
//		this.y += renderTime/interval * this.stpY;//(1 - renderTime/interval) * this.y + renderTime/interval * this.newY;
//		console.log("RENDER", renderTime/interval * this.stpX, renderTime/interval * this.stpY);
//		this.setPosition(this.x, this.y);
//	}
};

VisualEntity.prototype.writeUpdate = function(globalData, entityData) {
	// if(this.id == "Door01"){
	// console.log("FALSE",this.x,this.y);
	// }
	this.writeUpdateProperty(entityData, 'x', this.x);
	this.writeUpdateProperty(entityData, 'y', this.y);
	VisualEntity.parent.writeUpdate.call(this, globalData, entityData);
};

VisualEntity.prototype.readUpdate = function(data) {
	// this.x = this.readUpdateProperty(data, 'x');
	// this.y = this.readUpdateProperty(data, 'y');
	VisualEntity.parent.readUpdate.call(this, data);

};
/**
 * Scene - Container for VisualEntities
 */

function Scene() {
	Scene.parent.constructor.call(this);
};

Scene.inheritsFrom(VisualEntity);
Scene.prototype.className = "Scene";

Scene.prototype.createInstance = function(params) {
	var entity = new Scene();
	entity.init(params);
	return entity;
};

entityFactory.addClass(Scene);

Scene.prototype.init = function(params) {
	Scene.parent.init.call(this, params);
};

Scene.prototype.createVisual = function(noChildAttach) {
	var params = this.params;
	var visual = guiFactory.createObject("GuiScene", {
		parent : this.guiParent,
		style : "scene",
		x : params['x'],
		y : params['y'],
		width : params['width'],
		height : params['height'],
		background : params['background'],
		canvas : params['canvas']
	});

	var visualInfo = {};
	visualInfo.visual = visual;
	this.addVisual(null, visualInfo);

	var that = this;
	this.children = this.children ? this.children : new Array();
	if(!noChildAttach){
		$['each'](this.children, function(id, val) {
			that.attachChildVisual(val);
		});
	}
};

Scene.prototype.attachChildVisual = function(child) {
	if (child.attachToGui) {
		child.attachToGui(this.getVisual(), true);
	}
};

Scene.prototype.move = function(dx, dy, parallaxDepth) {
	var visual = this.getVisual();
	if (parallaxDepth) {
		$['each'](visual.backgrounds, function(i, back) {
			if (!back)
				return;
			if (i != visual.backgrounds.length - 1) {
				visual.setBackgroundPosition(visual.backgrounds[i].left
						- (dx * (i / parallaxDepth)), visual.backgrounds[i].top
						- (dy * (i / parallaxDepth)), i);
			}
		});
	}

	visual.move(dx, dy);
};
/**
 * Item - VisualEntity that can be stored in inventory or placed inside scene.
 */
var ITEM_NAME = "Item";

/**
 * @constructor
 */
function Item() {
	Item.parent.constructor.call(this);
};

Item.inheritsFrom(VisualEntity);
Item.prototype.className = ITEM_NAME;

Item.prototype.createInstance = function(params) {
	var entity = new Item();
	entity.init(params);
	return entity;
};

entityFactory.addClass(Item);

Item.prototype.init = function(params) {
	Item.parent.init.call(this, params);
	this.stashed = params['stashed'];
	if (this.stashed) {
		return;
	} else {
		var guiParent = this.params['guiParent'] ? this.params['guiParent']
				: this.parent.visual;
		if (guiParent) {
			this.attachToGui(guiParent);
		}
	}

	this.z = (this.z != null) ? this.z : 0;
};

Item.prototype.getIcon = function() {
	return this.description['totalImage'];
};

Item.prototype.createVisual = function() {
	this.assert(this.guiParent, "No gui parent provided for creating visuals");
	if(this.description == null){
		this.description = Account.instance.descriptionsData[this.params['description']];
	}
	this.assert(this.description, "There is no correct description");

	var totalImage = Resources.getImage(this.description['totalImage']);

	visual = guiFactory.createObject("GuiSprite", {
		parent : this.guiParent,
		style : "sprite",
		x : this.params['x'],
		y : this.params['y'],
		width : this.description['totalImageWidth'],
		height : this.description['totalImageHeight'],
		totalImage : totalImage,
		totalImageWidth : this.description['totalImageWidth'],
		totalImageHeight : this.description['totalImageHeight'],
		totalTile : this.description['totalTile']
	});

	var visualInfo = {};
	visualInfo.visual = visual;
	visualInfo.z = this.description['z-index'];
	visualInfo.offsetX = this.description['centerX'] ? calcPercentage(
			this.description['centerX'], this.description['width']) : 0;
	visualInfo.offsetY = this.description['centerY'] ? calcPercentage(
			this.description['centerY'], this.description['height']) : 0;

	this.addVisual(null, visualInfo);
	this.setPosition(this.x, this.y);
	this.setZ(null);
};

Item.prototype.writeUpdate = function(globalData, entityData) {
	Item.parent.writeUpdate.call(this, globalData, entityData);
};
Item.prototype.readUpdate = function(data) {
	// this.params['count'] = data['count'];
	Item.parent.readUpdate.call(this, data);
};
/**
 * SimpleCountdown - VisualEntity with only countdown label.
 */

/**
 * @constructor
 */
function SimpleCountdown() {
	SimpleCountdown.parent.constructor.call(this);
};

SimpleCountdown.inheritsFrom(VisualEntity);
SimpleCountdown.prototype.className = "SimpleCountdown";

SimpleCountdown.prototype.createInstance = function(params) {
	var entity = new SimpleCountdown();
	entity.init(params);
	return entity;
};

entityFactory.addClass(SimpleCountdown);

SimpleCountdown.prototype.init = function(params) {
	this.paused = true;
	SimpleCountdown.parent.init.call(this, params);
	this.label = params['label'];
	//refactor!!!!!
	var go = null;
	var alarmColor = null;
	if(this.description){
		go = this.description['go'];
		alarmColor = this.description['alarmColor'];
	}
	this.goText = selectValue(params['go'], go); 
	
	if(!params['initStart']){
		this.setEnable(false);
	}else{
		this.paused = false;
	}
	this.count = this.params['count'] * 1000;
	this.alarmCount = this.params['alarmCount'] * 1000;
	
	this.alarmColor = selectValue(this.params['alarmColor'], alarmColor);
};

/**
 * Will be called after a cycle will be finished
 * 
 * @param animationCycleEndCallback
 */
SimpleCountdown.prototype.setCycleEndCallback = function(cycleEndCallback) {
	this.cycleEndCallback = cycleEndCallback;
};

SimpleCountdown.prototype.createVisual = function() {
	SimpleCountdown.parent.createVisual.call(this);
	this.description['style'] = (this.description['style'] == null) ? "dialogButtonLabel lcdmono-ultra"
			: this.description['style'];
	
	this.label = this.label ? this.label : guiFactory.createObject("GuiLabel", {
		"parent" : this.guiParent,
		"x" : this.params['x'],
		"y" : this.params['y'],
		"style" : this.description['style'],// "dialogButtonLabel
											// lcdmono-ultra",
		"width" : this.description['width'],
		"height" : this.description['height'],
		"align" : "center",
		"verticalAlign" : "middle",
		"text" : this.params['count'],
		"fontSize" : this.description['fontSize'],
		"color" : this.description['color']
	});
	// this.visual.addGui(this.label);

	var visualInfo = {};
	visualInfo.visual = this.label;
	this.addVisual(null, visualInfo);

	this.paused = false;
};

SimpleCountdown.prototype.pause = function() {
	this.paused = true;
};

SimpleCountdown.prototype.resume = function() {
	this.paused = false;
	this.time = Date.now();
};

SimpleCountdown.prototype.setTime = function(sec) {
	this.count = sec * 1000;
};

SimpleCountdown.prototype.addTime = function(sec) {
	this.count += sec * 1000;
};

SimpleCountdown.prototype.getTimeRemains = function() {
	return this.count;
};

SimpleCountdown.prototype.start = function(){
	this.setEnable(true);
	this.paused = false;
	this.time = Date.now();
};

SimpleCountdown.prototype.updateLabel = function(){
	var secCount = Math.floor(this.count / 1000);
	if(secCount >= 60){
		var minCount = Math.floor(secCount / 60);
		secCount = secCount - (minCount * 60);
		this.label.change(""+minCount+" : "+secCount);
	}else{
		this.label.change(secCount);
	}
};

SimpleCountdown.prototype.update = function(updateTime) {
	if (!this.paused && this.count) {
//		this.count -= updateTime;
		this.count -= Date.now() - this.time;
		this.time = Date.now();
		if (this.count > 0) {
			if (this.alarmCount && (this.count < this.alarmCount + 1000)) {
				this.label.setColor(this.alarmColor);
				this.alarmCount = null;
			} else {
//				this.label.change(Math.floor(this.count / 1000));
				this.updateLabel();
			}
		} else {
			this.label.change(this.goText);
			if (this.cycleEndCallback) {
				this.cycleEndCallback();
				this.cycleEndCallback = null;
			}
		}
	}
};
/**
 * Countdown - VisualEntity with countdown label inside it.
 */

/**
 * @constructor
 */
function Countdown() {
	Countdown.parent.constructor.call(this);
};

Countdown.inheritsFrom(VisualEntity);
Countdown.prototype.className = "Countdown";

Countdown.prototype.createInstance = function(params) {
	var entity = new Countdown();
	entity.init(params);
	return entity;
};

entityFactory.addClass(Countdown);

Countdown.prototype.init = function(params) {
	Countdown.parent.init.call(this, params);
};

/**
 * Will be called after a cycle of animation finished
 * 
 * @param animationCycleEndCallback
 */
Countdown.prototype.setCycleEndCallback = function(cycleEndCallback) {
	this.cycleEndCallback = cycleEndCallback;
};

/**
 * Will be called after the countdown completely finished
 * 
 * @param animationEndCallback
 */
Countdown.prototype.setEndCallback = function(EndCallback) {
	this.EndCallback = EndCallback;
};

Countdown.prototype.createVisual = function() {
	Countdown.parent.createVisual.call(this);
	if (this.description['sprite']) {
		this.sprite = guiFactory
				.createObject(
						"GuiSprite",
						{
							'parent' : this.guiParent,
							'style' : "dialogButton",
							'x' : this.params['x'],
							'y' : this.params['y'],
							'width' : this.description['sprite']['width'],
							'height' : this.description['sprite']['height'],
							'totalImage' : Resources
									.getImage(this.description['sprite']['totalImage']),
							'totalImageWidth' : this.description['sprite']['totalImageWidth'],
							'totalImageHeight' : this.description['sprite']['totalImageHeight'],
							'totalTile' : this.description['sprite']['totalTile'],
							'spriteAnimations' : this.description['sprite']['spriteAnimations']

						});
		var visualInfo = {};
		visualInfo.visual = this.sprite;
		this.addVisual("sprite", visualInfo);
	}
	this.tickSound = this.description['tickSound'] ? this.description['tickSound']
			: "beepShort";
	this.lastSound = this.description['lastSound'] ? this.description['lastSound']
			: "beepShort";
	this.tickDuration = this.description['tickDuration'] ? this.description['tickDuration']
			: 1000;
	this.count = this.params['count'];
	this.duration = this.count * this.tickDuration;
	this.alarmColor = this.description['alarmColor'];
	this.alarmCount = this.params['alarmCount'];
	this.paused = this.description['paused'] ? this.description['paused']
			: false;
	// this.go = this.description['go'];
	if (this.description['label']) {
		this.label = guiFactory
				.createObject(
						"GuiLabel",
						{
							"parent" : this.guiParent,
							"style" : this.description['label']['params']['style'] ? this.description['label']['params']['style']
									: "dialogButtonLabel lcdmono-ultra",
							"width" : this.description['label']['params']['width'],
							"height" : this.description['label']['params']['height'],
							"x" : this.description['label']['params']['x'] ? this.description['label']['params']['x']
									: this.params['x'],
							"y" : this.description['label']['params']['y'] ? this.description['label']['params']['y']
									: this.params['y'],
							"align" : "center",
							"verticalAlign" : "middle",
							"text" : this.count,
							"fontSize" : this.description['label']['params']['fontSize'],
							"color" : this.description['label']['params']['color']
						});
		var labelVisualInfo = {};
		labelVisualInfo.visual = this.label;
		this.addVisual("label", labelVisualInfo);
	}

	var that = this;
	
	var end = false;
	
	var animationEnd = function() {
		if (!that.paused) {
			if (that.count > 1) {
				that.count--;
//				if (that.cycleEndCallback) {
//					that.cycleEndCallback();
//				}
				if (that.label)
					that.label.change(that.count);
				if (that.sprite)
					that.sprite.playAnimation("countdown", that.tickDuration,
							false);
				that.sprite.setAnimationEndCallback(animationEnd);
			} else {
				if (that.sprite)
					that.sprite.playAnimation("empty", that.tickDuration, true);
				if (that.label)
					that.label.change(that.description["go"]);
				if (that.EndCallback) {
					that.EndCallback();
				}
				end = true;
			}
		}
	};
	// Sound.play("beepShort");
	if (!end) {
		if (this.sprite) {
			this.sprite.playAnimation("countdown", 1000, false);
			this.sprite.setAnimationEndCallback(animationEnd);
		}
	}
};

Countdown.prototype.update = function(updateTime) {
	var text = Math.floor(this.duration / 1000) + 1;
	if (!this.paused) {
		if (this.sprite) {
			this.sprite.update(updateTime);
		}
		if (this.label) {
			this.duration -= updateTime;
			if (this.duration > 0) {
				if (this.cycleEndCallback
						&& (text != Math.floor(this.duration / 1000) + 1)) {
					this.cycleEndCallback();
					text = this.label.text;
				}
				if (this.alarmCount
						&& ((this.duration / 1000) < this.alarmCount)) {
					this.label.setColor(this.description['alarmColor']);
					this.alarmCount = null;
				} else {
					if (!this.sprite) {
						this.label.change(Math.floor(this.duration / 1000) + 1);
					}
				}
			} else {
				if (!this.sprite) {
					this.label.change(this.description['go']);
					if (this.EndCallback) {
						this.EndCallback();
						delete this.update;
					}
				}
			}
		}
		if (!this.label && !this.sprite) {
			if (this.duration > 0) {
				this.duration -= updateTime;
				if (this.cycleEndCallback
						&& (text != Math.floor(this.duration / 1000) + 1)) {
					this.cycleEndCallback();
					text = Math.floor(this.duration / 1000) + 1;
				}
			} else {
				if (this.EndCallback) {
					this.EndCallback();
					delete this.update;
				}
			}
		}
	}
};
Countdown.prototype.pause = function() {
	this.paused = true;
};

Countdown.prototype.resume = function() {
	this.paused = false;
};
Countdown.prototype.getTimeRemains = function() {
	return this.count;
};
/**
 * Inventory
 */

/**
 * @constructor
 */
function Inventory() {
	Inventory.parent.constructor.call(this);
};

Inventory.inheritsFrom(Entity);

Inventory.prototype.className = "Inventory";
Inventory.prototype.createInstance = function(params) {
	var entity = new Inventory();
	entity.init(params);
	return entity;
};

entityFactory.addClass(Inventory);

Inventory.prototype.init = function(params) {
	this.children = new Array();
	Inventory.parent.init.call(this, params);
	// this.add();
};
Inventory.prototype.clear = function() {
	this.params.itemList = null;
};
Inventory.prototype.addItem = function(item) {
	if (item instanceof Item) {
		Account.instance.commandToServer("changeParent", [ item['id'],this.id ],
				function(success) {
					if (success) {
						console.log("SUCCESS");
						console.log("ItemADDED");
					} else {
						console.log("FAIL");
					}
				});
	} 
};

Inventory.prototype.readUpdate = function(params) {
	Inventory.parent.readUpdate.call(this, params);
};
Inventory.prototype.writeUpdate = function(globalData, entityData) {
	Inventory.parent.writeUpdate.call(this, globalData, entityData);
};
/**
 * BackgroundState set of useful functions, operating div that permanently exist
 * in game
 */

var LEVEL_FADE_TIME = 500;

/**
 * @constructor
 */
function BackgroundState() {
	BackgroundState.parent.constructor.call(this);
};

BackgroundState.inheritsFrom(BaseState);

BackgroundState.prototype.init = function(params) {
	params = params ? params : {};
	var image = selectValue(
			params['image'],
			"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NkAAIAAAoAAggA9GkAAAAASUVORK5CYII=");
	var background;
	if (params['background']) {
		background = params['background'];
		image = null;
	}

	// foreach(params['dialogs'])
	// ['Ok']
	this.dialogs = new Object();
	var that = this;
	if (params['dialogs'])
		$['each'](params['dialogs'], function(index, value) {
			that.dialogs[index] = guiFactory.createObject("GuiMessageBox",
					value['params']);
		});
	BackgroundState.parent.init.call(this, params);
	// an transparent PNG image 1x1 pixel size
	// to prevent clicks
	
	if (params['transparent']) {
		this.transparent = true;
	} else {
		this.transparent = false;	
	}
	
	this.mask = guiFactory.createObject("GuiDiv", {
		parent : "#all",
		image : !this.transparent?image:null,
		background : !this.transparent?background:null,
		style : !this.transparent?"mask":'',
//        width : "FULL_WIDTH",
//        height : "FULL_HEIGHT",
        width : "100%",
        height : "100%",
		x : 0,
		y : 0
	});

	if (params["loader"]) {
		if (params["loader"].text) {
			this.loader = guiFactory.createObject("GuiLabel", {
				parent : this.mask,
				image : params['loader'].image,
				text : params["loader"].text,
				style : params["loader"].style?params["loader"].style:"spite",
				fontSize : params["loader"].fontSize?params["loader"].fontSize:40,
				width : params['loader'].width?params['loader'].width:274,
				height : params['loader'].height?params['loader'].height:66,
				x : "50%",
				y : params["loader"].y?params["loader"].y:"65%",
				offsetX : params['loader'].width?(-params['loader'].width/2):-137,
				offsetY : params['loader'].height?(-params['loader'].height/2):-33,
				align : "center"
			});
		} else {
			this.loader = guiFactory.createObject("GuiDiv", {
				parent : this.mask,
				image : params['loader'].image,
				background : {
					image : params['loader'].image
				},
				style : "spite",
				width : params['loader'].width?params['loader'].width:274,
				height : params['loader'].height?params['loader'].height:66,
				x : "50%",
				y : "65%",
				offsetX : params['loader'].width?(-params['loader'].width/2):-137,
				offsetY : params['loader'].height?(-params['loader'].height/2):-33
			});
		}

		this.loader.setClickTransparent(true);
		this.addGui(this.loader);
		this.loader.$()['css']("opacity", 0);
		this.loader.$()['css']("position", "absolute");
//		this.loader.$()['css']("top", "50%");
//		this.loader.$()['css']("left", "50%");
		this.loader.setZ(11001);
		this.loader.hide();
		// this.mask.children.addGui(loader,"loader");
	}
	this.addGui(this.mask);
	this.mask.setClickTransparent(true);
	this.mask.$()['css']("opacity", 0);
	this.mask.setZ(1000);
    this.mask.hide();
};

BackgroundState.prototype.fadeIn = function(fadeTime, color, callback) {
	var that = this;
	console.log("BackgroundState.prototype.fadeIn");
	if (this.loader != null) {
		this.loader.show();
		this.loader.$()['css']("opacity", 0);
		this.loader.$()['stop']();
		this.loader.$()['delay'](0.5 * fadeTime);
		this.loader.fadeTo(1, 0.5 * fadeTime, function() {
		});
	}
	this.mask.show();
	this.mask.$()['stop']();
	this.mask.$()['css']("opacity", 0);
	if (!this.transparent)
		this.mask.$()['css']("background-color", color);
	this.mask.fadeTo(1, fadeTime, function(){
		that.faded = true;
//		that.mask.show();
		if (callback)
			callback();
	});
};

BackgroundState.prototype.fadeOut = function(fadeTime, callback) {
	var that = this;
	console.log("BackgroundState.prototype.fadeOut");
	if (this.loader != null) {
		this.loader.$()['stop']();
		this.loader.hide();
//		this.loader.fadeTo(0, 0.3 * fadeTime);
	}
	this.mask.fadeTo(0, fadeTime, function() {
		that.faded = false;
		that.mask.hide();
		if (callback)
			callback();
	});
	this.faded = false;
};

BackgroundState.prototype.resize = function() {
	BackgroundState.parent.resize.call(this);
    this.mask.resize();
	if (this.loader != null) {
		this.loader.resize();
		this.loader.$()['css']("position", "absolute");
//		this.loader.$()['css']("top", "50%");
//		this.loader.$()['css']("left", "50%");
	}
	$['each'](this.dialogs, function(index, value) {
		value.resize();
	});
};var DEFAULT_B2WORLD_RATIO = 1;

if (typeof(Native) == "undefined") {
	b2Math = Box2D.Common.Math.b2Math;
	b2Vec2 = Box2D.Common.Math.b2Vec2;
	b2BodyDef = Box2D.Dynamics.b2BodyDef;
	b2Body = Box2D.Dynamics.b2Body;
	b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
	b2Fixture = Box2D.Dynamics.b2Fixture;
	b2World = Box2D.Dynamics.b2World;
	b2MassData = Box2D.Collision.Shapes.b2MassData;
	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
	b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
	b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef;
}

// TODO: remove?
function boxPolyVertices(positionX, positionY, extentionX, extentionY) {
    var px = positionX;
    var py = positionY;
    var ex = extentionX;
    var ey = extentionY;
    return [
        {
            x: px,
            y: py
        },
        {
            x: px + ex,
            y: py
        },
        {
            x: px + ex,
            y: py + ey
        },
        {
            x: px,
            y: py + ey
        }
    ];
};

var MathUtils = (function () {
    return {
        toRad: function (angle) {
            return Math.PI / 180. * angle;
        },
        toDeg: function (angle) {
            return 180. / Math.PI * angle;
        }
    };
})();

function calculateAngle(vec1, vec2) {
    var v1 = new b2Vec2(vec1.x, vec1.y);
    var v2 = new b2Vec2(vec2.x, vec2.y);

    var dot = (vec1.x * vec2.x) + (vec1.y * vec2.y);
    var cosA = dot / (v1.Length() * v2.Length());
    return MathUtils.toDeg(Math.acos(cosA));
};

function calculateSignedAngle(vec1, vec2) {
    var v1 = new b2Vec2(vec1.x, vec1.y);
    var v2 = new b2Vec2(vec2.x, vec2.y);

    var f = (vec1.x * vec2.y) + (vec1.y * vec2.x);
    var sinA = f / (v1.Length() * v2.Length());
    return sinA;
};

function DebugCanvas() {
    //setup debug draw
    var canvasElm = document.getElementById("debugCanvas");
    if (!canvasElm) {
        $("#root")
            .append(
            "<canvas id='debugCanvas' style='position :absolute; top: 0px; left: 0px;'></canvas>");
        canvasElm = document.getElementById("debugCanvas");
    }
    canvasElm.width = BASE_WIDTH;
    canvasElm.height = BASE_HEIGHT;
    canvasElm.style.width = canvasElm.width * Screen.widthRatio();
    canvasElm.style.height = canvasElm.height * Screen.heightRatio();

    var debugDraw = new b2DebugDraw();
    debugDraw.SetSprite(canvasElm.getContext("2d"));
    debugDraw.SetDrawScale(Physics.getB2dToGameRatio());
    debugDraw.SetFillAlpha(0.5);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    Physics.getWorld().SetDebugDraw(debugDraw);
};

var Physics = (function () {
    var world = null;
    var b2dToGameRatio = DEFAULT_B2WORLD_RATIO; // Box2d to Ultimate.js coordinates //TODO: implement
    var worldBorder = null;
    var timeout = null;
    var pause = false;
    var debugMode = true;
    var debugCanvas = null;
    var updateItems = [];
    var bodiesToDestroy = [];
    var contactListener = null;
    var contactProcessor = null;

    function debugDrawing(v) {
        if (v && !debugCanvas) {
            debugCanvas = new DebugCanvas();
        }

        if (!v && debugCanvas) {
            debugCanvas.debugDrawContext
                .clearRect(0, 0, debugCanvas.debugCanvasWidth,
                debugCanvas.debugCanvasHeight);
            debugCanvas = null;
        }
    }

    /**
     *
     * @param {b2Vec2} gravity Default: b2Vec2(0, 10)
     * @param {boolean} sleep default: true;
     * @param {number} ratio Box2d to Ultimate.js coordinates
     */
    function createWorld(gravity, sleep, ratio) {
        if (world != null) {
            return;
        }
        b2dToGameRatio = ratio != null ? ratio : DEFAULT_B2WORLD_RATIO;
        world = new b2World(gravity != null ? gravity : new b2Vec2(0, 10), sleep != null ? sleep : true);
        contactProcessor = new ContactProcessor();
        /// New contact listener version
//        contactListener = new Box2D.Dynamics.b2ContactListener;
//        contactListener.BeginContact = function(contact) {
//        	if (contactProcessor) {
//				var type1 = contact.GetFixtureA().GetBody().GetUserData().params["type"];
//				var type2 = contact.GetFixtureB().GetBody().GetUserData().params["type"];
//				contactProcessor.processBegin(type1, type2, contact);	
//        	}
//        };
//        contactListener.EndContact = function(contact) {
//        	if (contactProcessor) {
//				var type1 = contact.GetFixtureA().GetBody().GetUserData().params["type"];
//				var type2 = contact.GetFixtureB().GetBody().GetUserData().params["type"];
//				contactProcessor.processEnd(type1, type2, contact);	
//        	}
//    		
//        };
//        contactListener.PreSolve = function(contact, impulse) {
//        	
//        };
//        contactListener.PostSolve = function(contact, oldManifold) {
//        	
//        };
//        
//        world.SetContactListener(contactListener);
        ///
// Old one        
//  contactListener = new ContactListener(contactProcessor);
    }

    // TODO: remove?
    function createWorldBorder(params) {
        assert(world);

        var SIDE = ENHANCED_BASE_MARGIN_WIDTH;
        if (!GROUND) {
            var GROUND = 0;
        }

        var ADD_HEIGHT = 1000;
        var borderWidth = 100;
        var B = borderWidth;
        var W = BASE_WIDTH;
        var H = BASE_HEIGHT;
        var WE = W + 2 * B + 2 * SIDE;
        var HE = H + 2 * B - GROUND;
        var poligons = [
            boxPolyVertices(-B - SIDE, -B - ADD_HEIGHT, B, HE + ADD_HEIGHT),
            boxPolyVertices(W + SIDE, -B - ADD_HEIGHT, B, HE + ADD_HEIGHT),
            boxPolyVertices(-B - SIDE, H - GROUND, WE, B) ];
        worldBorder = Physics.createPolyComposite(0, 0, 0, poligons);
    }

    // TODO: remove?
    function putToSleep() { // 2dBody function
        world['m_contactManager']['CleanContactList']();
        this['m_flags'] |= b2Body['e_sleepFlag'];
        this['m_linearVelocity']['Set'](0.0, 0.0);
        this['m_angularVelocity'] = 0.0;
        this['m_sleepTime'] = 0.0;
    }

    // TODO: remove?
    function setBodyPoseByShape(position, angle) {
        this['SetCenterPosition'](position, angle);
        var shapeToBody = b2Math['SubtractVV'](this['m_position'],
            this['GetShapeList']()['GetPosition']());
        this['SetCenterPosition']
        (b2Math['AddVV'](position, shapeToBody), angle);
    }

    // TODO: remove?
    function getShapesCount() {// 2dBody function
        var shape = this['GetShapeList']();
        var shapesCount = 0;
        for (; shape != null; ++shapesCount, shape = shape['m_next'])
            ;
        return shapesCount;
    }

    // TODO: remove?
    function getShapeByIdx(shapeIdx) {// 2dBody function
        var shapesCount = this.getShapesCount();
        var listPosition = shapesCount - 1 - shapeIdx;
        var shape = this['GetShapeList']();
        for (var i = 0; i < listPosition; ++i) {
            if (!shape['m_next']) {
                eLog("bad shape idx!");
                return null;
            }
            shape = shape['m_next'];
        }

        return shape;
    }

    // TODO: remove?
    function setContactCallback(callback, shapeIdx) {
        if (shapeIdx != undefined) {
            this.getShapeByIdx(shapeIdx)['contactCallback'] = callback;
            return;
        }
        var shape = this['GetShapeList']();
        for (; shape != null; shape = shape['m_next']) {
            shape['contactCallback'] = callback;
        }
    }

    return { // public interface
        createWorld: function (gravity, sleep, ratioB2dToUl) {
            createWorld(gravity, sleep, ratioB2dToUl);
        },
        getWorld: function () {
            createWorld();
            assert(world, "No physics world created!");
            return world;
        },
        getB2dToGameRatio: function () {
            return b2dToGameRatio;
        },
        addBodyToDestroy: function (body) {
            bodiesToDestroy.push(body);
        },
        createWorldBorder: function (params) {
            createWorldBorder(params);
        },
        getContactProcessor: function () {
            return contactProcessor;
        },
        getContactListener: function () {
            return contactListener;
        },
        updateWorld: function () {
            if (pause) {
                return;
            }

            var world = this.getWorld();
            world.Step(1 / 45, 5, 5);
            if (timeout) {
                timeout.tick(15);
            }

            if (debugCanvas) {
                world.DrawDebugData();
            }
            world.ClearForces();
            for (var i = 0; i < updateItems.length; ++i) {
                updateItems[i].updatePositionFromPhysics();
                if (DOM_MODE && updateItems[i].initialPosRequiered) {
                	updateItems[i].initialPosRequiered = null;
            		updateItems[i].physics.SetAwake(false);
                }
            }
            if (bodiesToDestroy.length > 0) {
                for (var i = 0; i < bodiesToDestroy.length; ++i) {
                    world.DestroyBody(bodiesToDestroy[i]);
                }
                bodiesToDestroy = [];
            }
        },
        destroy: function (physics) {
            if (!physics) {
                return;
            }
            assert(world);
            world.DestroyBody(physics);
        },
        destroyWorld: function () {
            Physics.destroy(worldBorder);
            world = null;
            updateItems = [];
        },
        getWorldBorder: function () {
            if (!worldBorder) {
                createWorld();
            }
            assert(worldBorder);
            return worldBorder;
        },
        pause: function (v) {
            if (v == null) {
                pause = !pause;
            } else {
                pause = v;
            }
        },
        paused: function () {
            return pause;
        },
        resetTimeout: function (addTime) {
            if (!timeout) {
                return;
            }
            timeout.timeOut += addTime;
        },
        clearTimeout: function () {
            timeout = null;
        },
        setTimeout: function (callback, time) {
            timeout = {
                time: 0,
                callback: callback,
                timeOut: time,
                tick: function (delta) {
                    this.time += delta;
                    if (this.time < this.timeOut) {
                        return;
                    }
                    this.callback();
                    timeout = null;
                }
            };
        },
        updateItemAdd: function (entity) {
            var idx = updateItems.indexOf(entity);
            if (idx == -1) {
                updateItems.push(entity);
            }
        },
        updateItemRemove: function (entity) {
            var idx = updateItems.indexOf(entity);
            if (idx != -1) {
                updateItems.splice(idx, 1);
            }
        },
        destroy: function (entity) {
            if (!entity) {
                return;
            }
            Physics.updateItemRemove(entity);
            if (world && entity.physics) {
                world.DestroyBody(entity.physics);
            }
        },
        debugDrawing: function (trueOrFalse) {
            debugDrawing(trueOrFalse);
        },
        debugDrawingIsOn: function (trueOrFalse) {
            return !!debugCanvas;
        },
        setDebugModeEnabled: function (trueOrFalse) {
            debugMode = trueOrFalse;
        },
        debugMode: function () {
            return debugMode;
        },
        explode: function () {

        }
    };
})();

//TODO: remove?
var collisionCallback = function () {
    var entity1 = contact.GetFixtureA().GetBody().GetUserData();
    var entity2 = contact.GetFixtureB().GetBody().GetUserData();
    var material1 = entity1.descriptions.material;
    var material2 = entity2.descriptions.material;

    var materialImpact = Physics.getMaterialImpact(material1, material2);

    if (entity1.beginContact) {
        entity1.beginContact(entity2, materialImpact);
    }
    if (entity2.beginContact) {
        entity12.beginContact(entity1, materialImpact);
    }

    // position
    if (materialImpact.effect) {
        var effect = new VisualEffect(materialImpact.effect);
    }
};


var DAMAGE_DECR = 180;
var FORCE_RATING = 1/10;

// Creates physics explosion without any visual presentation
// just an explosion in physics world.
// center - center of the explosion;
// radiusMin, radiusMax - it`s radius <point>
// force - scalar force of impulse <number>
// damage - scalar force of damage <number>
// duration - explosion effect duration in <ms>
// decr - how fast force decreases by distance from center <number>
// owner - object that initiate explosion, should not affect it
Physics.explode = function(params) { // (center, radius, force, duration,
	// owner, decr) {
	var decr = (params.decr != null) ? params.decr : 1;
	DAMAGE_DECR = (params.damageDecr != null) ? params.damageDecr : 150;
	var world = Physics.getWorld();
	var score = 0;
	var delta = (params.delta > 0) ? params.delta : 20;
	var time = params.duration / delta;
	var scale = Physics.getB2dToGameRatio();
	function tick() {
		setTimeout(function() {
			var body = world.m_bodyList;
			for (; body != null; body = body['m_next']) {
				var bodyCenter = body.GetPosition().Copy();
				bodyCenter.Multiply(Physics.getB2dToGameRatio());
				var rVec = new b2Vec2(bodyCenter.x - params.center.x,
						bodyCenter.y - params.center.y);
				var dist = rVec.Length();
				if (dist < params.radius) {
					var impulse = rVec;
					impulse.Normalize();
					impulse.Multiply(FORCE_RATING * params.force
							/ Math.pow(1 + dist, decr));
					if (body.m_userData) {
						if (body.m_userData.params.id != "CannonBall") {
							body.SetAwake(false);
							body
									.ApplyImpulse(impulse, body
											.GetPosition());
//							body.AllowSleeping(true);
						}
					}

					if ((body.m_userData) && (body.m_userData.destructable)) {
						var damage = impulse.Length() / (DAMAGE_DECR!==0?DAMAGE_DECR:(params.damageDecr?params.damageDecr:1));
						body.m_userData.onDamage(damage);
						score += damage;
					}
				}
				;
			}
			;
			if (time < params.duration)
				tick();
			time += delta;
		}, 5);
	}
	;
	tick();
};/**
 * Contact Processor - part of the Physics singleton to
 * handle and process cantact events
 */

function ContactProcessor() {
	this.pairs = {};
	this.defaultBegin = function() {};
	this.defaultEnd = function() {};
};

//
//	Adds pair to contact events dataset 
//
ContactProcessor.prototype.addPair = function(type1, type2, event, action) {
	var that = this;
	/// New contact listener version
    if (!Physics.getContactListener())
	{
    	var contactListener = Physics.getContactListener();
    	contactListener = new Box2D.Dynamics.b2ContactListener;

	    contactListener.BeginContact = function(contact) {
	    	if (that) {
				var type1 = contact.GetFixtureA().GetBody().GetUserData().params["type"];
				var type2 = contact.GetFixtureB().GetBody().GetUserData().params["type"];
				that.processBegin(type1, type2, contact);	
	    	}
	    };
	    contactListener.EndContact = function(contact) {
	    	if (that) {
				var type1 = contact.GetFixtureA().GetBody().GetUserData().params["type"];
				var type2 = contact.GetFixtureB().GetBody().GetUserData().params["type"];
				that.processEnd(type1, type2, contact);	
	    	}
			
	    };
	    contactListener.PreSolve = function(contact, impulse) {
	    	
	    };
	    contactListener.PostSolve = function(contact, oldManifold) {
	    	
	    };
	    var world = Physics.getWorld();
	    world.SetContactListener(contactListener);
	}
	
	
	if (type1 in this.pairs) {
		if (this.pairs[type1][type2])
			this.pairs[type1][type2][event] = action;
		else {
			this.pairs[type1][type2] = {};
			this.pairs[type1][type2][event] = action;
		}
	} else if (type2 in this.pairs) {
		if (this.pairs[type2][type1])
			this.pairs[type2][type1][event] = action;
		else {
			this.pairs[type2][type1] = {};
			this.pairs[type2][type1][event] = action;
		}
	} else {
		this.pairs[type1] = {};
		this.pairs[type1][type2] = {};
		this.pairs[type1][type2][event] = action;
	}
};

ContactProcessor.prototype.setDefaultBeginContact = function(begin) {
	this.defaultBegin = begin;
};

ContactProcessor.prototype.setDefaultEndContact = function(end) {
	this.defaultEnd = end;
};

//
//	Predefined BeginContact processor
//
ContactProcessor.prototype.processBegin = function(type1, type2, contact) {
	if ((type1 in this.pairs)&&(type2 in this.pairs[type1])&&(this.pairs[type1][type2])["beginContact"])
		this.pairs[type1][type2]["beginContact"](contact); else
	if ((type2 in this.pairs)&&(type1 in this.pairs[type2])&&(this.pairs[type2][type1])["beginContact"])
		this.pairs[type2][type1]["beginContact"](contact); else
			this.defaultBegin(contact);
};

//
//	Predefined EndContact processor
//
ContactProcessor.prototype.processEnd = function(type1, type2, contact) {
	if ((type1 in this.pairs)&&(type2 in this.pairs[type1])&&(this.pairs[type1][type2]["endContact"]))
		this.pairs[type1][type2]["endContact"](contact); else
	if ((type2 in this.pairs)&&(type1 in this.pairs[type2])&&(this.pairs[type2][type1]["endContact"]))
		this.pairs[type2][type1]["endContact"](contact); else
			this.defaultEnd(contact);
};/**
 * PhysicEntity - visual entity with representation in physics world
 */

var ANIM_DELAY = 400;

/**
 * @constructor
 */
function PhysicEntity() {
    PhysicEntity.parent.constructor.call(this);
};

PhysicEntity.inheritsFrom(VisualEntity);
PhysicEntity.prototype.className = "PhysicEntity";

PhysicEntity.prototype.createInstance = function (params) {
    var entity = new PhysicEntity();
    entity.init(params);
    return entity;
};

entityFactory.addClass(PhysicEntity);

//
// Initializing and creating physic entity with visuals
//
PhysicEntity.prototype.init = function (params) {
    var description = {};
    this.physicsEnabled = true;
    
    if (DOM_MODE)
    	this.initialPosRequiered = true;
    	

    if (params.type != null)
        description = Account.instance.descriptionsData[params.type];
    PhysicEntity.parent.init.call(this, $['extend'](params, description));
    if (this.params.physics) {
        this.createPhysics();

        assert(!this.physics['m_userData']);
        this.physics['m_userData'] = this;

        this.updatePositionFromPhysics();
//TODO: check
        if (!this.physics.m_type == b2Body.b2_staticBody || Physics.debugMode())
            Physics.updateItemAdd(this);
    }
};

/**
 *  Create and register physics body
 */
PhysicEntity.prototype.createPhysics = function () {
    var fixtureDefList = [];
    var bodyDefinition;
    var physicParams = this.params['physics']; // preloaded from json
    var logicPosition = {
        x: this.params.x / Physics.getB2dToGameRatio(),
        y: this.params.y / Physics.getB2dToGameRatio()
    };

    function setShapeParams(fixtureDefinition, physicParams) {
        fixtureDefinition.density = selectValue(physicParams['density'], 1);
        fixtureDefinition.restitution = selectValue(physicParams.restitution, 1);
        fixtureDefinition.friction = selectValue(physicParams.friction, 0);
        fixtureDefinition.isSensor = selectValue(physicParams.sensor, false);
        fixtureDefinition.userData = selectValue(physicParams.userData, false);
        if (physicParams.filter != null) {
            fixtureDefinition.filter.categoryBits = selectValue(physicParams.filter.categoryBits, 0x0001);
            fixtureDefinition.filter.groupIndex = selectValue(physicParams.filter.groupIndex, 0);
            fixtureDefinition.filter.maskBits = selectValue(physicParams.filter.maskBits, 0xFFFF);
        }
    }

    bodyDefinition = new b2BodyDef();
    bodyDefinition.type = physicParams['static'] ? b2Body.b2_staticBody : b2Body.b2_dynamicBody;
    bodyDefinition.userData = null;
    // Configuring shape params depends on "type" in json
    switch (physicParams.type) {
        case "Box":
        {
            var fixDef = new b2FixtureDef();
            fixDef.shape = new b2PolygonShape;
            fixDef.shape.SetAsBox(physicParams.width / (2 * Physics.getB2dToGameRatio()), physicParams.height /
                (2 * Physics.getB2dToGameRatio()));
            setShapeParams(fixDef, physicParams);
            fixtureDefList.push(fixDef);
            break;
        }
        case "Circle":
        {
            var fixDef = new b2FixtureDef();
            fixDef.shape = new b2CircleShape(physicParams.radius / Physics.getB2dToGameRatio());
            setShapeParams(fixDef, physicParams);
            fixtureDefList.push(fixDef);
            break;
        }
        case "Poly":
        {
            // TODO: not tested
            var fixDef = new b2FixtureDef();
            fixDef.shape = new b2PolygonShape();
            // apply offset
            var vertices = cloneObject(physicParams.vertices);
            $.each(vertices, function (id, vertex) {
                vertex.x = (vertex.x + physicParams.x) / Physics.getB2dToGameRatio();
                vertex.y = (vertex.y + physicParams.y) / Physics.getB2dToGameRatio();
            });

            fixDef.shape.SetAsArray(vertices, vertices.length);
            setShapeParams(fixDef, physicParams);
            fixtureDefList.push(fixDef);
            break;
        }
        // TODO: implement Triangle etc.
        /*
         case "Triangle": {
         shapeDefinition = new b2PolyDef();
         shapeDefinition.vertexCount = 3;
         shapeDefinition.vertices = physicParams.vertices;
         bodyDefinition.AddShape(shapeDefinition);
         setShapeParams(shapeDefinition, physicParams);
         break;
         }
         case "PolyComposite": {
         $['each'](physicParams.shapes, function(id, shapeData) {

         var shapeDef = new b2PolyDef();
         shapeDef.vertexCount = shapeData.vertexCount;
         var vertices = new Array();
         $['each'](shapeData.vertices, function(idx, vertex) {
         var newVertex = {};
         newVertex.x = physicParams.scale ? vertex.x
         * physicParams.scale : vertex.x;
         newVertex.y = physicParams.scale ? vertex.y
         * physicParams.scale : vertex.y;
         vertices.push(newVertex);
         });
         shapeDef.vertices = vertices;

         setShapeParams(shapeDef, shapeData);

         bodyDefinition.AddShape(shapeDef);
         });
         break;
         }*/
        case "PrimitiveComposite":
        {
            $.each(physicParams.shapes, function (id, fixtureData) {
                var fixDef = new b2FixtureDef();
                switch (fixtureData.type) {
                    case "Box":
                    {
                        fixDef.shape = new b2PolygonShape();
                        var localPos = new b2Vec2(fixtureData.x / Physics.getB2dToGameRatio(), fixtureData.y /
                            Physics.getB2dToGameRatio());
                        fixDef.shape.SetAsOrientedBox(fixtureData.width / (2 * Physics.getB2dToGameRatio()), fixtureData.height /
                            (2 * Physics.getB2dToGameRatio()), localPos);
                        break;
                    }
                    case "Circle":
                    {
                        fixDef.shape = new b2CircleShape(fixtureData.radius / Physics.getB2dToGameRatio());
                        fixDef.shape.SetLocalPosition(new b2Vec2(fixtureData.x / Physics.getB2dToGameRatio(), fixtureData.y /
                            Physics.getB2dToGameRatio()));
                        break;
                    }
                    case "Poly":
                    {
                        fixDef.shape = new b2PolygonShape();

                        // apply offset
                        $.each(fixtureData.vertices, function (id, vertex) {
                            vertex.x = (vertex.x + fixtureData.x) / Physics.getB2dToGameRatio();
                            vertex.y = (vertex.y + fixtureData.y) / Physics.getB2dToGameRatio();
                        });

                        fixDef.shape.SetAsArray(fixtureData.vertices, fixtureData.vertices.length);
                        break;
                    }
                    case "Triangle":
                    {
                        // TODO: implement?
                        /*shapeDefinition = new b2PolyDef();
                         shapeDefinition.vertexCount = 3;
                         shapeDefinition.vertices = physicParams.vertices;
                         bodyDefinition.AddShape(shapeDefinition);
                         setShapeParams(shapeDefinition, physicParams);*/
                        break;
                    }
                }
                setShapeParams(fixDef, fixtureData);
                fixtureDefList.push(fixDef);
            });
            break;
        }
    }

    // Configuring and creating body (returning it)
    bodyDefinition.position.Set(0, 0);
    bodyDefinition.linearDamping = physicParams.linearDamping != null ? physicParams.linearDamping : 0;
    bodyDefinition.angularDamping = physicParams.angularDamping != null ? physicParams.angularDamping : 0;
    var physicWorld = Physics.getWorld();
    this.physics = physicWorld.CreateBody(bodyDefinition);
    var that = this;
    $.each(fixtureDefList, function (id, fixDef) {
        that.physics.CreateFixture(fixDef);
    });

    this.physics.SetPosition(logicPosition);
    this.destructable = physicParams["destructable"];
    if (this.destructable)
        this.health = physicParams["health"];
    else
        this.health = null;
    if (this.params.angle)
        this.rotate(this.params.angle * 2);
};

PhysicEntity.prototype.getContactedBody = function () {
    if (this.physics.m_contactList)
        return this.physics.m_contactList.other;
};

PhysicEntity.prototype.getContactList = function () {
    return this.physics.m_contactList;
};

PhysicEntity.prototype.createVisual = function () {
    PhysicEntity.parent.createVisual.call(this);
};

// Update visual position from physics world
PhysicEntity.prototype.updatePositionFromPhysics = function () {
    var that = this;

    if (that.physics == null || (DOM_MODE && !that.physics.IsAwake()))
        return;
    
    var pos = this.getPosition();
    if (!DOM_MODE || that.initialPosRequiered || !Device.isMobile() || !this.pos || Math.abs(pos.x - this.pos.x) > 1 || Math.abs(pos.y - this.pos.y) > 1) {
	    this.pos = this.getPosition();
	    that.setPosition(pos.x - that.params.physics.x - that.params.physics.width / 2, pos.y - that.params.physics.y -
	        that.params.physics.height / 2);
	}

//    if (that.params.physics.type != "Circle") {
    	var angleInDeg = that.getPhysicsRotation().toFixed(3);
    	if (!DOM_MODE || that.initialPosRequiered || !Device.isMobile() || !that.angleInDeg || Math.abs(angleInDeg - that.angleInDeg) > 0.02) {
	    	that.angleInDeg = that.getPhysicsRotation().toFixed(3);
	    	angleInDeg = MathUtils.toDeg(angleInDeg);
	        $['each'](this.visuals, function (id, visualInfo) {
	            visualInfo.visual.rotate(angleInDeg);
	        });
    	}
//    }
};

// Makes entity "kinematic" or dynamic
PhysicEntity.prototype.physicsEnable = function (v) {

    // if (!v) {
    // Physics.updateItemRemove(this);
    // } else {
    // if (!this.physics['IsStatic']() || Physics.debugMode())
    // Physics.updateItemAdd(this);
    // }
    this.physicsEnabled = !!v;
    this.physics.SetActive(this.physicsEnabled);
};

// PhysicEntity update function
//PhysicEntity.prototype.updatePhysics = function () {
//    if ((this.params.physics) && (this.physicsEnabled) && (!Physics.paused())) {
//        this.updatePositionFromPhysics();
//        //this.physics.SetCenterPosition(this.physics.GetCenterPosition(), this.physics.GetRotation());
//    }
//};

// Gets object rotation from physics (IN WHAT MEASURE? - in !Radians!)
PhysicEntity.prototype.getPhysicsRotation = function () {
    return this.physics.GetAngle();
};

/**
 *
 * @param {b2Vec2} pos logic position
 */
PhysicEntity.prototype.setPhysicsPosition = function (pos) {
    var pos = new b2Vec2(pos.x, pos.y);
    pos.Multiply(1 / Physics.getB2dToGameRatio());
    if (DOM_MODE)
    	this.physics.SetAwake(true);
    this.physics.SetPosition(pos);
    this.updatePositionFromPhysics();
    if (DOM_MODE)
    	this.physics.SetAwake(false);
};

/**
 * get logic position (using b2dToGameRatio)
 * @returns {b2Vec2}
 */
PhysicEntity.prototype.getPosition = function () {
    if (this.physics) {
        var pos = this.physics.GetPosition().Copy();
        pos.Multiply(Physics.getB2dToGameRatio());
        return pos;
    }
};

PhysicEntity.prototype.onDragBegin = function () {
    this.physicsEnable(false);
};

PhysicEntity.prototype.onDragEnd = function () {
    this.physicsEnable(true);
};

// Rotates object (as visual as physics) by local coord axis/ degrees angle
PhysicEntity.prototype.rotateByAxis = function (axis, angle) {
    // this.angle = angle;
    // Calculating rotation matrix for canon barrel and power line
    var matTrans = new Transform();
    matTrans.translate(axis.x, axis.y);
    var matRot = new Transform();

    matRot.rotateDegrees(angle);
    matTrans.multiply(matRot);
    matRot.reset();
    matRot.translate(-axis.x, -axis.y);
    matTrans.multiply(matRot);
    var that = this;
    $['each'](this.visuals, function (id, visualInfo) {
        var t = matTrans.transformPoint(that.params.x - that.params.physics.x,
                that.params.y - that.params.physics.y);
        that.physics.SetPosition(new b2Vec2(t[0], t[1]));
    });
};

// Rotates physics bodyand updates visual position
PhysicEntity.prototype.rotate = function (angleInRad) {
    var position = this.physics.GetPosition();
    var oldAngle = this.physics.GetAngle();
    var newAngle = oldAngle + angleInRad;
    if (DOM_MODE)
    	this.physics.SetAwake(true);
    this.physics.SetPositionAndAngle(position, newAngle / 2);

    this.updatePositionFromPhysics();
    if (DOM_MODE)
    	this.physics.SetAwake(false);
};

PhysicEntity.prototype.destroy = function () {
    PhysicEntity.parent.destroy.call(this);
    if (this.physics) {
        if (Physics.getWorld().IsLocked()) {
            Physics.addBodyToDestroy(this.physics);
        } else {
            Physics.getWorld().DestroyBody(this.physics);
        }
    }
    Account.instance.removeEntity(this.id, true);
};

// damage received by other object
PhysicEntity.prototype.onDamage = function (damage) {
    var that = this;
    if (!this.destructable || this.health <= 0) {
        return;
    }

    this.health -= damage;

    // damage levels - show animation of different damages levels
    if (this.params.physics.destructionLevels) {
        $['each'](that.params.physics.destructionLevels, function (id, value) {
            if (that.health <= value["minHealth"]) {
                $['each'](that.visuals, function (id, visualInfo) {
                    visualInfo.visual.playAnimation(value["animName"],
                        ANIM_DELAY, false, true);
                });
                return;
            }
        });
    }

    if (this.health <= 0) {
        $['each'](that.visuals, function (id, visualInfo) {
            if (that.params.builtInDestruction)
                visualInfo.visual.setAnimationEndCallback(function () {
                    that.destroy();
//					delete that;
                });
            else {
                that.destroy();
//				delete that;
            }
            return;
        });
    }
};

PhysicEntity.prototype.setMaterial = function (material) {
    if (typeof (material) == "string" && material != "")
        this.material = material;
};

PhysicEntity.prototype.getMaterial = function () {
    return this.material;
};
/**
 * PhysicsScene - abstract Scene class witch represents local physic world,
 * PhysicEntity`s container
 */

/**
 * @constructor
 */
function PhysicScene() {
	PhysicScene.parent.constructor.call(this);
};

PhysicScene.inheritsFrom(Scene);

PhysicScene.prototype.className = "PhysicScene";
PhysicScene.prototype.createInstance = function(params) {
	var entity = new PhysicScene();
	entity.init(params);
	return entity;
};

entityFactory.addClass(PhysicScene);

PhysicScene.prototype.init = function(params) {
	PhysicScene.parent.init.call(this, params);
	this.physicWorld = Physics.getWorld();
	if(params['physicsBorder']) {
		Physics.createWorldBorder(params['physicsBorder']);
	}
	this.contactProcessor = function(contactProcessor) {

	};
};

PhysicScene.prototype.addChild = function(child) {
	PhysicScene.parent.addChild.call(this, child);
};

PhysicScene.prototype.createVisual = function() {
	PhysicScene.parent.createVisual.call(this);
//	var that = this;

    this.setInterval(function updateWorld() {
        Physics.updateWorld();
    }, 15);
//	updateWorld();
};

PhysicScene.prototype.setBackgrounds = function(backgrounds, visual) {
	if (!visual) visual = this.getVisual();
	$['each'](backgrounds, function(key, value) {
		visual.setBackground(value.src, value.backWidth, value.backHeight,
				value.backX, value.backY, value.repeat, value.idx);
	});
	visual.resize();
};

PhysicScene.prototype.attachChildVisual = function(child) {
	PhysicScene.parent.attachChildVisual.call(this, child);
};

PhysicScene.prototype.destroy = function() {
	PhysicScene.parent.destroy.call(this);
	// $(document)['unbind'](".BattleSceneEvent");
};
/**
 * Physics Trigger
 */

CreatePhysicsTrigger = function(world, rect, action) {
	var instance = {};
	instance.rect = rect;
	instance.world = world;
	instance.action = action;

	instance.checkIfIn = function(position) {
		var ifIn = false;
		if (((position.x > instance.rect.left) && (position.x < instance.rect.right))
				&& ((position.y > instance.rect.top) && (position.y < instance.rect.bottom)))
			ifIn = true;
		return ifIn;
	};
	
	instance.move = function(x, y)
	{
		this.rect.left += x;
		this.rect.right += x;
		this.rect.top += y;
		this.rect.bottom += y;
	};
	
	instance.setPosition = function(x, y)
	{
		var w = rect.right - rect.left;
		var h = rect.bottom - rect.top;
		this.rect.left = x;
		this.rect.right = x + w;
		this.rect.top = y;
		this.rect.bottom = y + h;
	};

	instance.update = function() {
		var body = instance.world.m_bodyList;
		for (; body != null; body = body['m_next']) {
            var pos = body.GetPosition().Copy();
            pos.Multiply(Physics.getB2dToGameRatio());
			if (instance.checkIfIn(pos))
				instance.action(body);
		}
	};

	return instance;
};/**
 * Effect represents visual, sound etc effects
 */

/**
 * @constructor
 */
function Effect() {
	Effect.parent.constructor.call(this);
};

Effect.inheritsFrom(VisualEntity);
Effect.prototype.className = "Effect";

Effect.prototype.createInstance = function(params) {
	var entity = new Effect();
	entity.init(params);
	return entity;
};

entityFactory.addClass(Effect);

Effect.prototype.init = function(params) {
	var description = {};
	if (params.type != null)
		description = Account.instance.descriptionsData[params.type];
	Effect.parent.init.call(this, $.extend(params, description));
	this.guis = new Array();
};

Effect.prototype.createVisual = function() {
};

//
//	Plays an effect, and destroys it`s result data after lifetime ended
//
Effect.prototype.play = function(position, callback) {
	var that = this;
	if (position) {
		that.x = position.x;
		that.y = position.y;
	}

	$['each'](that.params.visuals, function(id, value) {
		value.parent = that.guiParent;

		var gui = guiFactory.createObject(value['class'], $['extend'](
				value, position));
		gui.clampByParentViewport();
		that.guis.push(gui);
		$['each'](gui.animations, function(id, anim) {
			gui.playAnimation(id, that.params.lifeTime, false, true);		
			that.setTimeout(function() {
				gui.hide();
				gui.remove();
				if (callback) callback();
			}, that.params.lifeTime);		
		});	
	});

//	that.setTimeout(function() {
//		that.destroy();
//	
//		if (callback) callback();
//	}, this.params.lifeTime);
};

Effect.prototype.destroy = function() {
	var that = this;
	Effect.parent.destroy.call(this);
	$['each'](that.guis, function(id, value) {
		value.remove();
		delete value;
	});
	that.guis = new Array();
};
//
var guiFactory = new AbstractFactory();

/**
 * @constructor
 */
guiFactory.createGuiFromJson = function(json, state) {
	guiFactory.createObjectsFromJson(json, function(name, params) {
		if (params['parent'] && typeof params['parent'] == "string") {
			// find parent among local objects or
			// assume that it is ID of existing DOM object
			var localParent = state.getGui(params['parent']);
			if (!localParent) {
				localParent = $(params['parent']);
				if (localParent.length == 0) {
					localParent = null;
				}
			}
			if (localParent) {
				params['parent'] = localParent;
				return;
			}
		}
		console.warn("For object '" + name + "' wrong parent '" + params['parent'] + "' is provided.");
	}, function(name, obj) {
		state.addGui(obj, name);
		if(obj.parent && obj.parent.children){
			obj.parent.children.addGui(obj, name);
		}
		obj.name = name;
	});
};
/**
 * @constructor
 */
function GuiContainer() {
	this.guiEntities = null;
}

GuiContainer.prototype.init = function() {
	this.guiEntities = new Array();
	this.guiEntitiesMap = new Object();
};
GuiContainer.prototype.resize = function() {
	for (var i = 0; i < this.guiEntities.length; i++) {
		if (this.guiEntities[i].resize) {
			this.guiEntities[i].resize();
		}
	}
};

GuiContainer.prototype.update = function(time) {
	for (var i = 0; i < this.guiEntities.length; i++) {
		if (this.guiEntities[i].update) {
			this.guiEntities[i].update(time);
		}
	}
};

GuiContainer.prototype.render = function(ctx) {
	if (ctx) {
		for (var i = 0; i < this.guiEntities.length; i++) {
			if (this.guiEntities[i].render) {
				ctx.save();
				this.guiEntities[i].render(ctx);
				ctx.restore();
			}
		}
	}
};

GuiContainer.prototype.setUpdateInterval = function(time) {
	var that = this;
	this.updateIntervalTime = time;
	this.updateIntervalHandler = setInterval(function() {
		that.update(that.updateIntervalTime);
	}, this.updateIntervalTime);
};

GuiContainer.prototype.resetUpdateInterval = function() {
	if (this.updateIntervalHandler) {
		clearInterval(this.updateIntervalHandler);
		this.updateIntervalHandler = null;
		this.updateIntervalTime = null;
	}
};

GuiContainer.prototype.clear = function() {
	// console.log("Clear GuiContainer, there is %d entities",
	// this.guiEntities.length);
	for (var i = 0; i < this.guiEntities.length; i++) {
		if (this.guiEntities[i].remove) {
			// console.log("Remove entity %s", this.guiEntities[i].src);
			this.guiEntities[i].remove();
		}
	}
	popAllElementsFromArray(this.guiEntities);
	this.guiEntitiesMap = {};
};

GuiContainer.prototype.remove = function() {
	this.clear();
	this.resetUpdateInterval();
};

GuiContainer.prototype.addGui = function(entity, name) {
	assert(entity, "Trying to add null pointer!");
	this.guiEntities.push(entity);

	if (typeof (name) == "string") {
		entity.name = name;
		this.guiEntitiesMap[name] = entity;
	}
};

GuiContainer.prototype.removeGui = function(entity) {
	popElementFromArray(entity, this.guiEntities);
	if (this.guiEntitiesMap[entity.name]) {
		delete this.guiEntitiesMap[entity.name];
	}
	entity.remove();
};

GuiContainer.prototype.getGui = function(name) {
	return this.guiEntitiesMap[name];
};
/**
 * @constructor
 */
function GuiElement() {
}

GuiElement.prototype.className = "GuiElement";

GuiElement.prototype.createInstance = function(params) {
	var entity = new GuiElement();
	entity.initialize(params);
	return entity;
};

guiFactory.addClass(GuiElement);

GuiElement.prototype.generateId = function() {
	return this.className + uniqueId();
};

GuiElement.prototype.generate = function(src) {
	assert(this.id, "Id not defined");
	assert(this.style, "Class for object with id = '" + this.id
			+ "' is not defined");
	return "<div id=\"" + this.id + "\" class=\"" + this.style
			+ " unselectable\">" + src + "</div>";
};

GuiElement.prototype.create = function(src) {
	// initial parent set

//	 console.log("Creating item with id %s, src = %s and classname = %s",
//	 this.id, src, this.className);
	if (!this.setParent(this.parent)) {
		// if no parent provided assigning to the body object
		this.setParent($("body"));
		console.warn("No parent was provided for object id = " + this.id);
	}

	src = (src == null) ? "" : src;
	var generated = this.generate(src);
	if(this.id == "GuiDiv1990"){
		console.log("Generated source for element: ", generated);
	}
	
	this.parent.jObject.append(generated);

	// remember jQuery object
	this.jObject = $("#" + this.id);
	assert(this.jObject.length > 0, "Object id ='" + this.id
			+ "' was not properly created");
};

GuiElement.prototype.$ = function() {
	return this.jObject;
};

GuiElement.prototype.setEnable = function(isEnable) {
	this.enable = isEnable;
};

GuiElement.prototype.isEnabled = function() {
	return this.enable == true;
};

GuiElement.prototype.callBindedFunction = function(event, bindType) {
	if (this.isEnabled()) {
		this[bindType](event);
	} else {
		console.log("Button is not enabled " + this.id);
	}
};

GuiElement.prototype.bind = function(bindFunction, bindType) {
	bindType = (typeof (bindType) == "string") ? bindType : "click";
	if (bindFunction) {
		this[bindType] = bindFunction;
	}
	if (!this[bindType]) {
		return;
	}

	this.unbind(bindType);

	var that = this;
	var callbackCaller = function(event) {
		that.callBindedFunction(event, bindType);
	};

	this.jObject['bind'](Device.event(bindType) + ".guiElementEvents",
			callbackCaller);
};

GuiElement.prototype.unbind = function(callbackType) {
	callbackType = (typeof (callbackType) == "string") ? callbackType : "";
	this.jObject['unbind'](callbackType + ".guiElementEvents");
};

GuiElement.prototype.init = function() {
	this.children.init();

	this.create(this.src);
	if (this.pushFunction) {
		this.bind(this.pushFunction);
	}

	this.resize();
};

GuiElement.prototype.initialize = function(params) {
	this.params = params;

	this.parent = params['parent'];

	// generate ID
	this.id = this.generateId();
	// Check whether element with such id is already in scene
	if ($("#" + this.id).length > 0) {
		console.error(" GuiElement with  id = '" + this.id
				+ "' is already exists.");
	}

	this.style = params['style'];
	this.width = params['width'];
	this.height = params['height'];
	// preventing clicking on the item to appear
	this.enable = true;
	this.children = new GuiContainer();
	this.children.init();

	this.src = params['html'] ? params['html'] : this.src;
	if (params['jObject']) {
		this.jObject = params['jObject'];

		// if (this.jObject[0] !== $('body')[0]) {
		// this.parent = guiFactory.createObject("GuiElement", {
		// "jObject" : this.jObject.parent()
		// });
		// }

	} else {
		this.create(this.src);
	}

	// attach 'this' as data to the element, so we can reference to it by
	// element id
	this.jObject['data']("guiElement", this);

	if (this.pushFunction) {
		this.bind(this.pushFunction);
	}

	var that = this;
	if (params['animations']) {
		$['each'](params['animations'], function(name, value) {
			that.addJqueryAnimation(name, value);
		});
	}

	this.setOffset(Screen.macro(params['offsetX']), Screen
			.macro(params['offsetY']));
	this.setPosition(Screen.macro(params['x']), Screen.macro(params['y']));
	this.setSize(Screen.macro(params['width']), Screen.macro(params['height']));
	if (typeof params['z'] == "number") {
		this.setZ(params['z']);
	}

	if (params['hide']) {
		this.hide();
	} else {
		this.show();
	}

	if (typeof params['opacity'] == "number") {
		this.setOpacity(params['opacity']);
	}

	this.resize();
};

GuiElement.prototype.setOffset = function(offsetX, offsetY) {
	this.offsetX = offsetX;
	this.offsetY = offsetY;
};

GuiElement.prototype.calcPercentageWidth = function(val) {
	if (typeof (val) == "string" && val.indexOf("%") > -1) {
		var parentWidth = this.parent.jObject.width() / Screen.widthRatio();
		assert(typeof (parentWidth) == "number",
				"Wrong parent or value for % param name='" + this.name + "'");
		val = (parseFloat(val.replace("%", "")) * parentWidth / 100.0);
	}
	return val;
};

GuiElement.prototype.calcPercentageHeight = function(val) {
	if (typeof (val) == "string" && val.indexOf("%") > -1) {
		var parentHeight = this.parent.jObject.height() / Screen.heightRatio();
		assert(typeof (parentHeight) == "number",
				"Wrong parent or value for % param name='" + this.name + "'");
		val = (parseFloat(val.replace("%", "")) * parentHeight / 100.0);
	}
	return val;
};

GuiElement.prototype.setPosition = function(x, y) {
	this.x = x;
	this.y = y;

	var offsetX = 0, offsetY = 0;
	if (typeof (this.offsetX) == "number") {
		offsetX = this.offsetX;
	}

	if (this.offsetY != null) {
		offsetY = this.offsetY;
	}

	x = this.calcPercentageWidth(x);
	y = this.calcPercentageHeight(y);

	this.setRealPosition(x + offsetX, y + offsetY);
};

GuiElement.prototype.move = function(dx, dy) {
	this.x += dx;
	this.y += dy;
	this.setPosition(this.x, this.y);
};

GuiElement.prototype.getRealPosition = function() {
	return {
		x : this.jObject['css']("left").replace("px", ""),
		y : this.jObject['css']("top").replace("px", "")
	};
};

GuiElement.prototype.getPosition = function() {
	return {
		x : this.x,
		y : this.y
	};
};

GuiElement.prototype.setZ = function(z) {
	this.jObject['css']("z-index", z);
	this.jObject['css']("-webkit-transform", "translateZ(0)");
	this.z = z;
};

GuiElement.prototype.show = function() {
	this.jObject['show']();
	this.visible = true;
};

GuiElement.prototype.hide = function() {
	this.jObject['hide']();
	this.visible = false;
};

GuiElement.prototype.setOpacity = function(opacity) {
	this.jObject['css']("opacity", opacity);
};

GuiElement.prototype.isEventIn = function(e) {
	var pos = Device.getPositionFromEvent(e);

	var left = this.$()['offset']()['left'];
	var right = left + this.$()['width']();
	var top = this.$()['offset']()['top'];
	var bottom = top + this.$()['height']();
	var isIn = (pos.x > left) && (pos.x < right) && (pos.y > top)
			&& (pos.y < bottom);

	return isIn;
};

GuiElement.prototype.addJqueryAnimation = function(name, description) {
	this.jqueryAnimations = this.jqueryAnimations ? this.jqueryAnimations
			: new Object();
	this.jqueryAnimations[name] = description;
};

GuiElement.prototype.playJqueryAnimation = function(name, callback) {
	var desc = this.jqueryAnimations[name];
	assert(desc, "No animation found with name '" + name + "'");

	this.stopJqueryAnimation();
	var finalAnimationState = null;

	var that = this;

	var updateDisplay = function(that, action) {
		that.setPosition(action["x"] || that.x, action["y"] || that.y);
		if (action["display"]) {
			if (action["display"] === "hide") {
				that.hide();
			} else if (action["display"] === "show") {
				that.show();
			}
		}
		// that.setSize(action["width"] || that.width, action["height"]
		// || that.height);
	};

	for ( var i = 0; i < desc.length; i++) {
		var actionDesc = desc[i];
		var action;
		if (action = actionDesc["animate"]) {
			var anim = new Object();
			$['each'](action["actions"], function(idx, params) {
				var param01 = params[0];
				var param02 = params[1];
				var param03 = params[2];

				if (param01 == "left" || param01 == "width") {
					param03 = (typeof (param03) == "number") ? Math
							.round(param03 * Screen.widthRatio()) : param03;
				} else if (param01 == "top" || param01 == "height") {
					param03 = (typeof (param03) == "number") ? Math
							.round(param03 * Screen.heightRatio()) : param03;
				}
				anim[param01] = param02 + param03.toString();
			});

			that.$()['animate'](anim, action["time"]);

		} else if (action = actionDesc["start"]) {
			var x = action["x"] != null ? action["x"] : that.x;
			var y = action["y"] != null ? action["y"] : that.y;
			that.setPosition(x, y);
			updateDisplay(that, action);
		} else if (action = actionDesc["final"]) {
			// force final params after all animations since
			// resize will call reset animation sequence or there's
			// can be option with animations disabled
			finalAnimationState = function() {
				var x = action["x"] != null ? action["x"] : that.x;
				var y = action["y"] != null ? action["y"] : that.y;
				that.setPosition(x, y);
				updateDisplay(that, action);
			};
		}
	}

	this.jqueryAnimationCallback = function() {
		if (finalAnimationState)
			finalAnimationState();
		if (callback)
			callback();
	};

	this.$()['queue']("fx", function() {
		that.jqueryAnimationCallback();
		that.jqueryAnimationCallback = null;
		that.jObject['stop'](true);
	});
};

GuiElement.prototype.stopJqueryAnimation = function() {
	if (!this.$()['is'](':animated')) {
		return;
	}
	this.$()['stop'](true);
	if (this.jqueryAnimationCallback) {
		this.jqueryAnimationCallback();
		this.jqueryAnimationCallback = null;
	}
};

GuiElement.prototype.isVisible = function() {
	return this.visible;
};

GuiElement.prototype.setSize = function(width, height) {
	this.width = width;
	this.height = height;

	this.resize();
};

GuiElement.prototype.setRealSize = function(width, height) {
	var size = Screen.calcRealSize(width, height);
	this.jObject['css']("width", size.x);
	this.jObject['css']("height", size.y);
};

GuiElement.prototype.setRealPosition = function(x, y) {
	var pos = Screen.calcRealSize(x, y);
	this.jObject['css']("left", pos.x);
	this.jObject['css']("top", pos.y);
};

GuiElement.prototype.resize = function() {
	var w = this.calcPercentageWidth(this.width);
	var h = this.calcPercentageHeight(this.height);
	this.setRealSize(w, h);
	this.setPosition(this.x, this.y);

	this.children.resize();
};

// prevents resizing of element
GuiElement.prototype.disableResize = function(isTrue) {
	if (this.originalResize == null) {
		this.originalResize = this.resize;
	}
	if (isTrue == false) {
		this.resize = this.originalResize;
	} else {
		this.resize = function() {
		};
	}
};

GuiElement.prototype.change = function(src) {
	this.src = src;
	this.detach();
	this.create(src);
	if (this.pushFunction) {
		this['bind'](this.pushFunction);
	}
	this.resize();
	this.show();
};

GuiElement.prototype.globalOffset = function() {
	var pos = this.jObject.offset();
	pos = Screen.calcLogicSize(pos.left, pos.top);

	return {
		x : pos.x,
		y : pos.y
	};
};

GuiElement.prototype.setParent = function(newParent, saveGlobalPosition) {
	// 'newParent' can be either string ID, JQuery object,
	// or object inherited of GuiElement
	var parent = null;
	var jParent = null;
	if (typeof newParent == "string") {
		jParent = $(newParent);
	} else if (newParent && typeof newParent == "object") {
		if (newParent['jquery']) {
			jParent = newParent;
		} else if (newParent.jObject && newParent.jObject.length > 0) {
			parent = newParent;
		}
	}
	// parent been represented as JQuery object
	if (jParent) {
		assert(jParent.length > 0, "Object id ='" + this.id
				+ "' has wrong parent: '" + newParent + "'");

		// check whether our parent already has GuiElement representation
		parent = jParent['data']("guiElement");
		if (!parent) {
			parent = guiFactory.createObject("GuiElement", {
				"jObject" : jParent
			});
		}
	}

	if (parent) {
		var oldParent = this.parent;
		this.parent = parent;

		// recalculate entity x,y so it will
		// stay at the same place on the screen after the parent change
		if (oldParent && saveGlobalPosition) {
			var oldParentPos, newParentPos;

			oldParentPos = oldParent.globalOffset();
			newParentPos = parent.globalOffset();

			var left = oldParentPos.x - newParentPos.x;
			var top = oldParentPos.y - newParentPos.y;
			this.move(left, top);
		}

		if (this.jObject) {
			this.jObject['appendTo'](parent.jObject);
		}
		return true;
	} else {
		console.error("Can't attach object '" + this.id
				+ "' to parent that doesn't exists '" + newParent + "'");
		return false;
	}
};

GuiElement.prototype.remove = function() {

	// console.log("Removing item with id %s, classname = %s", this.id,
	// this.className);
	if(this.tooltip){
		this.tooltip.remove();
	}
	this.children.remove();
	this.jObject['remove']();
};

GuiElement.prototype.detach = function() {
	this.jObject['detach']();
};

GuiElement.prototype.addGui = function(entity, name) {
	this.children.addGui(entity, name);
};
GuiElement.prototype.removeGui = function(entity) {
	this.children.removeGui(entity);
};
GuiElement.prototype.getGui = function(name) {
	return this.children.getGui(name);
};

GuiElement.prototype.center = function() {
	this.jObject['css']("text-align", "center");
	// obj.wrap("<div class='middle'/>");
	// obj.wrap("<div class='inner'/>");
};

GuiElement.prototype.fadeTo = function(fadeValue, time, callback,
		dontChangeVisibility) {
	var that = this;
	if (this.fadeToTimeout) {
		clearTimeout(this.fadeToTimeout);
		this.fadeToTimeout = null;
	}

	if (!this.visible && !dontChangeVisibility) {
		// .hack for iOs devices we need a tiny delay
		// to avoid blinking

		// TODO setTimeout move to GuiElement class or create a GuiBase class
		this.fadeToTimeout = setTimeout(function() {
			that.show();
		}, 1);
	}
	// console.log("ANIMATION!!FUCK IF DEFINED",
	// CSSAnimations.get("fadeTo"+this.id));
	// var fadeTo = CSSAnimations.create("fadeTo"+this.id);
	// console.log("START OPACIY", this.jObject['css']("opacity"));
	// fadeTo.setKeyframe('0%', {
	// "opacity" : "" + this.jObject['css']("opacity")
	// });
	// fadeTo.setKeyframe('100%', {
	// "opacity" : "" + fadeValue
	// });
	// var obj = document.getElementById(this.id);
	// console.log(obj);
	// obj.style.webkitAnimationName = fadeTo.name;
	// obj.style.webkitAnimationDuration = (time / 1000) + "s";
	//
	// // obj.style.animationName=this.anim.fadeTo.name;
	// // obj.style.animationDuration=(time/1000)+"s";
	//
	// obj.addEventListener('webkitAnimationEnd', function() {
	// CSSAnimations.remove(fadeTo.name);
	// if(!CSSAnimations.get("fadeTo"+that.id)){
	// console.log("DELETED!!!!", "fadeTo"+that.id, fadeTo.name);
	// }else{
	// console.log("DSGLSDHGSDHGLDSGHLDSGHSDKJGNOTDELETED!!!!",
	// "fadeTo"+that.id, fadeTo.name);
	// }
	// if(callback){
	// callback();
	// }
	// });
	this.jObject['animate']({
		opacity : fadeValue
	}, time, callback);
};

GuiElement.prototype.blinking = function(isOn, blinkTime, blinkMin, blinkMax) {

	if (isOn) {
		var fadeTime = blinkTime ? blinkTime : 1000;

		var fadeIn, fadeOut;
		var that = this;
		fadeIn = function() {
			that.jObject['animate']({
				opacity : (blinkMin ? blinkMin : 0)
			}, fadeTime, fadeOut);
		};
		fadeOut = function() {
			that.jObject['animate']({
				opacity : (blinkMax ? blinkMax : 1)
			}, fadeTime, fadeIn);
		};
		fadeIn();
	} else {
		this.jObject['stop']();
	}
};

GuiElement.prototype.right = function() {
	this.jObject['css']("text-align", "right");
};

GuiElement.prototype.left = function() {
	this.jObject['css']("text-align", "left");
};

GuiElement.prototype.setClickTransparent = function(isTrue) {
	// TODO add IE and Opera support
	if (isTrue) {
		// this.jObject.bind("mousemove mousedown mouseup", function(e){
		// $(this).next().trigger(e);
		// });

		this.jObject['css']("pointer-events", "none");

	} else {
		this.jObject['css']("pointer-events", "auto");

	}
};

GuiElement.prototype.enableTouchEvents = function(push) {
	if (Device.isTouch()) {
		document.body.ontouchstart = function(e) {
			e.preventDefault();
			// if (levelStarted) {
			touchStartX = touchEndX = e.touches[0].pageX;
			touchStartY = touchEndY = e.touches[0].pageY;
			// } else {
			// touchStartX = touchEndX = null;
			// touchStartY = touchEndY = null;
			// }
			return false;
		};

		document.body.ontouchmove = function(e) {
			e.preventDefault();
			// if (levelStarted) {
			touchEndX = e.touches[0].pageX;
			touchEndY = e.touches[0].pageY;
			// }
			return false;
		};

		document.body.ontouchend = function(e) {
			e.preventDefault();
			if (touchEndX && touchEndY) {
				var e1 = {};
				e1.pageX = touchEndX;
				e1.pageY = touchEndY;
				push(e1);
			}
			return false;
		};
	} else {
		this.jObject['bind']("mousedown", push);
	}
};

// checks whether (x, y) in real global coords is inside element's bounds
GuiElement.prototype.isPointInsideReal = function(x, y) {
	var pos = this.jObject.offset();
	var width = this.jObject.width();
	var height = this.jObject.height();
	if ((x > pos.left && x < (pos.left + width))
			&& (y > pos.top && y < (pos.top + height))) {
		return true;
	} else {
		return false;
	}
};

GuiElement.prototype.getEventPosition = function(e) {
	var pos = Device.getPositionFromEvent(e);
	var elementPos = this.jObject['offset']();
	var needed = {};
	needed.x = pos.x - elementPos.left;
	needed.y = pos.y - elementPos.top;
	var result = Screen.calcLogicSize(needed.x, needed.y);
	return result;
};
/**
 * viewport and dragn drop functions 
 */

VIEWPORT_KILLER = false;

/**
 * @constructor
 */
function GuiDiv() {
	GuiDiv.parent.constructor.call(this);
}

GuiDiv.inheritsFrom(GuiElement);
GuiDiv.prototype.className = "GuiDiv";

GuiDiv.prototype.createInstance = function(params) {
	var entity = new GuiDiv();
	entity.initialize(params);
	return entity;
};

guiFactory.addClass(GuiDiv);

GuiDiv.prototype.initialize = function(params) {
	this.divname = params['divname'];
	this.backgrounds = new Array();
	if (VIEWPORT_KILLER) this.disableViewport();
	// short alias for background
	if (params['image']) {
		params['background'] = {
			image : params['image']
		};
	}
	this.remote = params['remote'];
	/*
	 * if(params['background']instanceof Array){ for(var i = 0;i <
	 * params['background'].length;i++) {
	 * this.backgrounds.push(params['background'][i]); } }
	 */
	// ref to rect clamped by viewport
	this.viewRect = {};

	// DIV will be used as enhanced background to cover as much available
	// space on the screen as possible
	if (params['enhancedScene']) {
		params['width'] = params['width'] ? params['width']
				: ENHANCED_BASE_WIDTH;
		params['height'] = params['height'] ? params['height']
				: ENHANCED_BASE_HEIGHT;
		params['x'] = params['x'] ? params['x'] : -ENHANCED_BASE_MARGIN_WIDTH;
		params['y'] = params['y'] ? params['y'] : -ENHANCED_BASE_MARGIN_HEIGHT;
		this.enhancedScene = true;
		// enhancedScene is clamped by the maximum allowed screen size
		this.setViewport(Screen.fullRect());
	} else if (params['innerScene']) {
		// main scene is located on normal position inside enhanced scene
		params['width'] = params['width'] ? params['width'] : BASE_WIDTH;
		params['height'] = params['height'] ? params['height'] : BASE_HEIGHT;
		params['x'] = params['x'] ? params['x'] : ENHANCED_BASE_MARGIN_WIDTH;
		params['y'] = params['y'] ? params['y'] : ENHANCED_BASE_MARGIN_HEIGHT;
		this.innerScene = true;
	}
	GuiDiv.parent.initialize.call(this, params);
	this.applyBackground(params['background']);

	if (params['enhancedScene']) {
		this.resize();
	}

	assert(!this.innerScene || this.parent.enhancedScene,
			"inner scene should always be child to enhanced scene");

	if (this.innerScene) {
		this.clampByParentViewport();
	}
	
	if (params['canvas']) {
		var cParams = params['canvas'];
		$['extend'](cParams, {
			"parent" : this
		});

		cParams["width"] = params['canvas'].width?params['canvas'].width:this.width;
		cParams["height"] = params['canvas'].height?params['canvas'].height:this.height;
		cParams["x"] = params['canvas'].x?params['canvas'].x:this.x;
		cParams["y"] = params['canvas'].y?params['canvas'].y:this.y;
		cParams["offsetX"] = params['canvas'].offsetX?params['canvas'].offsetX:this.offsetX;
		cParams["offsetY"] = params['canvas'].offsetY?params['canvas'].offsetY:this.offsetY;
		
		this.canvas = guiFactory.createObject("GuiCanvas", cParams);
	}
};

GuiDiv.prototype.generate = function(src) {
	return "<div id=\"" + this.id + "\" class=\"" + this.style
	+ " unselectable\""+((this.divname)?("name=\""+ this.divname +"\""):("")) +"></div>";
};

GuiDiv.prototype.empty = function() {
	this.jObject['empty']();
};

GuiDiv.prototype.applyBackground = function(params) {
	if (params instanceof Array) {
		var j = params.length - 1;
		for ( var i = 0; i < params.length; i++) {
			params[i]['image'] = Resources.getImage(params[i]['image']);
			this.setBackgroundFromParams(params[i], j--);
		}
	} else if (params) {
		params['image'] = this.remote?params['image']:Resources.getImage(params['image']);
		this.setBackgroundFromParams(params, null);
	}
};

GuiDiv.prototype.setBackground = function(src, backWidth, backHeight, backX, backY, repeat, frameX, frameY, idx) {
    if (idx == "begin") {
        this.backgrounds.unshift({});
        idx = 0;
    } else if (idx == "end") {
        idx = this.backgrounds.length;
    }

    idx = idx ? idx : 0;
    frameX = frameX ? frameX : (this.backgrounds[idx] && this.backgrounds[idx].frameX ? this.backgrounds[idx].frameX : 0);
    frameY = frameY ? frameY : (this.backgrounds[idx] && this.backgrounds[idx].frameY ? this.backgrounds[idx].frameY : 0);
    backWidth = backWidth ? backWidth : (this.backgrounds[idx] && this.backgrounds[idx].width ? this.backgrounds[idx].width : this.width);
    backHeight = backHeight ? backHeight : (this.backgrounds[idx] && this.backgrounds[idx].height ? this.backgrounds[idx].height : this.height);

    this.backgrounds[idx] = {
        url : src,
        width : backWidth,
        height : backHeight,
        left : backX ? backX : 0,
        top : backY ? backY : 0,
        frameX : frameX,
        frameY : frameY,
        repeat : (repeat ? repeat : "no-repeat")
    };

    this.showBackground();
//	this.resizeBackground();
};

GuiDiv.prototype.setBackgroundFromParams = function(param, j) {
	var x = param['x'] ? Screen.macro(param['x']) : 0;
	var y = param['y'] ? Screen.macro(param['y']) : 0;
	var w = param['width'] ? Screen.macro(param['width']) : this.width;
	var h = param['height'] ? Screen.macro(param['height']) : this.height;
    var frameX = param['frameX'] ? Screen.macro(param['frameX']) : 0;
    var frameY = param['frameY'] ? Screen.macro(param['frameY']) : 0;
	var r = param['repeat'] ? param['repeat'] : null;
	this.setBackground(param['image'], w, h, x, y, r, frameX, frameY, j);
};
GuiDiv.prototype.setBackgroundPosition = function(backX, backY, idx) {
	idx = idx ? idx : 0;

	var backgroundX = backX ? backX : 0;
	var backgroundY = backY ? backY : 0;
	this.backgrounds[idx].left = backgroundX;
	this.backgrounds[idx].top = backgroundY;

	this.setRealBackgroundPosition(0, 0);
};

GuiDiv.prototype.setRealBackgroundPosition = function(offsetX, offsetY) {
	var positions = " ";
	$['each'](this.backgrounds, function(i, back) {
		if (!back)
			return;
		var pos = Screen.calcRealSize(back.left + offsetX, back.top + offsetY);
		positions += pos.x + "px " + pos.y + "px,";
	});
	positions = positions.substr(0, positions.length - 1);
	this.jObject['css']("background-position", positions);
};

GuiDiv.prototype.resizeBackground = function() {
    var positions = " ";
    var sizes = " ";
    var that = this;
    $['each'](this.backgrounds, function(i, back) {
        if (!back)
            return;
        var pos = Screen.calcRealSize(back.left + back.frameX, back.top + back.frameY);
        positions += pos.x + "px " + pos.y + "px,";

        var w = that.calcPercentageWidth(back.width);
        var h = that.calcPercentageHeight(back.height);
        var size = Screen.calcRealSize(w, h);
        sizes += size.x + "px " + size.y + "px,";
    });
    sizes = sizes.substr(0, sizes.length - 1);
    positions = positions.substr(0, positions.length - 1);
    this.jObject['css']("background-size", sizes);
    this.jObject['css']("background-position", positions);
};

GuiDiv.prototype.setPosition = function(x, y) {
	GuiDiv.parent.setPosition.call(this, x, y);
	if (this.viewport) {
		this.clampByViewport();
	}
};

GuiDiv.prototype.resize = function() {
	// if this DIV is inner scene than adjust our position
	// by parent - enhancedScene
	// if (this.innerScene) {
	// var parent = this.parent;
	// this.setPosition(parent.viewRect.left, parent.viewRect.top);
	//
	// // innerScene by default is always visible, so it's
	// // clamped only by enhanced scene
	// this.viewRect.left = -parent.viewRect.left;
	// this.viewRect.top = -parent.viewRect.top;
	// this.viewRect.right = this.viewRect.left + parent.viewRect.width;
	// this.viewRect.bottom = this.viewRect.top + parent.viewRect.height;
	// this.viewRect.width = parent.viewRect.width;
	// this.viewRect.height = parent.viewRect.height;
	// }

	GuiDiv.parent.resize.call(this);

	this.resizeBackground();
	// TODO make optimization, currently setting size and pos twice
	// Consider removing this from GuiDiv
	if (this.viewport) {
		this.clampByViewport();
	}
	
	if (this.canvas) {
		this.canvas.resize(this.width, this.height);
	}
};

GuiDiv.prototype.dragBegin = function(e) {
	if (this.dragStarted)
		return;

	DragManager.setItem(this, e);

	this.dragStarted = true;
	var pos = Device.getPositionFromEvent(e);
	this.dragX = pos.x;
	this.dragY = pos.y;
	if (this.onDragBegin)
		this.onDragBegin();
	this.$()['addClass']("dragged");

	// console.log("dragBegin");
};

GuiDiv.prototype.dragMove = function(e) {
	if (this.dragStarted) {
		var pos = Device.getPositionFromEvent(e);
		var dX = pos.x - this.dragX;
		var dY = pos.y - this.dragY;
		this.move(dX / Screen.widthRatio(), dY / Screen.heightRatio());
		this.dragX = pos.x;
		this.dragY = pos.y;
		// console.log("dragMove real " + this.id + ", " + this.x + ", " +
		// this.y);
	} else {
		// console.log("dragMove not real");
	}

};

GuiDiv.prototype.dragEnd = function(dragListener) {
	if (!this.dragStarted)
		return;

	// .hack seem like webkit bug, touchmove event will be halted
	// once we remove item form scene. So we remove button
	// only after drag n drop complete, thus onBeforeDragEnd callback
	if (this.onBeforeDragEnd)
		this.onBeforeDragEnd(dragListener);

	if (this.onDragEnd)
		this.onDragEnd(dragListener);
	this.$()['removeClass']("dragged");
	this.dragStarted = false;

	// console.log("dragEnd");
};

GuiDiv.prototype.setDragable = function(isTrue) {
	this.dragable = isTrue;
	if (isTrue) {
		var that = this;
		this.$().bind(Device.event("cursorDown") + ".dragEvents", function(e) {
			that.dragBegin(e);
		});
	} else {
		this.$()['unbind'](".dragEvents");
	}
};

// Setups Div as reciver for drag items
// callbacks to override: onDragItemEnter, onDragItemOut, onDragItemDrop
GuiDiv.prototype.setDragListener = function(isTrue, priority) {
	this.dragSlot = isTrue;
	if (isTrue) {
		if (priority) {
			this.dragListenerPriority = priority;
		}
		DragManager.addListener(this);
	} else {
		DragManager.removeListener(this);
		this.$()['unbind'](".dragEvents");
	}
};

GuiDiv.prototype.hideBackground = function() {
	this.jObject['css']("background-image", "none");
};

GuiDiv.prototype.showBackground = function() {
	var urls = " ";
	var repeats = " ";
	var positions = " ";

	$['each'](this.backgrounds, function(i, back) {
		if (!back)
			return;
		if (back.url) urls += "url('" + back.url + "'),";

        // TODO: test it
        if (back.frameX && back.frameY) {
            var pos = Screen.calcRealSize(back.frameX, back.frameY);
            positions += pos.x + "px " + pos.y + "px,";
        }

		repeats += back.repeat + ",";
	});

	urls = urls.substr(0, urls.length - 1);
	repeats = repeats.substr(0, repeats.length - 1);
    positions = positions.substr(0, positions.length - 1);
	this.jObject['css']("background-image", urls);
	this.jObject['css']("background-position", positions);
	this.jObject['css']("background-repeat", repeats);
};

GuiDiv.prototype.clampByParentViewport = function(isTrue) {
	if (isTrue == false) {
		this.setViewport(null, null);
		this.resize();
	} else {
		this.setViewport(this.parent.viewRect, true);
	}
};

GuiDiv.prototype.setViewport = function(rect, isParent) {
	if(Screen.fixedSize || this.viewportDisable){
		this.viewport = null;
		return;
	}
	this.viewport = rect;
	this.isParentsViewport = isParent;

	if (this.jObject && this.viewport) {
		this.clampByViewport();
	}
};

GuiDiv.prototype.disableViewport = function(){
	this.viewportDisable = true;
	this.viewport = null;
};

GuiDiv.prototype.globalOffset = function() {
	var pos = this.jObject.offset();
	pos = Screen.calcLogicSize(pos.left, pos.top);

	var viewLeft = (this.viewRect && this.viewRect.left) ? this.viewRect.left
			: 0;
	var viewTop = (this.viewRect && this.viewRect.top) ? this.viewRect.top : 0;

	return {
		x : pos.x - viewLeft,
		y : pos.y - viewTop
	};
};

GuiDiv.prototype.clampByViewport = function() {
	if (!this.isVisible()) {
		return;
	}

	// 1) write down our rect
	var offsetX = this.offsetX ? this.offsetX : 0;
	var offsetY = this.offsetY ? this.offsetY : 0;
	var x = this.calcPercentageWidth(this.x) + offsetX;
	var y = this.calcPercentageHeight(this.y) + offsetY;
	var originalRect = {
		left : x,
		top : y,
		right : x + this.width,
		bottom : y + this.height
	};

	// 2) find out intersection rect between our rect and
	// parent rect - it will be new visibile rect for our div.
	// Rect will be in parent's coordinates
	var rect = this.viewport;
	var left = Math.max(originalRect.left, rect.left);
	var top = Math.max(originalRect.top, rect.top);
	var right = Math.min(originalRect.right, rect.right);
	var bottom = Math.min(originalRect.bottom, rect.bottom);

	var w = right - left;
	var h = bottom - top;

	// item is completely outside viewport, hide it
	if (w < 0 || h < 0) {
		if (!this.viewRect.isOutside) {
			this.jObject['hide']();
			this.viewRect.isOutside = true;
		}
	} else {
		if (this.viewRect.isOutside) {
			this.viewRect.isOutside = false;
			if (this.isVisible()) {
				this.jObject['show']();
			}
		}
	}

	var screenLeft = left;
	var screenTop = top;

	if (this.isParentsViewport) {
		screenLeft -= Math.max(rect.left, 0);
		screenTop -= Math.max(rect.top, 0);
	}
	this.setRealPosition(screenLeft, screenTop);
	this.setRealSize(w, h);

	// 3) calculate offset
	var offsetX = originalRect.left - left;
	var offsetY = originalRect.top - top;
	this.setRealBackgroundPosition(offsetX, offsetY);

	// calculate viewport for this Div for childrens to use
	if (this.innerScene) {
		// ignore boundaries of innerScene
		this.viewRect.left = rect.left - x;
		this.viewRect.top = rect.top - y;
		this.viewRect.right = rect.right - x;
		this.viewRect.bottom = rect.bottom - y;
		this.viewRect.width = rect.width;
		this.viewRect.height = rect.height;
		return;
	} else {
		this.viewRect.left = left - x;
		this.viewRect.top = top - y;
	}
	this.viewRect.right = this.viewRect.left + w;
	this.viewRect.bottom = this.viewRect.top + h;
	this.viewRect.width = w;
	this.viewRect.height = h;
	this.viewRect.offsetX = screenLeft;
	this.viewRect.offsetY = screenTop;

	var name = this.id;
	if (this.enhancedScene) {
		name += " Enhanced";
	} else if (this.innerScene) {
		name += " Inner";
	}

	// console.log(name + " " + "screen " + Math.round(screenLeft) + ", "
	// + Math.round(screenTop) + " originalRect "
	// + Math.round(originalRect.left) + ", "
	// + Math.round(originalRect.top) + " rect " + Math.round(rect.left)
	// + ", " + Math.round(rect.top) + " offset "
	// + Math.round(this.viewRect.left) + ", "
	// + Math.round(this.viewRect.top));

};


// Only perform show/hide check
GuiDiv.prototype.clampByViewportSimple = function() {

	// console.log("clamped");
	if (!this.isVisible()) {
		return;
	}
	var rect = this.viewport;

	// 1) write down our rect
	var offsetX = this.offsetX ? this.offsetX : 0;
	var offsetY = this.offsetY ? this.offsetY : 0;
	var x = this.calcPercentageWidth(this.x) + offsetX;
	var y = this.calcPercentageHeight(this.y) + offsetY;
	var originalRect = {
		left : x,
		top : y,
		right : x + this.width,
		bottom : y + this.height
	};

	var rect = this.viewport;

	var screenLeft, screenTop;
	if (this.isParentsViewport) {
		screenLeft = originalRect.left - rect.left;
		screenTop = originalRect.top - rect.top;
	}
	if (screenLeft + this.width < 0 || screenLeft > rect.width
			|| screenTop + this.height < 0 || screenTop > rect.height) {

		if (!this.viewRect.isOutside) {
			this.jObject['hide']();
			this.viewRect.isOutside = true;
		}
	} else {
		if (this.viewRect.isOutside) {
			this.jObject['show']();
			this.viewRect.isOutside = false;
		}
	}
	this.setRealPosition(screenLeft, screenTop);
};


GuiDiv.prototype.remove = function() {
	if (this.canvas)
		this.canvas.remove();
	GuiDiv.parent.remove.call(this);
	this.setDragListener(false);
};

/**
 *
 * @param {number} width
 * @param {number} height
 * @param {number} idx background index. default 0
 */
GuiDiv.prototype.setSize = function (width, height, idx) {
    // using for frames from sprite sheet
    if (this.width != null) {
        var background = this.backgrounds[idx ? idx : 0];
        if (background && (background.frameX || background.frameY)) {
            var scaleX = width / this.width;
            var scaleY = height / this.height;
            background.width *= scaleX;
            background.height *= scaleY;
            background.frameX *= scaleX;
            background.frameY *= scaleY;
        }
    }

    GuiDiv.parent.setSize.call(this, width, height);
};/**
 * @constructor
 */
function GuiButton() {
	GuiButton.parent.constructor.call(this);
}

GuiButton.inheritsFrom(GuiDiv);
GuiButton.prototype.className = "GuiButton";

/**
 *
 * @param params
 * "class": "GuiButton",
 "params": {
            "parent": "menuContainer",
            "normal": {
                "background": {
                    "image": "FinalArt/countriesSheet.png",
                    "width": 689,
                    "height": 738,
                    "frameX": -477,
                    "frameY": -41
                }
            },
            "hover": {
                "background": {
                    "image": "FinalArt/countriesSheet.png",
                    "width": 689,
                    "height": 738,
                    "frameX": -477,
                    "frameY": -41
                },
                "scale": 120
            },
            "style": "gameButton",
            "width": 48,
            "height": 36,
            "x": 320,
            "y": 227
        }
 * @return {GuiButton}
 */
GuiButton.prototype.createInstance = function(params) {
	var entity = new GuiButton();
	entity.initialize(params);
	return entity;
};

guiFactory.addClass(GuiButton);

GuiButton.prototype.generate = function(src) {
	var htmlText = "<div id='" + this.id + "' class='" + this.style + " unselectable'" + ((this.divname) ? ("name='" + this.divname + "'>") : (">"));
	htmlText += "</div>";

	return htmlText;
};

GuiButton.prototype.initialize = function(params) {
	this.divname = params['divname'];
	GuiButton.parent.initialize.call(this, params);

	// buttons is supposed to be small, so clamping it simple
	this.clampByViewport = GuiDiv.prototype.clampByViewportSimple;

	this.params = params;
	var that = this;
	this.label = {
		"hide" : false
	};

	if (params['active'] === false) {
		this.active = false;
	} else {
		this.active = true;
	}

	var labelParams;
	var normalParams = {};

	var prepareButtonState = function(params) {
		var image = GuiDiv.prototype.createInstance({
			parent : that,
			style : params['imageStyle'] ? params['imageStyle'] : "buttonImage",
			width : that.width,
			height : that.height,
			x : params['x'] ? params['x'] : "50%",
			y : params['y'] ? params['y'] : "50%",
            "background": params['background']
		});

		that.children.addGui(image);

		var w = selectValue(params['width'], normalParams['width'], that.width);
		var h = selectValue(params['height'], normalParams['height'], that.height);
		// if scale parameter exists scale size, scale specifies in percents
		if (params['scale']) {
			w = Math.round(w * params['scale'] / 100);
			h = Math.round(h * params['scale'] / 100);
		}

		var offsetX = -Math.round(w / 2);
		var offsetY = -Math.round(h / 2);

		image.setOffset(offsetX, offsetY);
		if (!params['background']) {
            params['image'] = Resources.getImage(params['image']);
			image.setBackground(params['image'], w, h, 0, 0);
		}
		image.setSize(w, h);
		image.hide();

		var label;
		if (params['label']) {
			labelParams = labelParams ? labelParams : params['label'];
			// if scale parameter exists then scale size, scale specifies in
			// percents
			var scale = 1;
			if (typeof params['scale'] == "number") {
				scale = params['scale'] / 100;
			}

			w = selectValue(params['label']['width'], labelParams['width'], that.width) * scale;
			h = selectValue(params['label']['height'], labelParams['height'], that.height) * scale;

			fontSize = selectValue(params['label']['fontSize'], labelParams['fontSize']) * scale;

			offsetX = selectValue(params['label']['offsetX'], labelParams['offsetX'], -Math.round(w / 2));
			offsetY = selectValue(params['label']['offsetY'], labelParams['offsetY'], -Math.round(h / 2));

			w = Math.round(w);
			h = Math.round(h);

			label = guiFactory.createObject("GuiLabel", {
				parent : image,
				style : selectValue(params['label']['style'], labelParams['style']),
				width : w,
				height : h,
				cursor : "pointer",
				text : selectValue(params['label']['text'], labelParams['text']),
				fontSize : fontSize,
				align : selectValue(params['label']['align'], labelParams['align'], "center"),
				verticalAlign : selectValue(params['label']['align'], labelParams['align'], "middle"),
				x : selectValue(params['label']['x'], labelParams['x'], "50%"),
				y : selectValue(params['label']['y'], labelParams['y'], "50%"),
				offsetX : params['label']['offsetX'] ? offsetX + params['label']['offsetX'] : offsetX,
				offsetY : params['label']['offsetY'] ? offsetY + params['label']['offsetY'] : offsetY
			});
			that.children.addGui(label);
			label.hide();
		}

		var callback = function() {
			// a bit hacky, but works
			// identify current state by reference to its params object
			if (that.currentStateParams === params) {
				return;
			} else {
				that.currentStateParams = params;
			}
			var oldCurrentImage = that.currentImage;
			var oldCurrentLabel = that.currentLabel;

			that.currentImage = image;
			if (that.currentImage) {
				that.currentImage.show();
			}

			that.currentLabel = label;
			if (that.currentLabel && that.label.hide === false) {
				that.currentLabel.show();
			}
			if (oldCurrentLabel) {
				oldCurrentLabel.hide();
			}
			if (oldCurrentImage) {
				oldCurrentImage.hide();
			}
		};
		return {
			image : image,
			label : label,
			callback : callback
		};
	};

	// normal state (unpressed button)
	if (params['normal']) {
		normalParams = params['normal'];
		var resultNormal = prepareButtonState(params['normal']);
		that.label['normal'] = resultNormal.label;
		that.imageNormal = resultNormal.image;
		that.normalState = function() {
			resultNormal.callback.call(that);
			that.clickAllowed = false;
		};
		that.normalState.call(that);
	}

	// mouse over the button
	if (!Device.isTouch()) {
		if (params['hover']) {
			var result = prepareButtonState(params['hover']);
			that.label['hover'] = result.label;
			that.imageHover = result.image;
			that.hoverState = result.callback;
		}
		// button pressed
		if (params['active']) {
			var result = prepareButtonState(params['active']);
			that.imageActive = result.image;
			that.label['active'] = result.label;
			that.activeState = result.callback;
		} else {
			if (params['hover']) {
				that.activeState = that.normalState;
			}
		}
	} else {
		if (params['hover']) {
			var result = prepareButtonState(params['hover']);
			that.label['hover'] = result.label;
			that.imageActive = result.image;
			that.activeState = result.callback;
		}
	}
	// passive state (button cannot be clicked)
	if (params['passive']) {
		passiveParams = params['passive'];
		var resultPassive = prepareButtonState(params['passive']);
		that.label['passive'] = resultPassive.label;
		that.imagePassive = resultPassive.image;
		that.passiveState = function() {
			resultPassive.callback.call(that);
			that.clickAllowed = false;
		};
		if (!that.active) {
			that.passiveState.call(that);
		}
	}
};

GuiButton.prototype.changeLabel = function(text) {
	$['each'](this.label, function(index, value) {
		if (index == "hide") {
			return;
		}
		value.change(text);
	});
};

GuiButton.prototype.hideLabel = function() {
	this.label.hide = true;
	$['each'](this.label, function(index, value) {
		if (index == "hide") {
			return;
		}
		value.hide();
	});
};

GuiButton.prototype.showLabel = function() {
	this.label.hide = false;
	$['each'](this.label, function(index, value) {
		if (index == "hide") {
			return;
		}
		value.show();
	});
};

GuiButton.prototype.bind = function(pushFunction) {
	// simple onclick event without any effects for button
	if (!this.activeState) {
		GuiButton.parent.bind.call(this, pushFunction);
		return;
	}
	var that = this;

	this.backedToNormal = false;
	this.clickAllowed = false;
	this.unbind();
	if (this.hoverState && !Device.isTouch()) {
		this.jObject.bind("mouseenter.guiElementEvents", function() {
			if (!that.active) {
				return;
			}
			that.hoverState();
		});
		this.jObject.bind("mouseleave.guiElementEvents", function() {
			if (!that.active) {
				that.passiveState();// temporary hack
				return;
			}
			that.normalState();
		});
	}

	if (pushFunction) {
		this.pushFunction = pushFunction;
	}
	var backToNormalCallback = this.hoverState ? this.hoverState : this.normalState;

	var callbackCaller = function(event) {
		if (!that.active)
			return;
		if (that.isEnabled()) {
			if (that.clickAllowed) {
				if (that.pushFunction) {
					var name = event.currentTarget.getAttribute("name");
					if (name) {
						// if (name == "screen") {
						// Recorder.recordAction("clickedAt", name, {
						// x : event.offsetX,
						// y : event.offsetY
						// });
						// } else {
						// Recorder.recordAction("click", name);
						// }
					}
					that.pushFunction(event);
				}
				that.clickAllowed = false;
			}
			backToNormalCallback.call(that);
		}
	};

	if (this.activeState) {
		if (!Device.isTouch()) {
			this.jObject.bind("mousedown", function() {
				if (!that.active)
					return;
				that.activeState.call(that);
				that.clickAllowed = true;
			});
			this.jObject.bind("mouseup", callbackCaller);
		} else {
			this.jObject.bind("touchstart", function() {
				if (!that.active)
					return;
				that.activeState.call(that);
				that.clickAllowed = true;
				that.backedToNormal = false;
			});
			this.jObject.bind("touchend", callbackCaller);
			this.jObject.bind("touchmove", function(e) {
				if (!that.active)
					return;
				if (that.backedToNormal) {
					return;
				}

				e.preventDefault();
				var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
				var obj = $(document.elementFromPoint(touch.pageX, touch.pageY));

				if (!that.isPointInsideReal(touch.pageX, touch.pageY)) {
					backToNormalCallback.call(that);
					that.backedToNormal = true;
				}
			});
		}

	}
	this.jObject['css']("cursor", "pointer");
//	$['each'](this.label, function(index, value) {
//		if (index == "hide") {
//			return;
//		}
//		if(value){
//			value.jObject['css']("cursor", "pointer");
//		}
//	});
};

// change background in all of button states
GuiButton.prototype.changeButtonBackgrounds = function(params, idx) {
	if (this.imageNormal) {
		this.imageNormal.setBackgroundFromParams(params, idx);
	}
	if (this.imageHover) {
		this.imageHover.setBackgroundFromParams(params, idx);
	}
	if (this.imageActive) {
		this.imageActive.setBackgroundFromParams(params, idx);
	}
	if (this.imagePassive) {
		this.imagePassive.setBackgroundFromParams(params, idx);
	}
};

GuiButton.prototype.setButtonBackgrounds = function(img) {
	if (this.imageNormal) {
		this.imageNormal.setBackground(img);
	}
	if (this.imageHover) {
		this.imageHover.setBackground(img);
	}
	if (this.imageActive) {
		this.imageActive.setBackground(img);
	}
	if (this.imagePassive) {
		this.imagePassive.setBackground(img);
	}
};

// show or hides background
// changes background for highlighted
GuiButton.prototype.highlight = function(isOn) {
	if (this.params['highlight']) {
		if (isOn) {
			this.img = this.params['background']['image'];
			this.setBackground(Resources.getImage(this.params['highlight']['image']));
			this.backgroundShown = isOn;
			this.showBackground();
		} else {
			this.setBackground(this.img);
			this.showBackground();
		}
	} else {
		this.backgroundShown = isOn;
		if (this.backgroundShown) {
			this.showBackground();
		} else {
			this.hideBackground();
		}
	}

};

GuiButton.prototype.isActive = function() {
	return this.active;
};

GuiButton.prototype.activate = function(isActive) {
	if (!this.params['passive']) {
		return;
	}
	if (isActive === false) {
		this.passiveState();
		this.active = false;
	} else {
		this.active = true;
		this.normalState();
	}
};

GuiButton.prototype.resize = function() {
	GuiButton.parent.resize.call(this);
};
/**
 * Label with text that can be aligned vertically and horizontally
 */

/**
 * @constructor
 */
function GuiLabel() {
	GuiLabel.parent.constructor.call(this);
}

GuiLabel.inheritsFrom(GuiElement);
GuiLabel.prototype.className = "GuiLabel";

GuiLabel.prototype.createInstance = function(params) {
	var entity = new GuiLabel();
	entity.initialize(params);
	return entity;
};

guiFactory.addClass(GuiLabel);

GuiLabel.prototype.initialize = function(params) {
	this.divname = params['divname'];
	GuiLabel.parent.initialize.call(this, params);

	this.fontSize = params['fontSize'] ? params['fontSize'] : 20;
	this.change(params['text']);
	if(params['cursor']){
		this.jObject['css']("cursor", params['cursor']);
		this.cursor = params['cursor'];
	}
	if (params['align']) {
		this.align(params['align'], params['verticalAlign']);
	}
	if (params['color']) {
		this.setColor(params['color']);
	}
	
	this.setLineHeight(params['lineHeight']?params['lineHeight']:1);
};

GuiLabel.prototype.generate = function(src) {
	var id = this.id;
	this.rowId = this.id + "_row";
	this.cellId = this.id + "_cell";
	return "<div id='" + this.id + "' class='" + this.style + " unselectable' style='cursor: default'>"
	+ "<div id='" + this.rowId + "' style='display:table-row; '>"
	+ "<div id='" + this.cellId +"'"+((this.divname)?(" name='"+ this.divname +"'"):(""))+ " style='display:table-cell;'>"
	+ src + "</div></div></div>";
};

GuiLabel.prototype.create = function(src) {
	GuiDiv.parent.create.call(this, src);
	$("#" + this.cellId)['css']("font-size", Math.floor(this.fontSize
			* Math.min(Screen.widthRatio(), Screen.heightRatio()))
			+ "px");

};

GuiLabel.prototype.change = function(src, fontSize) {
	src = Resources.getString(src);
	$("#" + this.cellId).text(src);
	if (fontSize)
		this.fontSize = fontSize;
//	console.error(this.id,this.cellId, $("#" + this.cellId).text());
	$("#" + this.cellId)['css']("font-size", Math.floor(this.fontSize
			* Math.min(Screen.widthRatio(), Screen.heightRatio()))
			+ "px");
//	this.resize();
};

GuiLabel.prototype.append = function(src) {
	$("#" + this.cellId).append(src);
	this.resize();
};

GuiLabel.prototype.empty = function() {
	$("#" + this.cellId).empty();
	this.resize();
};

GuiLabel.prototype.setPosition = function(x, y) {
	GuiLabel.parent.setPosition.call(this, x, y);

};

GuiLabel.prototype.setRealSize = function(width, height) {
	GuiLabel.parent.setRealSize.call(this, width, height);

	var size = Screen.calcRealSize(width, height);
	$("#" + this.rowId)['css']("width", size.x);
	$("#" + this.rowId)['css']("height", size.y);
	$("#" + this.cellId)['css']("width", size.x);
	$("#" + this.cellId)['css']("height", size.y);

	$("#" + this.cellId)['css']("font-size", Math.floor(this.fontSize
			* Math.min(Screen.widthRatio(), Screen.heightRatio()))
			+ "px");
	// cssTransform($("#" + this.cellId), null, null, Screen.widthRatio(),
	// Screen.heightRatio());

};

GuiLabel.prototype.resize = function() {
	GuiLabel.parent.resize.call(this);
};

GuiLabel.prototype.setColor = function(color) {
	this.jObject['css']("color", color);
};

GuiLabel.prototype.setLineHeight = function(lineHeight) {
	this.jObject['css']("line-height", lineHeight);
};

GuiLabel.prototype.align = function(alignH, alignV) {
	if (alignH) {
		$("#" + this.cellId)['css']("text-align", alignH);
	}
	if (alignV) {
		$("#" + this.cellId)['css']("vertical-align", alignV);
	}
};
/**
 * Scrolling group of elements
 */

/**
 * @constructor
 */
function GuiScroll() {
	GuiScroll.parent.constructor.call(this);
}

GuiScroll.inheritsFrom(GuiElement);
GuiScroll.prototype.className = "GuiScroll";

GuiScroll.prototype.generate = function(src) {
	this.listId = this.id + "_list";
	this.scrollId = this.id + "_scroll";
	this.listId = this.scrollId;

	return "<div id='" + this.id + "' class='" + this.style
			+ " scrollerWrapper " + "unselectable'>" + "<div id='"
			+ this.scrollId + "' class='scrollerBackground'>"
			// + "<ul id=\"" + this.listId + "\"></ul>"
			+ "</div></div>";
};

GuiScroll.prototype.createInstance = function(params) {
	var entity = new GuiScroll(params['parent'], params['style'],
			params['width'], params['height']);
	entity.initialize(params);
	return entity;
};

guiFactory.addClass(GuiScroll);

GuiScroll.prototype.initialize = function(params) {
	GuiScroll.parent.initialize.call(this, params);
	this.createScroll();
};

GuiScroll.prototype.createScroll = function() {
	var thisGuiScroll = this;
	this.hScroll = (this.params['hScroll'] != null) ? this.params['hScroll']
			: true;
	this.vScroll = (this.params['vScroll'] != null) ? this.params['vScroll']
			: true;
	
	if (this.params["fixedHeight"])
	this.setFixedHeight(this.params["fixedHeight"]);
	
	this.scroll = new iScroll(this.id, {
		'hScroll' : this.hScroll,
		'vScroll' : this.vScroll,
		'useTransform' : true,
		'onBeforeScrollStart' : function(e) {
			var target = e.target;
			while (target.nodeType != 1) {
				target = target.parentNode;
			}

			// if (target.tagName != 'SELECT' && target.tagName != 'INPUT' &&
			// target.tagName != 'TEXTAREA')
			e.preventDefault();

			// console.log("candidate " + target.id);
		},
		'onScrollStart' : function(e) {
			var target = e.target;
			thisGuiScroll.candidateToClick = null;

			while (true) {
				// a text element or element without id - skip it
				if (target.nodeType != 1 || target.id == '') {
					target = target.parentNode;
					continue;
				}

				// console.log("try to click " + target.id);
				var item = $("#" + target.id);
				if (item.length > 0) {
					var element = item['data']("guiElement");
					// console.log("element is " + element);

					// TODO listItemClickCallback and listItemMouseDownCallback
					// hacks
					// should be moved to GuiButton
					if (element) {
						if (element.listItemClickCallback) {
							thisGuiScroll.candidateToClick = element;
							break;
						} else if (element.listItemMouseDownCallback) {
							element.listItemMouseDownCallback(e);
							break;
						}
						// console.log("candidate " +
						// thisGuiScroll.candidateToClick.id);
					}
				}
				target = target.parentNode;

				// we have no parent or reached scroll element itself
				if (!target || target.id == thisGuiScroll.listId
						|| target.id == thisGuiScroll.scrollId
						|| target.id == thisGuiScroll.id)
					break;
			}
		},
		'onScrollMove' : function(e) {
			thisGuiScroll.candidateToClick = null;
		},
		'onBeforeScrollEnd' : function() {
			if (thisGuiScroll.candidateToClick) {
				thisGuiScroll.candidateToClick.listItemClickCallback();
				thisGuiScroll.candidateToClick = null;
			}
		}
	});
};

GuiScroll.prototype.refresh = function(height) {
	this.scroll['scrollTo'](0, 0, 0, false);
	if (this.fixedHeight) {
		this.scroll['refresh'](this.fixedHeight * Screen.heightRatio());
	} else {
		this.scroll['refresh']();
	}
};

GuiScroll.prototype.addListItem = function(item) {
	// var listItemId = this.listId + "_item" + uniqueId();
	// $("#" + this.listId).append("<li id='" + listItemId + "'></li>");
	// if (typeof item === "string") {
	// $("#" + listItemId).html(item);
	// } else {
	// item.setParent(listItemId);
	// }

	item.setParent("#" + this.listId);
	// allow events to propagate to reach the scroll
	item.unbind();
	this.children.addGui(item);

	this.resize();
};

GuiScroll.prototype.removeListItem = function(item) {
	this.children.removeGui(item);
	this.resize();
};

GuiScroll.prototype.clearList = function() {
	$("#" + this.listId).empty();
	this.children.clear();
};

GuiScroll.prototype.remove = function() {
	if(this.scroll){
		this.scroll['destroy']();
		delete this.scroll;
	}
	GuiScroll.parent.remove.call(this);
};

GuiScroll.prototype.resizeScroll = function() {
	// a bit hacky. To enable horizontal scrolling
	// make sure that we will have enough width.
	if (this.hScroll && !this.vScroll) {
		var totalWidth = 0;
		for ( var i = 0; i < this.children.guiEntities.length; i++) {
			totalWidth += this.children.guiEntities[i].$()['outerWidth'](true);
		}
		$("#" + this.listId)['width'](totalWidth);
	}
};

GuiScroll.prototype.setFixedHeight = function(height) {
	this.fixedHeight = height;
};

GuiScroll.prototype.resize = function() {
	GuiScroll.parent.resize.call(this);
	this.resizeScroll();
	if (this.scroll) {
		this.refresh();
	}
};

DOM_MODE = true;

var GUISPRITE_HACK_ON = false;

/**
 * @constructor
 */
function GuiSprite() {
	GuiSprite.parent.constructor.call(this);
}

GuiSprite.inheritsFrom(GuiDiv);
GuiSprite.prototype.className = "GuiSprite";

GuiSprite.prototype.createInstance = function(params) {
	var entity = new GuiSprite();
	entity.initialize(params);
	return entity;
};

guiFactory.addClass(GuiSprite);

GuiSprite.prototype.initialize = function(params) {
	GuiSprite.parent.initialize.call(this, params);

	// .hack temporary disable viewport for sprites at all
	this.clampByViewport = this.clampByViewportSimple;

	this.totalWidth = params['totalImageWidth'];
	this.totalHeight = params['totalImageHeight'];
	this.frameCallback = null;
	this.offsetY1 = 0;
	this.offsetX1 = 0;
	this.totalSrc = params['totalImage'];
	// // .hack temporary for older games
	if (GUISPRITE_HACK_ON) {
		this.totalSrc = Resources.getImage(params['totalImage']);
	}

	if (params['totalTile'] == null) {
		this.totalTile = {
			x : 0,
			y : 0
		};
	} else {
		this.totalTile = params['totalTile'];
	}
    this.flipped = params['flipped'] != null ? params['flipped'] : false;

	this.setBackground(this.totalSrc);

	this.currentAnimation = null;
	this.spatialAnimation = null;
	this.animations = new Object();

	var that = this;
	if (params['spriteAnimations']) {
		$['each'](params['spriteAnimations'], function(name, value) {
			// console.log("Adding sprite animation " + name);
			that.addSpriteAnimation(name, value);
		});
	}

	this.jObject['css']("background-position", Math.floor(Screen.widthRatio()
			* this.totalTile.x * this.width)
			+ "px "
			+ Math.floor(Screen.heightRatio() * this.height * this.totalTile.y)
			+ "px");

	this.resize();

	if (params['startAnimation']) {
		this.playAnimation(params['startAnimation']['name'],
				params['startAnimation']['duration'],
				params['startAnimation']['loop']);
		this.setStaticUpdate(true);
	}
	
	this.frames = {};
	if(params['frames']){
		this.frames = params['frames']; 
	}

};

GuiSprite.prototype.setStaticUpdate = function(isStatic){
	if(isStatic === false){
		delete Account.instance.staticSprites[this.id];
	}else{
		Account.instance.staticSprites[this.id] = this;
	}
};

GuiSprite.prototype.addSpriteAnimation = function(name, description) {
	this.animations[name] = {
		frames : description['frames'],
		row : description['row'],
		frameDuration : description['frameDuration'],
		spatial : description['spatial']
	};
};

GuiSprite.prototype.addAnimation = function(animationName, frames, row,
		frameDuration) {
	this.animations[animationName] = {
		frames : frames,
		row : row,
		frameDuration : frameDuration
	};
};

GuiSprite.prototype.update = function(dt) {
	if (this.currentAnimation == null && this.spatialAnimation == null) {
		return;
	}

	var curTime = (new Date()).getTime();
	if (!dt) {
		dt = curTime - this.lastUpdateTime;
	}
	this.lastUpdateTime = curTime;
	this.currentFrameTime += dt;

	if (this.spatialAnimation !== null) {
		this.updateSpatialAnimation(dt);
	}
	while (this.currentFrameTime >= this.currentFrameLength) {
		var stopped = this.updateAnimation();
		if (stopped == true) {
			return;
		}
		this.currentFrameTime -= this.currentFrameLength;
	}
};

GuiSprite.prototype.updateSpatialAnimation = function(dt) {
	if (this.spatialAnimation == null) {
		return;
	}
	var part = dt / this.spatialAnimation.duration;
	if (this.spatialAnimation.timeLeft > dt) {
		this.move(this.spatialAnimation.dx * part, this.spatialAnimation.dy
				* part);
	} else {
		part = this.spatialAnimation.timeLeft / this.spatialAnimation.duration;
		this.move(this.spatialAnimation.dx * part, this.spatialAnimation.dy
				* part);
		if (this.spatialAnimation.callback) {
			this.spatialAnimation.callback();
		}
		this.spatialAnimation = null;
	}
	if (this.spatialAnimation) {
		this.spatialAnimation.timeLeft -= dt;
	}
	this.resize();
};

GuiSprite.prototype.updateAnimation = function() {
	if (this.currentAnimation == null)
		return;
	if (this.currentFrame >= this.animations[this.currentAnimation].frames.length) {
		this.currentFrame = 0;
		if (!this.looped) {
			this.stopAnimation();
			return true;
		}
	}
	
	

	var rowFramesLength = Math.round(this.totalWidth / this.width);
	var frame = this.animations[this.currentAnimation].frames[this.currentFrame];
	
	if(this.frames[frame]){
		var frm = this.frames[frame]; 
		this.jObject['css']("background-position", Math.round(-Screen.widthRatio()
				* frm.x + Screen.heightRatio() * this.offsetX1)
				+ "px "	+ Math.round(-Screen.heightRatio() * frm.y
						+ Screen.heightRatio() * this.offsetY1) + "px ");
//		if(frm.w && frm.h){
//			this.jObject['css']("background-position", frm.w + "px " + frm.w + "px ");
//		}
	}else{
		var remainder = frame % rowFramesLength;
		var q = (frame - remainder) / rowFramesLength;
		var row = this.animations[this.currentAnimation].row + q;
		frame = remainder;

		this.jObject['css']("background-position", Math.round(-Screen.widthRatio()
				* frame * this.width + Screen.heightRatio() * this.offsetX1)
				+ "px "
				+ Math.round(-Screen.heightRatio() * row * this.height
						+ Screen.heightRatio() * this.offsetY1) + "px ");
		this.frame = frame;
		this.row = row;
	}
	
	this.setRealBackgroundPosition();// test
	if (this.frameCallback != null) {
		if (this.frameCallback[this.currentAnimation]) {
			this.frameCallback[this.currentAnimation](this.currentFrame);
		}
	}
	this.currentFrame++;
};

GuiSprite.prototype.stopAnimation = function(dontCallCallback) {
	this.jObject['stop']();
	clearInterval(this.updateAnimationCallback);
	this.updateAnimationCallback = null;
	this.currentAnimation = null;
	// this.frameCallback = null;
	if (!dontCallCallback && this.animationEndCallback) {
		// trick with oldCallback is to allow to call setCallback
		// inside callback itself
		var oldCallback = this.animationEndCallback;
		this.animationEndCallback = null;
		oldCallback.call(this);
	}
};

GuiSprite.prototype.remove = function() {
	GuiSprite.parent.remove.call(this);
	clearInterval(this.updateAnimationCallback);
	this.updateAnimationCallback = null;
};

GuiSprite.prototype.setFrameCallback = function(frameCallback) {
	this.frameCallback = frameCallback;
};

GuiSprite.prototype.setAnimationEndCallback = function(animationEndCallback) {
	this.animationEndCallback = animationEndCallback;
};

GuiSprite.prototype.playAnimation = function(animationName, duration, isLooped,
		independentUpdate) {

	var animation = this.animations[animationName];
	assert(animation, "No such animation: " + animationName);

	this.stopAnimation(true);

	this.currentAnimation = animationName;

	this.lastAnimation = animationName;

	var that = this;
	this.currentFrame = 0;
	this.currentFrameTime = 0;
	this.lastUpdateTime = (new Date()).getTime();

	// console.log(this.animations[this.currentAnimation].frameDuration);
	if (duration) {
		this.currentFrameLength = duration / animation.frames.length;
		// console.log("frame lenght " + this.currentFrameLength + ", " +
		// animation.frames.length);
	} else {
		this.currentFrameLength = this.animations[this.currentAnimation].frameDuration;
	}
	this.looped = isLooped;

	if (independentUpdate) {
		this.updateAnimationCallback = setInterval(function() {
			that.updateAnimation();
		}, this.currentFrameLength);
	}
	this.updateAnimation();
};

GuiSprite.prototype.isPlayingAnimation = function(animationName) {
	return this.currentAnimation == animationName;
};

// GuiSprite.prototype.animate = function(moveVector, duration) {
// var that = this;
// this.jObject['animate']({
// left : moveVector.x * Screen.widthRatio() + 'px',
// top : moveVector.y * Screen.heightRatio() + 'px'
// }, {
// duration : duration,
// easing : "linear",
// complete : function() {
// that.stopAnimation();
// // that.x = $("#" + that.id)['css']("left");
// }
// // ,
// // step : function(now, fx) {
// // console.log($("#" + that.id)['css']("left"));
// // }
// });
// };

GuiSprite.prototype.animate = function(animation, callback) {
	var that = this;
	var dx = 0;
	var dy = 0;
	if (animation.x) {
		dx = animation.x - this.x;
	}
	if (animation.y) {
		dy = animation.y - this.y;
	}
	this.spatialAnimation = {
		dx : dx,
		dy : dy,
		duration : animation.duration,
		timeLeft : animation.duration
	};
	if (animation.fade) {
		this.fadeTo(0, animation.duration - 100, function() {
			that.spatialAnimation = null;
			if (callback) {
				callback();
			}
		});
	} else {
		this.spatialAnimation['callback'] = callback;
	}
};

GuiSprite.prototype.flip = function(needToBeFlipped) {
	this.flipped = needToBeFlipped;
	this.transform();
};

GuiSprite.prototype.transform = function(transfromations) {
	if (transfromations) {
		if (transfromations.matrix != null)
			this.matrix = transfromations.matrix;
		if (transfromations.angle != null)
			this.angle = transfromations.angle;
		if (transfromations.scale != null)
			this.scale = transfromations.scale;
		if (transfromations.translate != null)
			this.translate = transfromations.translate;
	}
	var scaleY = selectValue(this.scale, 1);
	var scaleX = scaleY;
	scaleX *= (this.flipped ? -1 : 1);
	
	cssTransform(this.jObject, this.matrix, this.angle, scaleX, scaleY,
			this.translate);
};

GuiSprite.prototype.rotate = function(angle) {
	this.angle = angle;
	this.transform();
};

GuiSprite.prototype.setTransformOrigin = function(transformOrigin) {
	this.transformOrigin = transformOrigin;
	// console.log("Set transform origin to %s", transformOrigin);
	var obj = this.jObject;
	obj['css']("-webkit-transform-origin", transformOrigin);
	obj['css']("transform-origin", transformOrigin);
	obj['css']("-moz-transform-origin", transformOrigin);
	obj['css']("-o-transform-origin", transformOrigin);
	obj['css']("transform-origin", transformOrigin);
	obj['css']("msTransform-origin", transformOrigin);
};

GuiSprite.prototype.setPosition = function(x, y) {
//	if (this.x !== x || this.y !== y) {
		this.x = x;
		this.y = y;

		if (this.viewport) {
			this.clampByViewport();
		} else {
			this.setRealPosition(x, y);
		}
//	}
};

GuiSprite.prototype.setRealPosition = function(x, y) {
	var transObj = {
			translate : {
				x : Math.round(x * Screen.widthRatio()),
				y : Math.round(y * Screen.heightRatio())
			}
	};
	this.transform(transObj);
};

GuiSprite.prototype.setTransform = function(matrix, angle) {
	this.angle = angle;
	this.matrix = matrix;
	this.transform();
};

GuiSprite.prototype.resize = function() {
	GuiSprite.parent.resize.call(this);
	this.setRealBackgroundPosition(this.offsetX1, this.offsetY1);
};

GuiSprite.prototype.setRealBackgroundPosition = function(offsetX, offsetY) {
	if (offsetY) {
		this.offsetY1 = offsetY;
	}
	if (offsetX) {
		this.offsetX1 = offsetX;
	}
	var frame = selectValue(this.frame, 0);
	var row = selectValue(this.row, 0);
	this.jObject['css']("background-position", Math.round(Screen.widthRatio()
			* (-frame * this.width + offsetX))
			+ "px "
			+ Math.round(Screen.heightRatio() * (row * this.height + offsetY))
			+ "px ");
};

GuiSprite.prototype.resizeBackground = function() {
	var size = Screen.calcRealSize(this.totalWidth, this.totalHeight);
	this.jObject['css']("background-size", size.x + "px " + size.y + "px");
};

/**
 * usage:
 * var changingColorPairs = [];
 * var pair1 = new ColorRgbChangingPair(new ColorRgb(1, 1, 1), new ColorRgb(2, 2, 2));
 * var pair2 = new ColorRgbChangingPair(new ColorRgb(3, 3, 3), new ColorRgb(4, 4, 4));
 * changingColorPairs.push(pair);
 * changingColorPairs.push(pair2);
 * guiSprite.recolor(changingColorPairs);
 *
 * @param [{ColorRgbChangingPair}] changingColorPairs
 * @return {string} imageUrl
 */
GuiSprite.prototype.recolor = function (changingColorPairs) {
    var image = Resources.getAsset(this.params.totalImage);
    var url = recolorImage(image, changingColorPairs);
    this.setBackgroundFromParams({image: url}, null);
    return url;
};

/**
 *
 * @param {ColorRgbChangingPair} changingColorPair
 * @return {string} imageUrl
 */
GuiSprite.prototype.recolorFullImage = function (changingColorPair) {
    var image = Resources.getAsset(this.params.totalImage);
    var url = recolorFullImage(image, changingColorPair);
    this.setBackgroundFromParams({image: url}, null);
    return url;
};
/**
 * Scene to operate Sprites
 */

/**
 * @constructor
 */
function GuiScene() {
	GuiScene.parent.constructor.call(this);
}

GuiScene.inheritsFrom(GuiDiv);
GuiScene.prototype.className = "GuiScene";

GuiScene.prototype.createInstance = function(params) {
	var entity = new GuiScene(params['parent'], params['style'], params['width'],
			params['height'], params['canvas'], null);
	entity.initialize(params);
	return entity;
};

guiFactory.addClass(GuiScene);
/**
 * GuiDialog - modal dialog Has a mask full screen mask over the screen and
 * background image
 */

/**
 * @constructor
 */
function GuiDialog() {
	GuiDialog.parent.constructor.call(this);
};

GuiDialog.inheritsFrom(GuiDiv);
GuiDialog.prototype.className = "GuiDialog";

GuiDialog.prototype.maskDivSoul = null;

GuiDialog.prototype.createInstance = function(params) {
	var entity = new GuiDialog(params['parent'], params['style'], params['width'], params['height'], null);
	entity.initialize(params);
	return entity;
};

guiFactory.addClass(GuiDialog);

GuiDialog.prototype.resize = function() {
	GuiDialog.parent.resize.call(this);
	this.children.resize();
};

GuiDialog.prototype.initialize = function(params) {
	GuiDialog.parent.initialize.call(this, params);
	
	this.maskDiv = null;
	this.visible = false;
	

	var that = this;

	// "x" : ((Screen.baseWidth() - this.width) / 2),
	// "y" : ((Screen.baseHeight() - this.height) / 2)

	// an transparent PNG image 1x1 pixel size
	// to prevent clicks
	if (!GuiDialog.prototype.maskDivSoul) {
		GuiDialog.prototype.maskDivSoul = guiFactory.createObject("GuiDiv", {
			"parent" : "#all",
			// "image" :
			// "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NkAAIAAAoAAggA9GkAAAAASUVORK5CYII=",
			"style" : "mask",
			"width" : "100%",
			"height" : "100%",
			"x" : 0,
			"y" : 0
		});
		var tempFunc = GuiDialog.prototype.maskDivSoul.remove;
		GuiDialog.prototype.maskDivSoul.remove = function() {
			GuiDialog.prototype.maskDivSoul = null;
			tempFunc.call(this);
		};
	}
	this.maskDiv = GuiDialog.prototype.maskDivSoul;
//	this.maskDiv.setPosition(this.parent.width/2 - this.maskDiv.width, this.parent.height/2 - this.maskDiv.height);
	this.maskDiv.setBackground("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NkAAIAAAoAAggA9GkAAAAASUVORK5CYII=");
	this.maskDiv.bind(function(e) {
		e.preventDefault();
		return false;
	});
	this.children.addGui(this.maskDiv);

	this.maskDiv.setZ(130);
	this.setZ(131);
	this.maskDiv.hide();

	// if (this.backSrc) {
	// this.children.addGui(this.backImage =
	// factory.createGuiImage(this.dialogContainer, , "dialogButton",
	// this.width, this.height, 0, 0));
	// }
	this.resize();
};

GuiDialog.prototype.init = function() {
	GuiDialog.parent.init.call(this);
};

GuiDialog.prototype.show = function() {
	GuiDialog.parent.show.call(this);
	if (this.maskDiv) {
		this.maskDiv.resize();
		this.maskDiv.show();
	}
	this.visible = true;
};

GuiDialog.prototype.hide = function() {
	GuiDialog.parent.hide.call(this);
	if (this.maskDiv) {
		this.maskDiv.hide();
	}
	this.visible = false;
};

GuiDialog.prototype.isVisible = function() {
	return this.visible;
};
var _PIXIJS = false;//window._PIXIJS ? window._PIXIJS : false;

/**
 * This is canvas class for UltimateJS based on GuiElement.js but not inherit
 * from
 * 
 * @author Glukozavr
 * @date April-May 2014
 * @constructor
 */
function GuiCanvas() {
}

GuiCanvas.prototype.className = "GuiCanvas";

GuiCanvas.prototype.createInstance = function(params) {
	var entity = new GuiCanvas();
	entity.initialize(params);
	return entity;
};

guiFactory.addClass(GuiCanvas);

/**
 * Creates id for GuiCanvas
 * 
 * @returns {String} unique id for children of this canvas
 */
GuiCanvas.prototype.generateId = function() {
	return this.className + uniqueId();
};

/**
 * Method to create canvas element and get the 2d contex to this.contex Append
 * to body, if there is parent - to the parent.
 * 
 * @param src
 */
GuiCanvas.prototype.create = function(src) {
	var canvas = document.createElement("canvas");
	this.contex = canvas.getContext("2d");
	this.contex.imageSmoothingEnabled = false;
	this.contex.webkitImageSmoothingEnabled = false;
	this.contex.mozImageSmoothingEnabled = false;

	canvas.id = this.id;
	canvas.width = this.width;
	canvas.height = this.height;
	canvas.style.position = "absolute";
	document.body.appendChild(canvas);

	// remember jQuery object
	this.jObject = $("#" + this.id);

	this.setAwake(true);

//	if (_PIXIJS) {
//		this.renderer = new PIXI.CanvasRenderer(this.width, this.height, canvas);
//		this.renderer.transparent = true;
//		this.stage = new PIXI.Stage("0xFFFFFF");
////		this.stage = 0; 
//	}

	if (!this.setParent(this.parent)) {
		// if no parent provided assigning to the body object
		console.warn("No parent was provided for object id = " + this.id);
	}

	assert(this.jObject.length > 0, "Object id ='" + this.id
			+ "' was not properly created");
};

/**
 * Initial function to save and use incoming params
 * 
 * @param params
 *            may contain: - parent - width - height - image - offsetX - offsetY -
 *            x - y - z - hide - opacity
 */
GuiCanvas.prototype.initialize = function(params) {
	this.params = params;

	this.parent = params['parent'];

	// generate ID
	this.id = this.generateId();

	// Setting position and size variables
	this.setSize(Screen.macro(params['width']), Screen.macro(params['height']),
			true);
	this.setOffset(Screen.macro(params['offsetX']), Screen
			.macro(params['offsetY']));
	this.setGuiOffset(Screen.macro(params['guiOffsetX']), Screen
			.macro(params['guiOffsetY']));
	this
			.setPosition(Screen.macro(params['x']), Screen.macro(params['y']),
					true);

	// Check whether element with such id is already in scene
	if ($("#" + this.id).length > 0) {
		console.error(" GuiCanvas with  id = '" + this.id
				+ "' is already exists.");
	}

	// Container for children
	this.children = new GuiContainer();
	this.children.init();

	// Creating of the canvas element
	this.create();

	// Creating background pattern for the canvas if image is exist in tha
	// params.
	this.terrainPattern = null;
	if (params.image) {
		var img = Resources.getAsset(params.image);
		this.terrainPattern = this.contex.createPattern(img, 'repeat');
	}

	// attach 'this' as data to the element, so we can reference to it by
	// element id
	this.jObject['data']("GuiCanvas", this);

	// Creating baseDiv for div elements attach to if needed.
	// this.baseDiv = guiFactory.createObject("GuiDiv", {
	// "parent" : this.parent,
	// "width" : this.width,
	// "height" : this.parent,
	// "x" : this.x,
	// "y" : this.y,
	// "offsetX" : this.offsetX,
	// "offsetY" : this.offsetY
	// });

	if (typeof params['z'] == "number") {
		this.setZ(params['z']);
	}

	// Can be hidden on the start
	if (params['hide']) {
		this.hide();
	} else {
		this.show();
	}

	if (typeof params['opacity'] == "number") {
		this.setOpacity(params['opacity']);
	}

	// Enable update
	this.enabled = true;

	// Position and size the element once in the end of initialize
	this.resize();

	// Adding GuiCanvas for update
	// Account.instance.addScheduledEntity(this);
	Account.instance.addRenderEntity(this);
};

/**
 * Creating shift which is considered while positioning element
 * 
 * @param offsetX
 *            shift on x coordinate
 * @param offsetY
 *            shift on y coordinate
 */
GuiCanvas.prototype.setOffset = function(offsetX, offsetY) {
	this.offsetX = offsetX;
	this.offsetY = offsetY;

	if (this.baseDiv)
		this.baseDiv.setOffset(offsetX, offsetY);
};

GuiCanvas.prototype.setGuiOffset = function(offsetX, offsetY) {
	this.guiOffsetX = this.calcPercentageWidth(offsetX ? offsetX : 0);
	this.guiOffsetY = this.calcPercentageHeight(offsetY ? offsetY : 0);
	this.setAwake(true);
};

/**
 * Converting percents to number for width
 * 
 * @param val
 *            a string or number value
 * @returns {Number} a calculated percent, or the val itself
 */
GuiCanvas.prototype.calcPercentageWidth = function(val) {
	if (typeof (val) == "string" && val.indexOf("%") > -1) {
		var parentWidth = this.parent.jObject.width() / Screen.widthRatio();
		assert(typeof (parentWidth) == "number",
				"Wrong parent or value for % param name='" + this.name + "'");
		val = (parseFloat(val.replace("%", "")) * parentWidth / 100.0);
	}
	return val;
};

/**
 * Converting percents to number for height
 * 
 * @param val
 *            a string or number value
 * @returns {Number} a calculated percent, or the val itself
 */
GuiCanvas.prototype.calcPercentageHeight = function(val) {
	if (typeof (val) == "string" && val.indexOf("%") > -1) {
		var parentHeight = this.parent.jObject.height() / Screen.heightRatio();
		assert(typeof (parentHeight) == "number",
				"Wrong parent or value for % param name='" + this.name + "'");
		val = (parseFloat(val.replace("%", "")) * parentHeight / 100.0);
	}
	return val;
};

/**
 * Function to position the canvas element
 * 
 * @param x
 *            a number or percent value
 * @param y
 *            a number or percent value
 * @param noResize
 *            {Boolean} to disable resize in this function call
 */
GuiCanvas.prototype.setPosition = function(x, y, noResize) {
	this.x = x;
	this.y = y;

	if (!noResize)
		this.resize();
	else
		this.setAwake(true);
};

/**
 * Function to move canvas element
 * 
 * @param dx
 *            number
 * @param dy
 *            number
 */
GuiCanvas.prototype.move = function(dx, dy) {
	this.x += dx;
	this.y += dy;
	this.setPosition(this.x, this.y);
};

/**
 * Get "left" and "right" style attr of the canvas element
 * 
 * @returns object { x, y }
 */
GuiCanvas.prototype.getRealPosition = function() {
	return {
		x : this.jObject['css']("left").replace("px", ""),
		y : this.jObject['css']("top").replace("px", "")
	};
};

/**
 * Get x and y values of GuiCanvas
 * 
 * @returns { x, y }
 */
GuiCanvas.prototype.getPosition = function() {
	return {
		x : this.x,
		y : this.y
	};
};

/**
 * Sets z-index of the canvas element
 * 
 * @param z
 *            number
 */
GuiCanvas.prototype.setZ = function(z) {
	this.jObject['css']("z-index", z);
	this.jObject['css']("-webkit-transform", "translateZ(0)");
	this.z = z;
};

/**
 * Show canvas element
 */
GuiCanvas.prototype.show = function() {
	this.jObject['show']();
	this.visible = true;
};

/**
 * Hide canvas element
 */
GuiCanvas.prototype.hide = function() {
	this.jObject['hide']();
	this.visible = false;
};

/**
 * Set the opacity css attr
 * 
 * @param opacity
 *            number >= 0 and <= 1
 */
GuiCanvas.prototype.setOpacity = function(opacity) {
	this.jObject['css']("opacity", opacity);
};

GuiCanvas.prototype.isEventIn = function(e) {
	var pos = Device.getPositionFromEvent(e);

	var left = this.$()['offset']()['left'];
	var right = left + this.$()['width']();
	var top = this.$()['offset']()['top'];
	var bottom = top + this.$()['height']();
	var isIn = (pos.x > left) && (pos.x < right) && (pos.y > top)
			&& (pos.y < bottom);

	return isIn;
};

GuiCanvas.prototype.addJqueryAnimation = function(name, description) {
	this.jqueryAnimations = this.jqueryAnimations ? this.jqueryAnimations
			: new Object();
	this.jqueryAnimations[name] = description;
};

GuiCanvas.prototype.playJqueryAnimation = function(name, callback) {
	var desc = this.jqueryAnimations[name];
	assert(desc, "No animation found with name '" + name + "'");

	this.stopJqueryAnimation();
	var finalAnimationState = null;

	var that = this;

	var updateDisplay = function(that, action) {
		that.setPosition(action["x"] || that.x, action["y"] || that.y);
		if (action["display"]) {
			if (action["display"] === "hide") {
				that.hide();
			} else if (action["display"] === "show") {
				that.show();
			}
		}
		// that.setSize(action["width"] || that.width, action["height"]
		// || that.height);
	};

	for (var i = 0; i < desc.length; i++) {
		var actionDesc = desc[i];
		var action;
		if (action = actionDesc["animate"]) {
			var anim = new Object();
			$['each'](action["actions"], function(idx, params) {
				var param01 = params[0];
				var param02 = params[1];
				var param03 = params[2];

				if (param01 == "left" || param01 == "width") {
					param03 = (typeof (param03) == "number") ? Math
							.round(param03 * Screen.widthRatio()) : param03;
				} else if (param01 == "top" || param01 == "height") {
					param03 = (typeof (param03) == "number") ? Math
							.round(param03 * Screen.heightRatio()) : param03;
				}
				anim[param01] = param02 + param03.toString();
			});

			that.$()['animate'](anim, action["time"]);

		} else if (action = actionDesc["start"]) {
			var x = action["x"] != null ? action["x"] : that.x;
			var y = action["y"] != null ? action["y"] : that.y;
			that.setPosition(x, y);
			updateDisplay(that, action);
		} else if (action = actionDesc["final"]) {
			// force final params after all animations since
			// resize will call reset animation sequence or there's
			// can be option with animations disabled
			finalAnimationState = function() {
				var x = action["x"] != null ? action["x"] : that.x;
				var y = action["y"] != null ? action["y"] : that.y;
				that.setPosition(x, y);
				updateDisplay(that, action);
			};
		}
	}

	this.jqueryAnimationCallback = function() {
		if (finalAnimationState)
			finalAnimationState();
		if (callback)
			callback();
	};

	this.$()['queue']("fx", function() {
		that.jqueryAnimationCallback();
		that.jqueryAnimationCallback = null;
		that.jObject['stop'](true);
	});
};

GuiCanvas.prototype.stopJqueryAnimation = function() {
	if (!this.$()['is'](':animated')) {
		return;
	}
	this.$()['stop'](true);
	if (this.jqueryAnimationCallback) {
		this.jqueryAnimationCallback();
		this.jqueryAnimationCallback = null;
	}
};

/**
 * Return true if canvas elemnt is nit hiden
 * 
 * @returns {Boolean}
 */
GuiCanvas.prototype.isVisible = function() {
	return this.visible;
};

/**
 * Sets size of canvas element
 * 
 * @param width
 *            number or String percent
 * @param height
 *            number or String percent
 * @param noResize
 *            {Boolean} to disable resize in this function call
 */
GuiCanvas.prototype.setSize = function(width, height, noResize) {
	this.width = width;
	this.height = height;

	if (!noResize)
		this.resize();
	else
		this.setAwake(true);
};

/**
 * Changing width and height attr of canvas element
 * 
 * @param width
 *            {number}
 * @param height
 *            {number}
 */
GuiCanvas.prototype.setRealSize = function(width, height) {
	var size = Screen.calcRealSize(width, height);
	this.contex.canvas.width = size.x;
	this.contex.canvas.height = size.y;
	this.setAwake(true);
	// this.jObject['css']("width", size.x);
	// this.jObject['css']("height", size.y);
};

/**
 * Changing left and top attr of canvas element
 * 
 * @param x
 *            {number}
 * @param y
 *            {number}
 */
GuiCanvas.prototype.setRealPosition = function(x, y) {
	var pos = Screen.calcRealSize(x, y);
	this.jObject['css']("left", pos.x);
	this.jObject['css']("top", pos.y);
	this.setAwake(true);
};

/**
 * Total execution of size and positioning changes
 */
GuiCanvas.prototype.resize = function() {
	w = this.calcPercentageWidth(this.width);
	h = this.calcPercentageHeight(this.height);
	this.setRealSize(w, h);

	var offsetX = 0, offsetY = 0;
	if (typeof (this.offsetX) == "number") {
		offsetX = this.offsetX;
	}

	if (this.offsetY != null) {
		offsetY = this.offsetY;
	}

	x = this.calcPercentageWidth(this.x);
	y = this.calcPercentageHeight(this.y);

	this.setRealPosition(x + offsetX, y + offsetY);

	if (this.baseDiv) {
		this.baseDiv.setSize(this.width, this.height);
		this.baseDiv.setPosition(this.x, this.y);
		this.baseDiv.resize();
	}

	this.children.resize();
	this.setAwake(true);
};

/**
 * Disable resize with the chance to turn it on again
 * 
 * @param isTrue
 *            {Boolean}
 */
GuiCanvas.prototype.disableResize = function(isTrue) {
	if (this.originalResize == null) {
		this.originalResize = this.resize;
	}
	if (isTrue == false) {
		this.resize = this.originalResize;
	} else {
		this.resize = function() {
		};
	}
};

GuiCanvas.prototype.globalOffset = function() {
	var pos = this.jObject.offset();
	pos = Screen.calcLogicSize(pos.left, pos.top);

	return {
		x : pos.x,
		y : pos.y
	};
};

/**
 * Sets a new parent for the canvas element with the avaibility to save position
 * on the screen
 * 
 * @param newParent
 * @param saveGlobalPosition
 *            {Boolean}
 * @returns {Boolean}
 */
GuiCanvas.prototype.setParent = function(newParent, saveGlobalPosition) {
	// 'newParent' can be either string ID, JQuery object,
	// or object inherited of GuiCanvas
	var parent = null;
	var jParent = null;
	if (typeof newParent == "string") {
		jParent = $(newParent);
	} else if (newParent && typeof newParent == "object") {
		if (newParent['jquery']) {
			jParent = newParent;
		} else if (newParent.jObject && newParent.jObject.length > 0) {
			parent = newParent;
		}
	}
	// parent been represented as JQuery object
	if (jParent) {
		assert(jParent.length > 0, "Object id ='" + this.id
				+ "' has wrong parent: '" + newParent + "'");

		// check whether our parent already has GuiCanvas representation
		parent = jParent['data']("GuiCanvas");
		if (!parent) {
			parent = guiFactory.createObject("GuiCanvas", {
				"jObject" : jParent
			});
		}
	}

	if (parent) {
		var oldParent = this.parent;
		this.parent = parent;

		// recalculate entity x,y so it will
		// stay at the same place on the screen after the parent change
		if (oldParent && saveGlobalPosition) {
			var oldParentPos, newParentPos;

			oldParentPos = oldParent.globalOffset();
			newParentPos = parent.globalOffset();

			var left = oldParentPos.x - newParentPos.x;
			var top = oldParentPos.y - newParentPos.y;
			this.move(left, top);
		}

		if (this.jObject) {
			this.jObject['appendTo'](parent.jObject);
		}
		return true;
	} else {
		console.error("Can't attach object '" + this.id
				+ "' to parent that doesn't exists '" + newParent + "'");
		return false;
	}
};

/**
 * Destruction of the element and it's children
 */
GuiCanvas.prototype.remove = function() {

	Account.instance.removeRenderEntity(this);
	Account.instance.removeScheduledEntity(this);
	// console.log("Removing item with id %s, classname = %s", this.id,
	// this.className);
	if (this.tooltip) {
		this.tooltip.remove();
	}
	this.children.remove();
	this.jObject['remove']();
};

GuiCanvas.prototype.detach = function() {
	this.jObject['detach']();
};

/**
 * Adds entity to children of this GuiCanvas
 * 
 * @param entity
 * @param name
 */
GuiCanvas.prototype.addGui = function(entity, name) {
	this.children.addGui(entity, name);
	this.setAwake(true);
};

/**
 * Removes entity from children of this GuiCanvas
 * 
 * @param entity
 */
GuiCanvas.prototype.removeGui = function(entity) {
	this.children.removeGui(entity);
	this.setAwake(true);
};

/**
 * Returns entity with name if exists in children of this GuiCanvas
 * 
 * @param name
 */
GuiCanvas.prototype.getGui = function(name) {
	return this.children.getGui(name);
};

GuiCanvas.prototype.enableTouchEvents = function(push) {
	if (Device.isTouch()) {
		document.body.ontouchstart = function(e) {
			e.preventDefault();
			// if (levelStarted) {
			touchStartX = touchEndX = e.touches[0].pageX;
			touchStartY = touchEndY = e.touches[0].pageY;
			// } else {
			// touchStartX = touchEndX = null;
			// touchStartY = touchEndY = null;
			// }
			return false;
		};

		document.body.ontouchmove = function(e) {
			e.preventDefault();
			// if (levelStarted) {
			touchEndX = e.touches[0].pageX;
			touchEndY = e.touches[0].pageY;
			// }
			return false;
		};

		document.body.ontouchend = function(e) {
			e.preventDefault();
			if (touchEndX && touchEndY) {
				var e1 = {};
				e1.pageX = touchEndX;
				e1.pageY = touchEndY;
				push(e1);
			}
			return false;
		};
	} else {
		this.jObject['bind']("mousedown", push);
	}
};

/**
 * checks whether (x, y) in real global coords is inside element's bounds
 * 
 * @param x
 *            {number}
 * @param y
 *            {number}
 * @returns {Boolean}
 */
GuiCanvas.prototype.isPointInsideReal = function(x, y) {
	var pos = this.jObject.offset();
	var width = this.jObject.width();
	var height = this.jObject.height();
	if ((x > pos.left && x < (pos.left + width))
			&& (y > pos.top && y < (pos.top + height))) {
		return true;
	} else {
		return false;
	}
};

/**
 * Returns position of the event relatively this element
 * 
 * @param e
 * @returns Object { x, y }
 */
GuiCanvas.prototype.getEventPosition = function(e) {
	var pos = Device.getPositionFromEvent(e);
	var elementPos = this.jObject['offset']();
	var needed = {};
	needed.x = pos.x - elementPos.left;
	needed.y = pos.y - elementPos.top;
	var result = Screen.calcLogicSize(needed.x, needed.y);
	return result;
};

/**
 * Scheduled function to call continuosly, used to call render if enabled
 */
GuiCanvas.prototype.update = function() {
	// if (this.isEnabled()) {
	// this.render();
	// }
};

/**
 * Returns true if enabled
 * 
 * @returns {Boolean}
 */
GuiCanvas.prototype.isEnabled = function() {
	return this.enabled;
};

GuiCanvas.prototype.setAwake = function(awake) {
	var that = this;

	this.awake = true;
	if (this.awakeTimeout)
		clearTimeout(this.awakeTimeout);

	this.awakeTimeout = setTimeout(function() {
		that.awake = false;
	}, 500);
};

/**
 * Render of the canvas. draw the background and render children
 */
GuiCanvas.prototype.render = function() {
//	if (_PIXIJS) {
//		this.renderer.render(this.stage);
//	} else {
		if (!this.awake)
			return;
		var w = this.width * Screen.widthRatio();
		var h = this.height * Screen.heightRatio();
		if (this.terrainPattern) {
			this.contex.fillStyle = this.terrainPattern;
			this.contex.fillRect(0, 0, w, h);
		} else {
			this.contex.clearRect(0, 0, w, h);
		}

		this.children.render(this.contex);
//	}
};
DOM_MODE = false;


/**
 * GuiCSprite is a sprite for GuiCanvas (UltimateJS) based on GuiSprite.js but
 * not inherit from
 * 
 * @author Glukozavr
 * @date April-May 2014
 * @constructor
 */
function GuiCSprite() {
}

GuiCSprite.prototype.className = "GuiCSprite";

GuiCSprite.prototype.createInstance = function(params) {
	var entity = new GuiCSprite();
	entity.initialize(params);
	return entity;
};

guiFactory.addClass(GuiCSprite);

/**
 * Initial function to save and use incoming params
 * 
 * @param params
 *            may contain: - parent - width - height - image - offsetX - offsetY -
 *            x - y - z - hide - opacity - totalImage, - totalImageWidth, -
 *            totalImageHeight, - totalTile
 */
GuiCSprite.prototype.initialize = function(params) {
	var that = this;
	
	this.params = params;

	this.x = this.calcPercentageWidth(params.x||0);
	this.y = this.calcPercentageHeight(params.y||0);

	this.z = params.z||0;

	this.opacity = params.opacity?params.opacity:1;
	this.width = params.width;
	this.height = params.height;
	
	this.parent = params.parent.canvas?params.parent.canvas:params.parent;
	this.id = this.parent.generateId.call(this);
	
	this.total = {
		image :	params.totalImage,
		width : params.totalImageWidth,
		height : params.totalImageHeight,
		tile : params.totalTile
	};

	this.setOffset(params.offsetX, params.offsetY);

	this.setTransformOrigin(params.transformOrigin);

	this.img = Resources.getImageAsset(this.total.image, function(image) {
		init.call(that, image);
	});


	function init(image) {
//		if (_PIXIJS) {
//			that.pixiSprite = new PIXI.Sprite(new PIXI.Texture(new PIXI.BaseTexture (image), new PIXI.Rectangle(0, 0, that.width, that.height)), that.width, that.height);
//			that.parent.stage.addChild(that.pixiSprite);
//		}
		
		that.imageHeight = Math.round(that.height * image.height / that.total.height);
		that.imageWidth = Math.round(that.width * image.width / that.total.width);
		that.scale = {
				x : Math.round((that.width / that.imageWidth) * 100) / 100,
				y : Math.round((that.height / that.imageHeight) * 100) / 100
		};
		
		that.backgroundPosition = {
			x : 0,
			y : 0
		};
	
		that.backgroundSize = {
				w : that.total.width,
				h : that.total.height
		};
		
		that.rotate(0);
		
		that.resizeBackground();
		
		if (!that.params.hide)
			that.show();
		
		that.setEnabled(true);
		Account.instance.addScheduledEntity(that);
	}
	that.imageHeight = Math.round(that.height * that.img.height / that.total.height);
	that.imageWidth = Math.round(that.width * that.img.width / that.total.width);
	
	that.scale = {
			x : Math.round((that.width / that.imageWidth) * 100) / 100,
			y : Math.round((that.height / that.imageHeight) * 100) / 100
	};
	
	this.backgroundPosition = {
		x : 0,
		y : 0
	};

	this.backgroundSize = {
			w : this.total.width,
			h : this.total.height
	};
	
	this.currentAnimation = null;
	this.spatialAnimation = null;
	this.animations = new Object();
	
	if (params['spriteAnimations']) {
		$['each'](params['spriteAnimations'], function(name, value) {
			// console.log("Adding sprite animation " + name);
			that.addSpriteAnimation(name, value);
		});
	}
	
	this.frames = {};
	if(params['frames']){
		this.frames = params['frames']; 
	}

	if (this.parent.canvas) {
		this.parent.canvas.addGui(this);
	} else {
		this.parent.addGui(this);
	}
};


GuiCSprite.prototype.addSpriteAnimation = function(name, description) {
	this.animations[name] = {
		frames : description['frames'],
		row : description['row'],
		frameDuration : description['frameDuration'],
		spatial : description['spatial']
	};
};

GuiCSprite.prototype.addAnimation = function(animationName, frames, row,
		frameDuration) {
	this.animations[animationName] = {
		frames : frames,
		row : row,
		frameDuration : frameDuration
	};
};

// GuiCSprite.prototype.update = function(dt) {
// if (this.currentAnimation == null && this.spatialAnimation == null) {
// return;
// }
//
// var curTime = (new Date()).getTime();
// if (!dt) {
// dt = curTime - this.lastUpdateTime;
// }
// this.lastUpdateTime = curTime;
// this.currentFrameTime += dt;
//
// if (this.spatialAnimation !== null) {
// this.updateSpatialAnimation(dt);
// }
// while (this.currentFrameTime >= this.currentFrameLength) {
// var stopped = this.updateAnimation();
// if (stopped == true) {
// return;
// }
// this.currentFrameTime -= this.currentFrameLength;
// }
// };


GuiCSprite.prototype.isEnabled = function() {
	return this.enabled;
};

GuiCSprite.prototype.setEnabled = function(on) {
	if (on) {
		this.enabled = true;
	} else {
		this.enabled = false;
	}
};

GuiCSprite.prototype.updateSpatialAnimation = function(dt) {
	if (this.spatialAnimation == null) {
		return;
	}
	var part = dt / this.spatialAnimation.duration;
	if (this.spatialAnimation.timeLeft > dt) {
		this.move(this.spatialAnimation.dx * part, this.spatialAnimation.dy
				* part);
	} else {
		part = this.spatialAnimation.timeLeft / this.spatialAnimation.duration;
		this.move(this.spatialAnimation.dx * part, this.spatialAnimation.dy
				* part);
		if (this.spatialAnimation.callback) {
			this.spatialAnimation.callback();
		}
		this.spatialAnimation = null;
	}
	if (this.spatialAnimation) {
		this.spatialAnimation.timeLeft -= dt;
	}
};

GuiCSprite.prototype.updateAnimation = function() {
	if (this.currentAnimation == null)
		return;
	if (this.currentFrame >= this.animations[this.currentAnimation].frames.length) {
		this.currentFrame = 0;
		if (!this.looped) {
			this.stopAnimation();
			return true;
		}
	}
	
	

	var rowFramesLength = Math.round(this.total.width / this.width);
	var frame = this.animations[this.currentAnimation].frames[this.currentFrame];
	
	if(this.frames[frame]){
		var frm = this.frames[frame]; 
		this.changeBackgroundPosition(frm.x, frm.y);
	}else{
		var remainder = frame % rowFramesLength;
		var q = (frame - remainder) / rowFramesLength;
		var row = this.animations[this.currentAnimation].row + q;
		frame = remainder;

		this.changeBackgroundPosition(frame, row);
		this.frame = frame;
		this.row = row;
	}
	
	if (this.frameCallback != null) {
		if (this.frameCallback[this.currentAnimation]) {
			this.frameCallback[this.currentAnimation](this.currentFrame);
		}
	}
	this.currentFrame++;
};

GuiCSprite.prototype.move = function(dx, dy) {
	this.x += dx;
	this.y += dy;
	this.parent.setAwake(true);
};

GuiCSprite.prototype.stopAnimation = function(dontCallCallback) {
	clearInterval(this.updateAnimationCallback);
	this.updateAnimationCallback = null;
	this.currentAnimation = null;
	// this.frameCallback = null;
	if (!dontCallCallback && this.animationEndCallback) {
		// trick with oldCallback is to allow to call setCallback
		// inside callback itself
		var oldCallback = this.animationEndCallback;
		this.animationEndCallback = null;
		oldCallback.call(this);
	}
};

GuiCSprite.prototype.changeBackgroundPosition = function(x, y) {
	this.backgroundPosition.x = x;
	this.backgroundPosition.y = y;
	this.parent.setAwake(true);
};

GuiCSprite.prototype.setFrameCallback = function(frameCallback) {
	this.frameCallback = frameCallback;
};

GuiCSprite.prototype.setAnimationEndCallback = function(animationEndCallback) {
	this.animationEndCallback = animationEndCallback;
};

GuiCSprite.prototype.playAnimation = function(animationName, duration, isLooped,
		independentUpdate) {

	var animation = this.animations[animationName];
	assert(animation, "No such animation: " + animationName);

	this.stopAnimation(true);

	this.currentAnimation = animationName;

	this.lastAnimation = animationName;

	var that = this;
	this.currentFrame = 0;
	this.currentFrameTime = 0;
	this.lastUpdateTime = (new Date()).getTime();

	// console.log(this.animations[this.currentAnimation].frameDuration);
	if (duration) {
		this.currentFrameLength = duration / animation.frames.length;
		// console.log("frame lenght " + this.currentFrameLength + ", " +
		// animation.frames.length);
	} else {
		this.currentFrameLength = this.animations[this.currentAnimation].frameDuration;
	}
	this.looped = isLooped;

	if (independentUpdate) {
		this.updateAnimationCallback = setInterval(function() {
			that.updateAnimation();
		}, this.currentFrameLength);
	}
	this.updateAnimation();
};

GuiCSprite.prototype.isPlayingAnimation = function(animationName) {
	return this.currentAnimation == animationName;
};

GuiCSprite.prototype.flip = function(needToBeFlipped) {
	this.flipped = needToBeFlipped;
	this.parent.setAwake(true);
};

GuiCSprite.prototype.transform = function(transfromations) {
	if (transfromations) {
		if (transfromations.matrix != null)
			this.matrix = transfromations.matrix;
		if (transfromations.angle != null)
			this.angle = transfromations.angle;
		if (transfromations.scale != null)
			this.scale = transfromations.scale;
		if (transfromations.translate != null)
			this.translate = transfromations.translate;
	}
	var scaleY = selectValue(this.scale, 1);
	var scaleX = scaleY;
	scaleX *= (this.flipped ? -1 : 1);
	this.parent.setAwake(true);
};

GuiCSprite.prototype.rotate = function(angle) {
	this.angle = angle;
	this.parent.setAwake(true);
};

GuiCSprite.prototype.setTransformOrigin = function(transformOrigin) {
	this.transformOrigin = {
            x : (transformOrigin && !isNaN(transformOrigin.x))?(Math.round(transformOrigin.x * 100) / 100):0.5,
            y : (transformOrigin && !isNaN(transformOrigin.x))?(Math.round(transformOrigin.y * 100) / 100):0.5
        };
	this.parent.setAwake(true);
};

GuiCSprite.prototype.setPosition = function(x, y) {
	this.x = this.calcPercentageWidth(x);
	this.y = this.calcPercentageHeight(y);
	this.parent.setAwake(true);
};

GuiCSprite.prototype.setOffset = function(x, y) {
	this.offsetX = this.calcPercentageWidth(x||0);
	this.offsetY = this.calcPercentageHeight(y||0);
	this.parent.setAwake(true);
};

GuiCSprite.prototype.setRealPosition = function(x, y) {
};

GuiCSprite.prototype.setTransform = function(matrix) {
// this.angle = angle;
	this.matrix = matrix;
};

GuiCSprite.prototype.resize = function() {
	
// this.parent.render();
};

GuiCSprite.prototype.setRealBackgroundPosition = function(offsetX, offsetY) {
	if (offsetY) {
		this.offsetY1 = offsetY;
	}
	if (offsetX) {
		this.offsetX1 = offsetX;
	}
	var frame = selectValue(this.frame, 0);
	var row = selectValue(this.row, 0);
	this.changeBackgroundPosition(-frame, row);
	this.parent.setAwake(true);
};

GuiCSprite.prototype.resizeBackground = function() {
};

GuiCSprite.prototype.calcPercentageWidth = function(val) {
	if (typeof (val) == "string" && val.indexOf("%") > -1) {
		var parentWidth = this.parent.jObject.width() / Screen.widthRatio();
		assert(typeof (parentWidth) == "number",
				"Wrong parent or value for % param name='" + this.name + "'");
		val = (parseFloat(val.replace("%", "")) * parentWidth / 100.0);
	}
	return val;
};

GuiCSprite.prototype.calcPercentageHeight = function(val) {
	if (typeof (val) == "string" && val.indexOf("%") > -1) {
		var parentHeight = this.parent.jObject.height() / Screen.heightRatio();
		assert(typeof (parentHeight) == "number",
				"Wrong parent or value for % param name='" + this.name + "'");
		val = (parseFloat(val.replace("%", "")) * parentHeight / 100.0);
	}
	return val;
};

GuiCSprite.prototype.setZ = function(z) {
};

GuiCSprite.prototype.remove = function() {
	Account.instance.removeScheduledEntity(this);
};

GuiCSprite.prototype.hide = function() {
	this.visible = false;
	this.parent.setAwake(true);
};

GuiCSprite.prototype.show = function() {
	this.visible = true;
	this.parent.setAwake(true);
};

GuiCSprite.prototype.clampByParentViewport = function() {
};

GuiCSprite.prototype.fadeTo = function(fadeValue, time, callback, changeVisibility) {
// var that = this;

	var fadeAnimation = {};

	fadeAnimation.start = this.opacity;
	fadeAnimation.end = fadeValue>0?(fadeValue<1?fadeValue:1):0;
	
	fadeAnimation.dO = fadeAnimation.end - fadeAnimation.start;

	fadeAnimation.time = time>0?time:500;
	fadeAnimation.speed = Math.abs(fadeAnimation.dO/fadeAnimation.time);

	fadeAnimation.callback = callback;
	fadeAnimation.changeVisibility = changeVisibility;
	
	fadeAnimation.norm = fadeAnimation.dO/Math.abs(fadeAnimation.dO);
	
	this.fadeAnimation = fadeAnimation;
	
	this.fading = true;
};

GuiCSprite.prototype.fade = function(dt) {
	
	var step = this.fadeAnimation.speed * dt * this.fadeAnimation.norm;
	var next = this.opacity + step;
	if ((this.fadeAnimation.end - next)*this.fadeAnimation.norm/Math.abs(this.fadeAnimation.norm) > 0) {
		this.setOpacity(next);
	} else {
		this.fading = false;
		this.setOpacity(this.fadeAnimation.end);
		if (this.fadeAnimation.callback)
			this.fadeAnimation.callback();
		if (this.fadeAnimation.changeVisibility)
			this.hide();
	}
	
};

GuiCSprite.prototype.update = function(dt) {
//	this.convertToPixi();
	
	if (this.fading) {
		this.fade(dt);
	}
};

GuiCSprite.prototype.setOpacity = function(opacity) {
	if (opacity>=0 || opacity<=1) {
		this.opacity = opacity;
	}
};

GuiCSprite.prototype.convertToPixi = function() {
	if (_PIXIJS) {
		this.pixiSprite.alpha = this.opacity;
		this.pixiSprite.visible = this.visible; 
		this.pixiSprite.x = Math.round((this.x + this.parent.guiOffsetX + this.offsetX)*Screen.widthRatio());
		this.pixiSprite.y =  Math.round((this.y + this.parent.guiOffsetY + this.offsetY)*Screen.heightRatio()); 
		this.pixiSprite.rotation = MathUtils.toRad(Math.round(this.angle));
		this.pixiSprite.width = this.width;// * Screen.widthRatio(); 
		this.pixiSprite.height = this.height;// * Screen.heightRatio(); 
		this.pixiSprite.tilePosition  = new PIXI.Point(this.transformOrigin.x, this.transformOrigin.y);
		this.pixiSprite.scale = new PIXI.Point(Screen.widthRatio() * this.scale.x, Screen.heightRatio() * this.scale.y);
//		this.pixiSprite.tileScale = new PIXI.Point(this.scale.x, this.scale.y); 
		this.pixiSprite.tilePosition = new PIXI.Point(this.backgroundPosition.x /** Screen.widthRatio()*/ * this.width, this.backgroundPosition.y * this.height);// * Screen.heightRatio()); 
	}
};


GuiCSprite.prototype.render = function(ctx) {
//	if (_PIXIJS) {
			
//	} else {
		if (!this.visible) 
			return;
		var scrnRatio = {
				x : Screen.widthRatio(),
				y : Screen.heightRatio()
		};

		var x = Math.round((this.x + this.parent.guiOffsetX + this.offsetX)*scrnRatio.x);
	    var y =  Math.round((this.y + this.parent.guiOffsetY + this.offsetY)*scrnRatio.y);
	    var w = Math.ceil(this.width*scrnRatio.x);// this.imageWidth;//
	    var h =  Math.ceil(this.height*scrnRatio.y);// this.imageHeight;//
		var bx = Math.ceil(this.backgroundPosition.x * this.imageWidth);
		var by = Math.ceil(this.backgroundPosition.y * this.imageHeight);
		
	    var ratio = {
	        x : this.transformOrigin.x,
	        y : this.transformOrigin.y
	    };
		
	    var translate = {
	    		x: Math.round((x+w*ratio.x)),
	    		y: Math.round((y+h*ratio.y))
	    };
	    var rot = MathUtils.toRad(Math.round(this.angle));
	    rot = rot.toFixed(3)*1;
		ctx.translate(translate.x, translate.y);
		ctx.rotate(rot); 
		ctx.globalAlpha = this.opacity;
		
	// ctx.scale(this.scale.x, this.scale.y);

		var sizeX = Math.ceil(this.imageWidth);
		var sizeY = Math.ceil(this.imageHeight);
		var offsetX = -Math.ceil(w*ratio.x);
		var offsetY = -Math.ceil(h*ratio.y);
		
		if (bx+sizeX <= this.img.width && by+sizeY <= this.img.height)
		    ctx.drawImage(this.img,
				    bx, by,
				    sizeX, sizeY,
		            offsetX, offsetY,
		            w, h);
		else 
			console.warn('Shit is happining. Again. Source rect is out of image bounds');
//	}
	
};
/**
 * Main.js
 */

var SCORE = null;
var GUI_SPRITE_IMAGES_FROM_RESOURCES = true;
var GUISPRITE_HACK_ON = true;

// Entry point of the game
function startTheGame() {
    Device.init({'name': "FootballTricks"});
    // Creating account a singleton
    (new CannonsAndSoldiersAccount()).init();
    Resources.init();

    // info about levels and scores
    try {
        SCORE = JSON.parse(Device.getStorageItem("scores", {}));
        $['each'](SCORE, function(id, score) {
            score *= 1;
        });
    } catch (e) {
        SCORE = {};
    }

    // IMAGES
    Resources.addResolution("low", "images/low/");
    Resources.addResolution("normal", "images/", true);

    // Language
    Resources.setLanguage("EN");

    // Switch resolution if running on slow device
    if (Device.isSlow()) {
        Resources.setResolution("low");
        // turn off sound on slow iPhones by default
        if(Device.isAppleMobile()) {
            Sound.TURNED_OFF_BY_DEFAULT = true;
        }
    }

    Screen.init(Account.instance, true);

    Account.instance.readGlobalUpdate(Account.instance.states["MenuState01"]);
}

if (window.attachEvent) {
	window.attachEvent("onload", startTheGame);
} else {
	window.addEventListener("load", startTheGame, true);
}/**
 * @constructor
 */
function CannonsAndSoldiersAccount(parent) {
    CannonsAndSoldiersAccount.parent.constructor.call(this);
}

CannonsAndSoldiersAccount.inheritsFrom(Account);
CannonsAndSoldiersAccount.prototype.className = "CannonsAndSoldiersAccount";

CannonsAndSoldiersAccount.prototype.init = function () {
    var params = {
        backgroundState : {
            "background" : {
                "image" : "images/bg.jpg"
            },
    		"transparent" : true
        }
    };
    CannonsAndSoldiersAccount.parent.init.call(this, params);
    var spain = new Country("Spain", "ESP", ColorRgb.Colors.RED, ColorRgb.Colors.BLUE);
    var germany = new Country("Germany", "DEU", ColorRgb.Colors.WHITE, ColorRgb.Colors.BLACK);
    var portugal = new Country("Portugal", "PRT", ColorRgb.Colors.RED, ColorRgb.Colors.RED);
    var colombia = new Country("Colombia", "COL", ColorRgb.Colors.YELLOW, ColorRgb.Colors.WHITE);
    var uruguay = new Country("Uruguay", "URY", new ColorRgb(135, 206, 250), ColorRgb.Colors.BLACK);
    var argentina = new Country("Argentina", "ARG", new ColorRgb(175, 238, 238), ColorRgb.Colors.BLACK);
    var brazil = new Country("Brazil", "BRA", ColorRgb.Colors.YELLOW, ColorRgb.Colors.BLUE);
    var switzerland = new Country("Switzerland", "CHE", ColorRgb.Colors.RED, ColorRgb.Colors.WHITE);
    var italy = new Country("Italy", "ITA", ColorRgb.Colors.BLUE, ColorRgb.Colors.WHITE);
    var greece = new Country("Greece", "GRC", ColorRgb.Colors.BLUE, ColorRgb.Colors.BLUE);
    var england = new Country("England", "ENG", ColorRgb.Colors.WHITE, ColorRgb.Colors.WHITE);
    this.countries = [
        spain, germany, portugal, brazil, colombia, uruguay, argentina, switzerland, italy, greece, england,
        new Country("Belgium", "BEL", ColorRgb.Colors.RED, ColorRgb.Colors.GRAY), new Country("Chile", "CHL", ColorRgb.Colors.WHITE, ColorRgb.Colors.GRAY),
        new Country("USA", "USA", ColorRgb.Colors.BLUE, ColorRgb.Colors.BLUE), new Country("Netherlands", "NLD", new ColorRgb(255, 140, 0), new ColorRgb(255, 140, 0)),
        new Country("France", "FRA", ColorRgb.Colors.BLUE, ColorRgb.Colors.WHITE), new Country("Ukraine", "UKR", ColorRgb.Colors.YELLOW, ColorRgb.Colors.YELLOW),
        new Country("Russia", "RUS", ColorRgb.Colors.RED, ColorRgb.Colors.RED), new Country("Mexico", "MEX", ColorRgb.Colors.GREEN, ColorRgb.Colors.WHITE),
        new Country("Croatia", "HRV", ColorRgb.Colors.RED, ColorRgb.Colors.WHITE), new Country("Cote", "CIV", new ColorRgb(255, 140, 0), new ColorRgb(255, 140, 0)),
        new Country("Scotland", "SCO", ColorRgb.Colors.BLUE, ColorRgb.Colors.WHITE), new Country("Denmark", "DNK", ColorRgb.Colors.RED, ColorRgb.Colors.WHITE),
        new Country("Egypt", "EGY", ColorRgb.Colors.WHITE, ColorRgb.Colors.WHITE),  new Country("Bosn. & Herz."/*"Bosnia & Herzegovina"*/, "BIH", ColorRgb.Colors.BLUE, ColorRgb.Colors.WHITE),
        new Country("Sweden", "SWE", ColorRgb.Colors.YELLOW, ColorRgb.Colors.BLUE),
        new Country("Algeria", "DZA", new ColorRgb(0, 255, 127), new ColorRgb(0, 255, 127)),
        new Country("Ecuador", "ECU", ColorRgb.Colors.YELLOW, ColorRgb.Colors.BLUE),
        new Country("Slovenia", "SVN", ColorRgb.Colors.WHITE, ColorRgb.Colors.WHITE),
        new Country("Serbia", "SRB", ColorRgb.Colors.RED, ColorRgb.Colors.BLUE),
        new Country("Honduras", "HND", ColorRgb.Colors.WHITE, ColorRgb.Colors.WHITE),
        new Country("Romania", "ROM", ColorRgb.Colors.YELLOW, ColorRgb.Colors.YELLOW),
        new Country("Armenia", "ARM", ColorRgb.Colors.RED, ColorRgb.Colors.RED),
        new Country("Costa Rica", "CRI", ColorRgb.Colors.RED, ColorRgb.Colors.NAVY),
        new Country("Panama", "PAN", ColorRgb.Colors.RED, ColorRgb.Colors.RED),
        new Country("Czech Republic", "CZE", ColorRgb.Colors.RED, ColorRgb.Colors.WHITE),
        new Country("Iran", "IRN", ColorRgb.Colors.WHITE, ColorRgb.Colors.WHITE),
        new Country("Ghana", "GHA", ColorRgb.Colors.WHITE, ColorRgb.Colors.WHITE),
        new Country("Australia", "AUS", ColorRgb.Colors.YELLOW, ColorRgb.Colors.GREEN),
        new Country("Cameroon", "CMR", ColorRgb.Colors.GREEN, ColorRgb.Colors.RED),
        new Country("Japan", "JPN", ColorRgb.Colors.NAVY, ColorRgb.Colors.NAVY),
        new Country("Nigeria", "NGA", new ColorRgb(0, 255, 127), new ColorRgb(0, 255, 127)),
        new Country("South Korea", "KOR", ColorRgb.Colors.WHITE, ColorRgb.Colors.WHITE),
        new Country("China", "CHN", ColorRgb.Colors.RED, ColorRgb.Colors.RED)
        /* new Country("Afghanistan"), new Country("African Union"),
         new Country("Albania"), new Country("American Samoa"), new Country("Andorra"), new Country("Angola"), new Country("Anguilla"), new Country("Antarctica"), new Country("Antigua & Barbuda"),
         new Country("Arab League"), new Country("Aruba"), new Country("Austria"), new Country("Azerbaijan"), new Country("Bahamas"), new Country("Bahrain"),
         new Country("Bangladesh"), new Country("Barbados"), new Country("Belarus"), new Country("Belize"), new Country("Benin"), new Country("Bermuda"), new Country("Bhutan"), new Country("Bolivia"),
         new Country("Botswana"), new Country("Brunei"), new Country("Bulgaria"), new Country("Burkina Faso"), new Country("Burundi"), new Country("Cambodja"),
         new Country("Canada"), new Country("Cape Verde"), new Country("CARICOM"), new Country("Cayman Islands"), new Country("Central African Republic"), new Country("Chad"),
         new Country("Commonwealth"), new Country("Comoros"), new Country("Congo-Brazzaville"), new Country("Congo-Kinshasa"), new Country("Cook Islands"),
         new Country("Cuba"), new Country("Cyprus"),
         new Country("Djibouti"), new Country("Dominica"), new Country("Dominican Republic"), new Country("El Salvador"),
         new Country("Equatorial Guinea"), new Country("Eritrea"), new Country("Estonia"), new Country("Ethiopia"), new Country("European Union"), new Country("Faroes"), new Country("Fiji"),
         new Country("Finland"), new Country("Gabon"), new Country("Gambia"), new Country("Georgia"), new Country("Gibraltar"),
         new Country("Greenland"), new Country("Grenada"), new Country("Guadeloupe"), new Country("Guam"), new Country("Guatemala"), new Country("Guernsey"), new Country("Guinea"), new Country("Guinea-Bissau"),
         new Country("Guyana"), new Country("Haiti"), new Country("Hong Kong"), new Country("Hungary"), new Country("Iceland"), new Country("India"), new Country("Indonezia"), new Country("Iraq"),
         new Country("Ireland"), new Country("Islamic Conference"), new Country("Isle of Man"), new Country("Israel"), new Country("Jamaica"), new Country("Jersey"), new Country("Jordan"),
         new Country("Kazakhstan"), new Country("Kenya"), new Country("Kiribati"), new Country("Kosovo"), new Country("Kuwait"), new Country("Kyrgyzstan"), new Country("Laos"), new Country("Latvia"), new Country("Lebanon"), new Country("Lesotho"),
         new Country("Liberia"), new Country("Libya"), new Country("Liechtenshein"), new Country("Lithuania"), new Country("Luxembourg"), new Country("Macao"), new Country("Macedonia"), new Country("Madagascar"), new Country("Malawi"),
         new Country("Malaysia"), new Country("Maldives"), new Country("Mali"), new Country("Malta"), new Country("Marshall Islands"), new Country("Martinique"), new Country("Mauritania"), new Country("Mauritius"),
         new Country("Micronesia"), new Country("Moldova"), new Country("Monaco"), new Country("Mongolia"), new Country("Montenegro"), new Country("Montserrat"), new Country("Morocco"), new Country("Mozambique"), new Country("Myanmar"),
         new Country("Namibia"), new Country("Nauru"), new Country("Nepal"), new Country("Netherlands Antilles"), new Country("New Caledonia"), new Country("New Zealand"), new Country("Nicaragua"),
         new Country("Niger"), new Country("North Korea"), new Country("Northern Cyprus"), new Country("Northern Ireland"), new Country("Norway"), new Country("Olimpic Movement"), new Country("Oman"),
         new Country("OPEC"), new Country("Pakistan"), new Country("Palau"), new Country("Palestine"), new Country("Panama"), new Country("Papua New Guinea"), new Country("Paraguay"), new Country("Peru"), new Country("Philippines"),
         new Country("Poland"), new Country("Puerto Rico"), new Country("Qatar"), new Country("Red Cross"), new Country("Reunion"), new Country("Rwanda"), new Country("Saint Lucia"),
         new Country("Samoa"), new Country("San Marino"), new Country("Sao Tome & Principe"), new Country("Saudi Arabia"), new Country("Senegal"), new Country("Seychelles"),
         new Country("Sierra Leone"), new Country("Singapore"), new Country("Slovakia"), new Country("Solomon Islands"), new Country("Somalia"), new Country("Somaliland"), new Country("South Africa"),
         new Country("Sri Lanka"), new Country("St Kitts & Nevis"), new Country("St Vincent & the Grenadines"), new Country("Sudan"), new Country("Suriname"),
         new Country("Switzerland"), new Country("Syria"), new Country("Tahiti"), new Country("Taiwan"), new Country("Tajikistan"), new Country("Tanzania"), new Country("Thailand"),
         new Country("Timor-Leste"), new Country("Togo"), new Country("Tonga"), new Country("Trinidad & Tobago"), new Country("Tunisia"), new Country("Turkey"), new Country("Turkmenistan"),
         new Country("Turks and Caicos Islands"), new Country("Tuvalu"), new Country("Uganda"), new Country("United Arab Emirates"), new Country("United Kingdom"),
         new Country("Uzbekistan"), new Country("Vanutau"), new Country("Vatican City"), new Country("Venezuela"), new Country("Viet Nam"), new Country("Virgin Islands British"),
         new Country("Virgin Islands US"), new Country("Wales"), new Country("Western Sahara"), new Country("Yemen"), new Country("Zambia"), new Country("Zimbabwe")*/
    ]
    ;
    this.topCountries = [spain, germany, portugal, colombia, uruguay, argentina, brazil, switzerland, italy, greece, england];

    this.currentFlag = Device.getStorageItem("Flag", -1);
    this.usedFlags = JSON.parse(Device.getStorageItem("usedFlags", "[]")); //flags, used in current level menu, saved until restart

    this.states = new Object();

    this.states["MenuState01"] = {
        "MenuState01": {
            "class": MenuState.prototype.className,
            "parent": "Account01",
            "children": {}
        }
    };

    this.states["LevelMenuState01"] = {
        "LevelMenuState01": {
            "class": LevelMenuState.prototype.className,
            "parent": "Account01",
            "children": {}
        }
    };

    this.states["CountrySelectMenuState01"] = {
        "CountrySelectMenuState01": {
            "class": CountrySelectMenuState.prototype.className,
            "parent": "Account01",
            "children": {}
        }
    };

    this.states["GameState01"] = {
        "GameState01": {
            "class": GameState.prototype.className,
            "parent": "Account01",
            "scene": "Scene01",
            "children": {}
        }
    };

    Account.instance = this;
    
    var logo = guiFactory.createObject("GuiDiv", {
		"parent" : this.backgroundState.mask,
		"background": {
			"image" : "images/icon114x114alpha.png"
		},
		"style" : "dialog",
		"width" : 114,
		"height" : 114,
		"x" : "50%",
		"y" : "50%",
		"offsetY" : -70,
		"offsetX" : -57,
		"hide" : true
	});
	
	var text = guiFactory.createObject("GuiLabel", {
		"parent" : this.backgroundState.mask,
		"style" : "gameButton bowl-white",
		"text" : Resources.getString("loading") + "...",
		"fontSize" : 35,
		"y" : "50%",
		"x" : "50%",
		"width" : 500, 
		"height" : 50,
		"offsetX" : -250,
		"offsetY" : 90,
		"align" : "center",
		"hide" : true
	});

	this.backgroundState.addGui(logo);
	this.backgroundState.addGui(text);
	
	this.backgroundState.textLogo = text;
	
	this.turnOnMaskLogo = function(on) {
		if (!!on) {
			logo.show();
			text.show();
		} else {
			logo.hide();
			text.hide();
		}
	};
};

CannonsAndSoldiersAccount.prototype.switchState = function (stateName, id, parentId, noFadeIn, divToHide) {
    var that = this;
    var actualSwitch = function () {
        var data = new Object();
        $.each(Account.instance.states, function (key, value) {
            if (key === stateName) {
                data = Account.instance.states[key];
                data[key]["parent"] = parentId;
                data[id] = {
                    "destroy": true
                };
                that.readGlobalUpdate(data);
            }
        });
    };
    if (divToHide && divToHide.hide) {
//    	setTimeout(function(){
    	divToHide.fadeTo(0, LEVEL_FADE_TIME, function(){
    		divToHide.hide();
    	});
//    		divToHide.hide();
//    	},LEVEL_FADE_TIME);
	}
    if (!noFadeIn) {
        this.backgroundState.fadeIn(LEVEL_FADE_TIME, "#0d5600", actualSwitch);
    } else {
        actualSwitch();
    }
};

/**
 *
 * @param {string} name
 * @param {string} shirtColor
 * @param {ColorRgb} shortName
 * @param {ColorRgb} pantsColor
 * @constructor
 */
function Country(name, shortName, shirtColor, pantsColor) {
    this.name = name;
    this.shortName = shortName;
    this.shirtColor = shirtColor != null ? shirtColor : ColorRgb.Colors.WHITE;
    this.pantsColor = pantsColor != null ? pantsColor : ColorRgb.Colors.SILVER;
}

Country.prototype.getShortName = function () {
    return this.shortName != null ? this.shortName : this.name.substr(0, 3);
};var LVL_MENU_GUI_JSON = "resources/ui/LevelMenu.json";
var LEVEL_DESCRIPTION = "resources/levels/";
var LEVEL_ORDER = "resources/levelOrder.json";

var REPLY = false;
var LVL_INDEX = 0;
var LAST_LEVEL = 33; // TODO: check value
var LAST_UNLOCKED = 0;

/**
 * Level Menu State represents levels select menu with buttons
 * to select the level
 * @constructor
 */
function LevelMenuState() {
    this.preloadJson(LVL_MENU_GUI_JSON);
    this.preloadJson(LEVEL_ORDER);
    this.preloadJson(LEVEL_ORDER);
    LevelMenuState.parent.constructor.call(this);
};

LevelMenuState.inheritsFrom(BaseState);

LevelMenuState.prototype.className = "LevelMenuState";
LevelMenuState.prototype.createInstance = function (params) {
    var entity = new LevelMenuState();
    entity.activate(params);
    return entity;
};
entityFactory.addClass(LevelMenuState);

LevelMenuState.prototype.jsonPreloadComplete = function () {
    LevelMenuState.parent.jsonPreloadComplete.call(this);
};

LevelMenuState.prototype.init = function (params) {
    LevelMenuState.parent.init.call(this, params);
    var that = this;
    this.sliding = false;
    if (REPLY) {
    	this.goToGameState();
        return;
    } else {
        guiFactory.createGuiFromJson(this.resources.json[LVL_MENU_GUI_JSON], this);
        var levelOrder = this.resources.json[LEVEL_ORDER];
        Account.instance.levelOrder = levelOrder;
        var countriesSheet = Account.instance.countriesSheet;
        var countryIndex = 0;
        var screen = this.getGui("slideContainer");
        screen.setZ(-1);

        // Adds and binds level select buttons
        var levelButtons = [];
        var levelFlags = [];

        function generateFlag() {
            var flg = Math.floor(Math.random() * Account.instance.countries.length);
            if ((flg == Account.instance.currentFlag) || (Account.instance.usedFlags.indexOf(flg) != -1) ||
                (Account.instance.topCountries.indexOf(Account.instance.countries[flg]) != -1)) {
                return -1;
            } else {
                Account.instance.usedFlags.push(flg);
                return flg;
            }
        }

        function generateTopFlag() {
            var flg = Math.floor(Math.random() * Account.instance.topCountries.length);
            flg = Account.instance.countries.indexOf(Account.instance.topCountries[flg]);
            if ((flg == Account.instance.currentFlag) || (Account.instance.usedFlags.indexOf(flg) != -1)) {
                return -1;
            } else {
                Account.instance.usedFlags.push(flg);
                return flg;
            }
        }

        function setFlags() {
            if (Account.instance.usedFlags.length === 0) {
                for (var i = 0; i < 12; i++) {
                    var indx = -1;
                    if (i > 7) { // generate top countries in play-off round
                        do {
                            indx = generateTopFlag();
                        } while (indx == -1);
                    } else {
                        do {
                            indx = generateFlag();
                        } while (indx == -1);
                    }
                }
            }
            Device.setStorageItem("usedFlags", JSON.stringify(Account.instance.usedFlags));
        }

        setFlags();

        function createLevelBase(x, y, name) {
            var guiDiv = guiFactory.createObject(
                "GuiDiv",
                {
                    "parent": screen,
                    "background": {
                        "image": "FinalArt/Menu/LevelSelect/LevelBase_A.png"
                    },
                    "style": "gameButton",
                    "width": 562,
                    "height": 60,
                    "x": x,
                    "y": y

                }
            );
            that.getGui("menuContainer").addGui(guiDiv, name);
            return guiDiv;
        }

        /**
         *
         * @param parent levelBaseContainer
         */
        function createCountryFlag(parent) {
            //levelFlags
            var country = Account.instance.countries[Account.instance.usedFlags[countryIndex]];
            var frame = countriesSheet.frames[country.name + ".png"].frame;
            var countryFlag = guiFactory.createObject(
                "GuiDiv", {
                    "parent": parent,
                    "background": {
                        "image": "FinalArt/" + countriesSheet.meta.image,
                        "width": countriesSheet.meta.size.w,
                        "height": countriesSheet.meta.size.h,
                        //css background-position
                        "frameX": -frame.x,
                        "frameY": -frame.y
                    },
                    "style": "gameButton",
                    "width": frame.w,
                    "height": frame.h,
                    "x": 45,
                    "y": 12
                });
            parent.addGui(countryFlag, levelFlags.length);

            var countryLabel = guiFactory.createObject(
                "GuiLabel", {
                    "parent": parent,
                    "style": "gameButton bowl-normal",
                    "width": 100,
                    "height": 40,
                    "x": 102,
                    "y": 19,
                    "text": country.getShortName(),
                    "fontSize": 24
                });
            parent.addGui(countryLabel, "label" + levelFlags.length);
            levelFlags.push(countryFlag);
            countryIndex++;
        }

        function createLevelButton(x, parent) {
            var unlocked = (SCORE['level_' + (levelButtons.length - 1)] > 0) || (levelButtons.length == 0);
            var guiButton;
            if (unlocked) {
                if (!SCORE['level_' + (levelButtons.length)]) {
                    var highlight = guiFactory.createObject(
                        "GuiDiv",
                        {
                            "parent": parent,
                            "style": "gameButton",
                            "background": {
                                "image": "FinalArt/Menu/LevelSelect/LastLevel.png"
                            },
                            "width": 86,
                            "height": 65,
                            "x": x - 7,
                            "y": -2
                        }
                    );
                    parent.addGui(highlight);
                }
                guiButton = guiFactory.createObject(
                    "GuiButton",
                    {
                        "parent": parent,
                        "normal": {
                            "label": {
                                "style": "gameButton bowl-white-unboredered",
                                "text": levelButtons.length + 1,
                                "fontSize": 24,
                                "y": "55%",
                                "x": "45%"
                            }
                        },
                        "hover": {
                            "scale": 115,
                            "label": {
                                "style": "gameButton bowl-white-unboredered",
                                "text": levelButtons.length + 1,
                                "fontSize": 30,
                                "color": "#01B5FF",
                                "z": 12
                            }
                        },
                        "style": "gameButton",
                        "width": 70,
                        "height": 70,
                        "x": x,
                        "y": -8,
                        "unlocked": true
                    });
                var stars = SCORE['level_' + levelButtons.length + "Stars"];
                for (var i = 0; i < 3; i++) {
                    var star = guiFactory.createObject(
                        "GuiDiv",
                        {
                            "parent": guiButton,
                            "background": {
                                "image": "FinalArt/Menu/LevelSelect/" + (i < stars ? "TwinkleFull.png" : "TwinkleEmpty.png")
                            },
                            "style": "gameButton",
                            "width": 21,
                            "height": 21,
                            "x": 60,
                            "y": 20 * i + 7
                        }
                    );
                    guiButton.addGui(star, i);
                }
            } else {
                guiButton = guiFactory.createObject(
                    "GuiButton",
                    {
                        "parent": parent,
                        "normal": {
                            "image": "FinalArt/Lock.png"
                        },
                        "hover": {
                            "image": "FinalArt/Lock.png",
                            "scale": 115
                        },
                        "style": "gameButton",
                        "width": 26,
                        "height": 34,
                        "x": x + 21,
                        "y": 12,
                        "unlocked": false
                    });
            }
            //guiButton.resizeBackground();
            that.getGui("menuContainer").addGui(guiButton, levelButtons.length);

            guiButton.bind(function (e) {
                if (!guiButton.params["unlocked"]) {
                    return;
                }
                LVL_INDEX = levelButtons.indexOf(guiButton);
                LEVEL_DESCRIPTION = "resources/levels/" + Account.instance.levelOrder[LVL_INDEX + 1];
                Sound.playWithVolume("click");
                that.goToGameState();
            });
            levelButtons.push(guiButton);
        }

        function lastUnlocked() {
            var indx = 0;
            for (var i = 0; i < levelButtons.length - 1; i++) {
                if (SCORE['level_' + i] > 0) {
                    indx = i + 1;
                } else {
                    return indx;
                }
            }
            return indx;
        }

        var left = 118;
        var top = 76;
        // Qualification
        for (var i = 0; i < 5; i++) {
            var guiDiv = createLevelBase(left, top + i * 72, i);
            createCountryFlag(guiDiv);
            // 1, 2 time of two games
            for (var j = 0; j < 4; j++) {
                createLevelButton(left + 96 + j * 91, guiDiv);
            }
        }

        // Group stage
        left += 1000;
        top = 150;
        for (var i = 0; i < 3; i++) {
            var guiDiv = createLevelBase(left, top + i * 72, i);
            createCountryFlag(guiDiv);
            // 1, 2 time of two games
            for (var j = 0; j < 2; j++) {
                createLevelButton((left - 1000) + 96 + j * 2 * 91, guiDiv);
            }
        }

        // playoff
        left += 1000;
        top = 150;
        for (var i = 0; i < 3; i++) {
            var guiDiv = createLevelBase(left, top + i * 72, i);
            createCountryFlag(guiDiv);
            // 1, 2 time of two games
            for (var j = 0; j < 2; j++) {
                createLevelButton((left - 2000) + 96 + j * 2 * 91, guiDiv);
            }
        }

        // final
        left += 1000;
        top = 221;
        var guiDiv = createLevelBase(left, top, i);
        createCountryFlag(guiDiv);
        for (var j = 0; j < 2; j++) {
            createLevelButton((left - 3000) + 96 + j * 2 * 91, guiDiv);
        }

        this.bindButtons();

        var totalScore = 0;
        $['each'](SCORE, function (id, levelScore) {
            totalScore += levelScore * 1;
        });

        /*var score = this.getGui("score");
         score.children.guiEntities[1].change(totalScore);*/

        if (Account.instance.currentFlag === -1) {
            Account.instance.currentFlag = 5; // brazil
        }
        /// create country button
        var countriesSheet = Account.instance.countriesSheet;
        var country = Account.instance.countries[Account.instance.currentFlag];
        var frame = countriesSheet.frames[country.name + ".png"].frame;
        var menuContainer = this.getGui("menuContainer");
        var countryButton = guiFactory.createObject(
            "GuiButton",
            {
                "parent": menuContainer,
                "normal": {
                    "image": "FinalArt/Menu/Button.png",
                    "label": {
                        "style": "gameButton bowl-normal",
                        "text": country.getShortName(),
                        "fontSize": 28,
                        "x": "66%",
                        "y": "48%"
                    }
                },
                "hover": {
                    "image": "FinalArt/Menu/Button.png",
                    "scale": 115,
                    "label": {
                        "style": "gameButton bowl-normal",
                        "text": country.getShortName(),
                        "fontSize": 28,
                        "x": "66%",
                        "y": "48%"
                    }
                },
                "style": "gameButton",
                "width": 162,
                "height": 60,
                "x": 330,
                "y": 420
            }
        );
        menuContainer.addGui(countryButton);
        //menuContainer.resize();

        countryButton.bind(function (e) {
            Sound.playWithVolume("click");
            that.switchState("CountrySelectMenuState01", that.id, that.parent.id, false);
        });

        var countryFlagDiv = guiFactory.createObject(
            "GuiDiv",
            {
                "parent": countryButton,
                "background": {
                    "image": "FinalArt/" + countriesSheet.meta.image,
                    "width": countriesSheet.meta.size.w,
                    "height": countriesSheet.meta.size.h,
                    //css background-position
                    "frameX" : -frame.x,
                    "frameY" : -frame.y
                },
                "style": "gameButton",
                "width":  frame.w,
                "height": frame.h,
                "x": 22,
                "y": 12
            }
        );
        countryButton.addGui(countryFlagDiv);
        countryButton.resize();

        LAST_UNLOCKED = lastUnlocked();
        this.initSlideContainer();
        this.checkSlideBtns();
        this.resize();
    }
    
    if (Loader['loadingMessageShowed']()) {
        Account.instance.backgroundState.fadeIn(
            REPLY ? 0 : LEVEL_FADE_TIME, "#0d5600", function () {
        		that.getGui("enhancedScene").jObject['css']("opacity", "0");
            	that.getGui("enhancedScene").fadeTo(1, LEVEL_FADE_TIME);
                Account.instance.backgroundState.fadeOut(LEVEL_FADE_TIME);
                Loader['hideLoadingMessage']();
                $(window)['trigger']("resize");
            });
    } else {
    	// Timeout for smooth animation
    	setTimeout(function(){
    		that.getGui("enhancedScene").jObject['css']("opacity", "0");
        	that.getGui("enhancedScene").fadeTo(1, LEVEL_FADE_TIME);
            Account.instance.backgroundState.fadeOut(LEVEL_FADE_TIME, function () {
                $(window)['trigger']("resize");
            });
    	},100);
    }
};

LevelMenuState.prototype.initSlideContainer = function () {
    var screen = this.getGui("slideContainer");
    if (LAST_UNLOCKED > 31) {
        screen.x -= 3000;
    } else if (LAST_UNLOCKED > 25) {
        screen.x -= 2000;
    } else if (LAST_UNLOCKED > 19) {
        screen.x -= 1000;
    }
    screen.resize();
};

LevelMenuState.prototype.bindButtons = function () {
    var that = this;
    var menuButton = this.getGui("menu");
    var screen = this.getGui("slideContainer");
    screen.setZ(-1);

    menuButton.bind(function (e) {
        Sound.playWithVolume("click");
        that.switchState("MenuState01", that.id, that.parent.id);
    });

    /*var restartButton = this.getGui("restart");
     restartButton.bind(function (e) {
     Sound.playWithVolume("change");
     if (confirm("Restart championship?")) {
     Account.instance.usedFlags = [];
     Account.instance.switchState("CountrySelectMenuState01", that.id, that.parent.id);
     SCORE = {};
     Device.setStorageItem("scores", JSON.stringify(SCORE));
     }
     });*/

    var nextGameButton = this.getGui("nextGame");
    nextGameButton.bind(function (e) {
        LVL_INDEX = LAST_UNLOCKED;
        //LEVEL_DESCRIPTION = "resources/levels/" + LVL_INDEX + ".json";
        LEVEL_DESCRIPTION = "resources/levels/" + Account.instance.levelOrder[LVL_INDEX + 1];

        Sound.playWithVolume("click");
        that.goToGameState();
    });
    //TODO: check
    if (LVL_INDEX === LAST_LEVEL) {
        nextGameButton.hide();
    }

    var btn = this.getGui("arrowLeft");
    btn.bind(function (e) {
        if (that.sliding) {
            return;
        }
        that.sliding = true;
        Sound.playWithVolume("click");
        that.slide(screen, screen.x + 1000, 75, function () {
            that.sliding = false;
            that.checkSlideBtns();
        });
    });

    btn = this.getGui("arrowRight");
    btn.bind(function (e) {
        if (that.sliding) {
            return;
        }
        that.sliding = true;
        Sound.playWithVolume("click");
        that.slide(screen, screen.x - 1000, 75, function () {
            that.sliding = false;
            that.checkSlideBtns();
        });
    });
};

LevelMenuState.prototype.checkSlideBtns = function () {
    var slideContainerX = this.getGui("slideContainer").x;
    var left = this.getGui("arrowLeft");
    var right = this.getGui("arrowRight");
    if (slideContainerX > -1000) {
        left.hide();
    } else {
        left.show();
    }

    if (slideContainerX < -2000) {
        right.hide();
    } else {
        right.show();
    }
};

LevelMenuState.prototype.slide = function (gui, target, speed, callback) {
    var that = this;
    var delta = target - gui.x;
    delta /= Math.abs(delta);
    delta *= speed;
    var id = setInterval(function () {
        if (Math.abs(gui.x - target) > speed) {
            gui.x += delta;
            gui.resize();
        } else {
            gui.x = target;
            gui.resize();
            clearInterval(id);
            if (callback)
                callback.call(that);
        }
        ;
    }, 10);
};

LevelMenuState.prototype.goToGameState = function () {
    var that = this;
//    Loader['setLoadingState'](Resources.getString("loading") + "...");
//    Account.instance.backgroundState.fadeIn(LEVEL_FADE_TIME, "#0d5600",
//            function () {
//    			Loader['showLoadingMessage']();
    	        that.switchState("GameState01", that.id, that.parent.id);
//            });
};

LevelMenuState.prototype.switchState = function (state, id, parent, fade) {
	Account.instance.switchState(state, id?id:this.id, parent?parent:this.parent.id, fade?fade:false, this.getGui("enhancedScene"));
};
var MENU_GUI_JSON = "resources/ui/mainMenu.json";
var CREDITS_JSON = "resources/ui/credits.json";
var DESCRIPTIONS_JSON = "resources/objectsDescription.json";
var COUNTRIES_SHEET = "resources/countriesSheet.json";

MenuState.prototype = new BaseState();
MenuState.prototype.constructor = MenuState;

/**
 * Main Menu State represents main menu with buttons
 * (such as "Play", "Highscores, Sound on/off", "Help")
 * @constructor
 */
function MenuState() {
    this.preloadJson(MENU_GUI_JSON);
    this.preloadJson(CREDITS_JSON);
    this.preloadJson(DESCRIPTIONS_JSON);
    this.preloadJson(COUNTRIES_SHEET);

    if (!Account.instance.mediaPreloaded) {
        // preloading fonts
        //Resources.preloadFonts([ "victoriana-normal" ]);

        Sound.init("sounds/total", true);
        Sound.add("click", 2, 0.5, "sounds/total");
        //Sound.add("change", 4, 0.5, "sounds/total");
        Sound.add("win_crowd_v2", 45, 5, "sounds/total", 10);
        Sound.add("loss_crowd", 40, 4, "sounds/total", 10);
        Sound.add("shot", 5.1, 0.5, "sounds/total");
        Sound.add("star", 4, 0.4, "sounds/total");
        Sound.add("bubble", 3, 0.2, "sounds/total");
        Sound.add("ball_jump_1", 6, 0.2, "sounds/total");
        Sound.add("ball_jump_2", 7, 0.2, "sounds/total");
        Sound.add("brick_cube_damaged", 8, 0.8, "sounds/total");
        Sound.add("brick_cube_destroyed", 9, 1.6, "sounds/total");
        Sound.add("crossbar", 11, 1, "sounds/total");
        Sound.add("glass_cube_damaged", 13, 1.3, "sounds/total");
        Sound.add("glass_cube_destroyed", 15, 1.6, "sounds/total");
        Sound.add("highlight_button", 17, 0.4, "sounds/total");
        Sound.add("metal_cube_hit_1", 18, 1.5, "sounds/total");
        Sound.add("metal_cube_hit_2", 20, 1.5, "sounds/total");
        Sound.add("net", 23, 1.4, "sounds/total");
        //Sound.add("push_button", 25, 0.4, "sounds/total");
        Sound.add("push_button", 50, 0.2, "sounds/total");
        Sound.add("referee", 26, 1.2, "sounds/total", 9);
        Sound.add("stadium", 28, 5.8, "sounds/total");
        Sound.add("star", 34, 1.4, "sounds/total");
        Sound.add("wood_cube_damaged", 36, 1, "sounds/total");
        Sound.add("wood_cube_destroyed", 38, 1.75, "sounds/total");

        Sound.add("first_star", 52, 0.6, "sounds/total");
        Sound.add("second_star", 53, 0.6, "sounds/total");
        Sound.add("third_star", 54, 0.6, "sounds/total");
        Sound.add("enemy_1", 55, 0.5, "sounds/total");
        Sound.add("enemy_2", 56, 0.65, "sounds/total");
        Sound.add("enemy_3", 57, 0.75, "sounds/total");
        Sound.add("ukraine_wins", 58, 6.6, "sounds/total", 10);
    }

    MenuState.parent.constructor.call(this);
};

MenuState.inheritsFrom(BaseState);

MenuState.prototype.className = "MenuState";
MenuState.prototype.createInstance = function (params) {
    var entity = new MenuState();
    entity.activate(params);
    return entity;
};
entityFactory.addClass(MenuState);

MenuState.prototype.jsonPreloadComplete = function () {
    if (!Account.instance.mediaPreloaded) {
        var mediaArray = [
            "FinalArt/Backgrounds/BackGround_001.jpg",
            "FinalArt/Ball/ball.png",
            "FinalArt/Ball/PointCloud001.png",
            "FinalArt/Ball/PointCloud002.png",
            "FinalArt/Ball/PointCloud003.png",
            "FinalArt/Blocks/Brick/Brick2_Sheet.png",
            "FinalArt/Blocks/Brick/Brick3_Sheet.png",
            "FinalArt/Blocks/Brick/Brick_Sheet.png",
            "FinalArt/Blocks/Glass/Glass2_Sheet.png",
            "FinalArt/Blocks/Glass/Glass3_Sheet.png",
            "FinalArt/Blocks/Glass/Glass_Sheet.png",
            "FinalArt/Blocks/Metal/Metal_001.png",
            "FinalArt/Blocks/Metal/Metal_002.png",
            "FinalArt/Blocks/Metal/Metal_003.png",
            "FinalArt/Blocks/Wood/Wood2_Sheet.png",
            "FinalArt/Blocks/Wood/Wood3_Sheet.png",
            "FinalArt/Blocks/Wood/Wood_Sheet.png",
            "FinalArt/Cannon/Power001.png",
            "FinalArt/Enemy/Enemy_LineArt_Sheet.png",
            "FinalArt/Enemy/Enemy_Pants_Sheet.png",
            "FinalArt/Enemy/Enemy_Shirt_Sheet.png",
            "FinalArt/Goal/Web_Back_001.png",
            "FinalArt/Goal/Web_Front_001.png",

            "FinalArt/Menu/endGameMenu/CongratBG.png",
            "FinalArt/Menu/endGameMenu/CongratTextField.png",
            "FinalArt/Menu/endGameMenu/WinStarEmpty.png",
            "FinalArt/Menu/endGameMenu/WinStarFull.png",

            "FinalArt/Menu/Game/Balls_A.png",
            "FinalArt/Menu/Game/pause.png",
            "FinalArt/Menu/Game/play.png",
            "FinalArt/Menu/Game/re-some.png",
            "FinalArt/Menu/Game/scores.png",
            "FinalArt/Menu/Game/SideMenu.png",
            "FinalArt/Menu/Game/versus.png",

            "FinalArt/Menu/LevelSelect/LastLevel.png",
            "FinalArt/Menu/LevelSelect/LevelBase_A.png",
            "FinalArt/Menu/LevelSelect/TestMenuBG.jpg",
            "FinalArt/Menu/LevelSelect/TwinkleEmpty.png",
            "FinalArt/Menu/LevelSelect/TwinkleFull.png",
            "FinalArt/Menu/LevelSelect/WordsBase.png",

            "FinalArt/Menu/Main/help.png",
            "FinalArt/Menu/Main/Live.png",
            "FinalArt/Menu/Main/eliteCoder.png",
            "FinalArt/Menu/Main/Mute.png",
            "FinalArt/Menu/Main/StartScreen_001.jpg",

            "FinalArt/Menu/Pause/shadow.png",
            "FinalArt/Menu/Pause/shadowed.png",

            "FinalArt/Menu/ArrowL.png",
            "FinalArt/Menu/ArrowR.png",
            "FinalArt/Menu/Button.png",
            "FinalArt/Menu/Divider.png",
            "FinalArt/Menu/FlagBase.png",

            "FinalArt/Player/GG_LineArt_Sheet.png",
            "FinalArt/Player/GG_Pants_Sheet.png",
            "FinalArt/Player/GG_Shirt_Sheet.png",

            "FinalArt/Star/StarLevel_001.png",

            "FinalArt/Tutorial/Tutorial.png",

            "FinalArt/countriesSheet.png",
            "FinalArt/judgeCLR.png",
            "FinalArt/Lock.png",
            "France.png",
            "Germany.png",
            "Italy.png",
            "Portugal.png",
            "Russia.png",
            "Spain.png",
            "turkey.png",
            "United_Kingdom.png",
            "Ukraine.png"
        ];

        $['each'](this.resources.json[DESCRIPTIONS_JSON], function (key, value) {
            $['each'](value.visuals, function (key, value) {
                if (value["totalImage"]) {
                    mediaArray.push(value["totalImage"]);
                }
            });
        });

        Loader['updateLoadingState'](Loader['currentLoadingState']() + 10);
        var currentPecent = Loader['currentLoadingState']();
        var remainPecent = 100 - currentPecent;
        this.preloadMedia(mediaArray, function (data) {
            Loader['updateLoadingState'](currentPecent
                + Math.round(remainPecent * (data.loaded / data.total)));
        });

        Account.instance.mediaPreloaded = true;
    }

    MenuState.parent.jsonPreloadComplete.call(this);
};

MenuState.prototype.init = function (params) {
    MenuState.parent.init.call(this, params);
    guiFactory.createGuiFromJson(this.resources.json[MENU_GUI_JSON], this);

    var enhancedScene = this.getGui("enhancedScene");

    guiFactory.createGuiFromJson(this.resources.json[CREDITS_JSON], this);

    Account.instance.countriesSheet = this.resources.json[COUNTRIES_SHEET];

    this.onLanguageChange = function () {
        that.getGui("play").changeLabel(Resources.getString("play"));
        that.getGui("langBack").changeLabel(Resources.getString("back"));
        that.getGui("changeLang").changeLabel(Resources.getString("language"));
        that.getGui("fullScreen").changeLabel(Resources.getString("fullScreen"));
//		that.getGui("moreGames").changeLabel(Resources.getString("moreGames"));
        that.getGui("mainFlag").setBackground("images/" + Resources.getString("flag"));
        that.getGui("mainFlag").resize();
        for (var i = 0; i < that.langButtons.length; i++) {
            that.langButtons[i].onLanguageChange();
        }

        Account.instance.backgroundState.textLogo.change(Resources.getString("loading") + "...");
    };

    if (Sound.isOn()) {
        this.getGui("soundOff").hide();
        this.getGui("soundOn").show();
    } else {
        Sound.turnOn(false);
        this.getGui("soundOn").hide();
        this.getGui("soundOff").show();
    }

    var that = this;

    var btn = this.getGui("play");
    btn.bind(function (e) {
        Sound.playWithVolume("click");
        if (Account.instance.currentFlag == -1) {
        	that.switchState("CountrySelectMenuState01");
        } else {
        	that.switchState("LevelMenuState01");
        }
    });

    /*var btn = this.getGui("highscores");
    btn.bind(function (e) {

    });*/

    var btn = this.getGui("soundOn");
    btn.bind(function (e) {
        Sound.turnOn(false);
        that.getGui("soundOn").hide();
        that.getGui("soundOff").show();
    });

    var btn = this.getGui("soundOff");
    btn.bind(function (e) {
        Sound.turnOn(true);
        Sound.playWithVolume("click");
        that.getGui("soundOff").hide();
        that.getGui("soundOn").show();
        Sound.playWithVolume("click");
    });

    var btn = this.getGui("fullScreen");
    btn.bind(function (e) {
        toggleFullScreen();
    });

    if (!Device.isMobile() || navigator.userAgent.indexOf('Chrome') === -1) {
        btn.hide();
    }

    var btn = this.getGui("changeLang");
    btn.bind(function (e) {
        Sound.play("click");
        langScroll.resizeScroll();
        that.getGui("dialogLanguage").resize();
        that.getGui("dialogLanguage").show();
        langScroll.refresh();
    });

    var btn = this.getGui("langBack");
    btn.bind(function (e) {
        Sound.play("click");
        that.getGui("dialogLanguage").hide();
    });

    var langScroll = that.getGui("langScroll");
    var langs = [
        {
            lang: 'EN',
            text: "en",
            flag: "United_Kingdom.png",
        },
        {
            lang: 'RU',
            text: "ru",
            flag: "Russia.png",
        },
        {
            lang: 'FR',
            text: "fr",
            flag: "France.png",
        },
        {
            lang: 'IT',
            text: "it",
            flag: "Italy.png",
        },
        {
            lang: 'ES',
            text: "es",
            flag: "Spain.png",
        },
        {
            lang: 'DE',
            text: "de",
            flag: "Germany.png",
        },
        {
            lang: 'TR',
            text: "tr",
            flag: "turkey.png",
        },
        {
            lang: 'PT',
            text: "pt",
            flag: "Portugal.png",
        },
        {
            lang: 'UA',
            text: "ua",
            flag: "Ukraine.png",
        },
        {
            lang: 'DU',
            text: "du",
            flag: "Dutch.png",
        }
    ];

    langScroll.setFixedHeight(langs.length * 90);
    this.langButtons = [];
    for (var i = 0; i < langs.length; i++) {
        var mainDiv = guiFactory.createObject("GuiDiv", {
            "parent": this.getGui("langScroll"),
            "style": "dialog",
            "width": 100,
            "height": 67,
            "x": 10,
            "y": 10 + 90 * i
        });

        var button = guiFactory.createObject("GuiButton", {
            "parent": mainDiv,
            "normal": {
                "image": "FinalArt/Menu/Button.png",
                "label": {
                    "style": "gameButton bowl-white-unboredered",
                    "text": langs[i].text,
                    "fontSize": 35,
                    "y": "45%",
                    "color": "#753424"
                }
            },
            "hover": {"image": "FinalArt/Menu/Button.png",
                "scale": 110,
                "label": {
                }},
            "style": "dialog",
            "width": 250,
            "height": 67,
            "x": 117,
            "y": 0
        });

        var flag = guiFactory.createObject("GuiDiv", {
            "parent": mainDiv,
            "background": {
                "image": langs[i].flag
            },
            "style": "dialog",
            "width": 92,
            "height": 67,
            "x": 0,
            "y": 0,
            "offsetY": 0
        });

        mainDiv.addGui(button);
        mainDiv.addGui(flag);

        langScroll.addListItem(mainDiv);
        langScroll.refresh();

        (function bind(ln, txt) {
            button.buttonText = txt;
            button.bind(function (e) {
                Sound.play("click");
                Resources.setLanguage(ln);
                setTimeout(function () {
                    that.onLanguageChange();
                    that.getGui("dialogLanguage").hide();
                }, 500);
            });
            flag.bind(function (e) {
                Sound.play("click");
                Resources.setLanguage(ln);
                setTimeout(function () {
                    that.onLanguageChange();
                    that.getGui("dialogLanguage").hide();
                }, 500);
            });
        })(langs[i].lang, langs[i].text);

        button.onLanguageChange = function () {
            this.changeLabel(Resources.getString(this.buttonText));
        }

        this.langButtons.push(button);
    }

    // Credits Dialog

    var creditsDialog = this.getGui("creditsDialog");
    var creditsButton = this.getGui("help");
    creditsButton.bind(function (e) {
        // circle.hide();
        // logo.hide();
        creditsDialog.show();
        that.scroll.refresh();
        e.preventDefault();
        Sound.playWithVolume("click");
    });

    var resume = this.getGui("resume");
    resume.bind(function (e) {
        Sound.playWithVolume("click");
        // circle.show();
        // logo.show();
        creditsDialog.hide();
    });

    var src = "<span id='creditsLabel'>"
        + "<br><br><br><br><b><big>Elite Coder";

    this.scroll = this.getGui("scroll");
    // hacky thing for IE9 to make scrollable even empty space
    // var backMask = this.getGui("backMask");
    var berrry = this.getGui("berrry");
    var textLabel = this.getGui("text");
    textLabel.append(src);
    textLabel.align("center");
    this.scroll.addListItem(berrry);
    this.scroll.addListItem(textLabel);
    // this.scroll.addListItem(backMask);
    this.scroll['refresh'];

    /*if (Loader['loadingMessageShowed']()) {
        that.onLanguageChange();
        Account.instance.backgroundState.fadeIn(LEVEL_FADE_TIME, "#0d5600",
            function () {
                enhancedScene.show();
                that.resize();
                Account.instance.backgroundState.fadeOut(LEVEL_FADE_TIME);
                Loader['hideLoadingMessage']();
                $(window)['trigger']("resize");
				setTimeout(function() {
					Account.instance.turnOnMaskLogo(true);
				},500);
            });
    } else {
        enhancedScene.show();
        that.resize();
        Account.instance.backgroundState.fadeOut(LEVEL_FADE_TIME, function () {
            $(window)['trigger']("resize");
        });
    }*/

    setTimeout(function() {
        Account.instance.resize();
        that.onLanguageChange();
    },1500);
    setTimeout(function(){
        that.getGui("fullScreen").resize();
        that.onLanguageChange();
        if (Loader['loadingMessageShowed']()) {
            Account.instance.backgroundState.fadeIn(LEVEL_FADE_TIME, "#0d5600",
                function() {
                    Loader['hideLoadingMessage']();
                    enhancedScene.show();
                    $(window)['trigger']("resize");
                    setTimeout(function() {
                        Account.instance.backgroundState.fadeOut(LEVEL_FADE_TIME);
                        setTimeout(function() {
                            Account.instance.turnOnMaskLogo(true);
                        },500);
                    },500);
                });
        } else {
            enhancedScene.jObject['css']("opacity", "0");
        	enhancedScene.show();
            enhancedScene.fadeTo(1, LEVEL_FADE_TIME);
            Account.instance.backgroundState.fadeOut(LEVEL_FADE_TIME, function() {
                $(window)['trigger']("resize");
            });
        }
    },100);
};

MenuState.prototype.switchState = function (state, id, parent, fade) {
	Account.instance.switchState(state, id?id:this.id, parent?parent:this.parent.id, fade?fade:false, this.getGui("enhancedScene"));
};

var COUNTRY_MENU_GUI_JSON = "resources/ui/countrySelectMenu.json";
var REPLY = false;

var VISIBLE_FLG_CNT = 32;

/**
 * Level Menu State represents levels select menu with buttons
 * to select the level
 * @constructor
 */
function CountrySelectMenuState() {
    this.preloadJson(COUNTRY_MENU_GUI_JSON);
    CountrySelectMenuState.parent.constructor.call(this);
}

CountrySelectMenuState.inheritsFrom(BaseState);

CountrySelectMenuState.prototype.className = "CountrySelectMenuState";
CountrySelectMenuState.prototype.createInstance = function (params) {
    var entity = new CountrySelectMenuState();
    entity.activate(params);
    return entity;
};
entityFactory.addClass(CountrySelectMenuState);

CountrySelectMenuState.prototype.jsonPreloadComplete = function () {
    CountrySelectMenuState.parent.jsonPreloadComplete.call(this);
};

CountrySelectMenuState.prototype.init = function (params) {
    CountrySelectMenuState.parent.init.call(this, params);
    var that = this;
    // for generating new championship
    Account.instance.usedFlags = [];

    guiFactory.createGuiFromJson(this.resources.json[COUNTRY_MENU_GUI_JSON], this);
    //Loader.updateLoadingState(8);
    //console.dir("8%");

    var slideContainer = this.getGui("slideContainer");
    //this.currentFlag = this.getGui("selectedCountryFlag");

    /*if (Account.instance.currentFlag != -1) {
        this.currentFlag.setBackground("images/FinalArt/countries/" + Account.instance.countries[Account.instance.currentFlag].name + ".png");
    }*/

    // Adds and binds level select buttons
    this.countryButtons = [];

    function clickFlag(index) {
        // remove image urls
        PlayerGuiSprite.pantsImage = null;
        PlayerGuiSprite.shirtImage = null;
        PlayerGuiCSprite.pantsImage = null;
        PlayerGuiCSprite.shirtImage = null;

        var oldFlag = Account.instance.currentFlag;
        var newFlagIndex = Account.instance.usedFlags.indexOf(index);
        // interchange indexes
        if (newFlagIndex != -1) {
            Account.instance.usedFlags[newFlagIndex] = oldFlag;
        }

        Account.instance.currentFlag = index;
        //that.currentFlag.setBackground("images/FinalArt/countries/" + Account.instance.countries[Account.instance.currentFlag].name + ".png");
        Device.setStorageItem("Flag", Account.instance.currentFlag);
        that.switchState("LevelMenuState01", that.id, that.parent.id);
    }

    function createButton(x, y, index) {
        var country = Account.instance.countries[index];
        var guiDiv = guiFactory.createObject(
            "GuiButton",
            {
                "parent": slideContainer,
                "normal": {
                    "image": "FinalArt/Menu/FlagBase.png",
                    "label": {
                        "style": "gameButton bowl-normal",
                        "text": country.getShortName(),
                        "fontSize": 28,
                        "x": "66%",
                        "y": "48%"
                    }
                },
                "hover": {
                    "image": "FinalArt/Menu/FlagBase.png",
                    "scale": 115,
                    "label": {
                        "style": "gameButton bowl-normal",
                        "text": country.getShortName(),
                        "fontSize": 28,
                        "x": "66%",
                        "y": "48%"
                    }
                },
                "style": "gameButton",
                "width": 162,
                "height": 60,
                "x": x,
                "y": y
            }
        );
        guiDiv.bind(function (e) {
            Sound.playWithVolume("click");
            clickFlag(index);
        });

        var countriesSheet = Account.instance.countriesSheet;
        var frame = countriesSheet.frames[country.name + ".png"].frame;
        var countryFlagDiv = guiFactory.createObject(
            "GuiDiv",
            {
                "parent": guiDiv,
                "background": {
                    "image": "FinalArt/" + countriesSheet.meta.image,
                    "width": countriesSheet.meta.size.w,
                    "height": countriesSheet.meta.size.h,
                    //css background-position
                    "frameX" : -frame.x,
                    "frameY" : -frame.y
                },
                "style": "gameButton",
                "width":  frame.w,
                "height": frame.h,
                "x": 22,
                "y": 12
            }
        );
        //slideContainer.addGui(guiDiv, that.countryButtons.length);
        guiDiv.addGui(countryFlagDiv, "flag" + that.countryButtons.length);
        guiDiv.resize();
        that.countryButtons.push(guiDiv);
        return guiDiv;
    }

    var left;
    var top;
    var countryLength = Account.instance.countries.length;
    for (var screen = 0; screen < 2; screen++) { // TODO: set 12
//        Loader.updateLoadingState(screen * 8);
//        console.dir(screen * 40 + "%"); // 8 for 12 screens
        left = 1000 * screen + 60;
        for (var i = 0; i < 5; i++) {
            top = 70 * i + 90;
            for (var j = 0; j < 4; j++) {
                var index = screen * 20 + i * 4 + j;
                if (index > countryLength - 1) {
                    break;
                }
                createButton(left + j * 174, top, index);
            }
        }
    }

//    Loader.updateLoadingState(100);
    if (Loader.loadingMessageShowed()) {
        Account.instance.backgroundState.fadeIn(
            REPLY ? 0 : LEVEL_FADE_TIME, "#0d5600", function () {
        		that.getGui("enhancedScene").jObject['css']("opacity", "0");
            	that.getGui("enhancedScene").fadeTo(1, LEVEL_FADE_TIME);
                Account.instance.backgroundState.fadeOut(LEVEL_FADE_TIME);
                Loader.hideLoadingMessage();
                $(window)['trigger']("resize");
            });
    } else {
    	// Timeout for smooth animation
    	setTimeout(function(){
    		that.getGui("enhancedScene").jObject['css']("opacity", "0");
        	that.getGui("enhancedScene").fadeTo(1, LEVEL_FADE_TIME);
            Account.instance.backgroundState.fadeOut(LEVEL_FADE_TIME, function () {
                $(window)['trigger']("resize");
            });
    	},100);
    }
    // loadGame();
    this.checkSlideBtns();
    this.bindButtons();
};

CountrySelectMenuState.prototype.bindButtons = function () {
    var that = this;
    var menuButton = this.getGui("menu");
    var screen = this.getGui("slideContainer");
    screen.setZ(-1);

    var menuButton = this.getGui("menu");
    menuButton.bind(function (e) {
        Sound.playWithVolume("click");
        Device.setStorageItem("Flag", Account.instance.currentFlag);
        SCORE = {};
        Device.setStorageItem("scores", JSON.stringify(SCORE));
        Account.instance.usedFlags = [];
        that.switchState("MenuState01", that.id, that.parent.id);
    });

    var btn = this.getGui("arrowLeft");
    btn.bind(function (e) {
        if (that.sliding) {
            return;
        }
        that.sliding = true;
        Sound.playWithVolume("click");
        that.slide(screen, screen.x + 1000, 75, function () {
            that.sliding = false;
            that.checkSlideBtns();
        });
    });

    btn = this.getGui("arrowRight");
    btn.bind(function (e) {
        if (that.sliding) {
            return;
        }
        that.sliding = true;
        Sound.playWithVolume("click");
        that.slide(screen, screen.x - 1000, 75, function () {
            that.sliding = false;
            that.checkSlideBtns();
        });
    });
};

CountrySelectMenuState.prototype.slide = function (gui, target, speed, callback) {
    if (speed === 0 ) {
        gui.x = target;
        gui.resize();
        if (callback) {
            callback.call(this);
        }
        return;
    }
    var that = this;
    var delta = target - gui.x;
    delta /= Math.abs(delta);
    delta *= speed;
    var id = setInterval(function () {
        if (Math.abs(gui.x - target) > speed) {
            gui.x += delta;
            gui.resize();
        } else {
            gui.x = target;
            gui.resize();
            clearInterval(id);
            if (callback)
                callback.call(that);
        }
        ;
    }, 10);
};

CountrySelectMenuState.prototype.checkSlideBtns = function () {
    var slideContainerX = this.getGui("slideContainer").x;
    var left = this.getGui("arrowLeft");
    var right = this.getGui("arrowRight");
    if (slideContainerX > -1000) {
        left.hide();
    } else {
        left.show();
    }

    if (slideContainerX < 0) { //0 for 2; //12 - -10000
        right.hide();
    } else {
        right.show();
    }
};

CountrySelectMenuState.prototype.resize = function () {
    CountrySelectMenuState.parent.resize.call(this);
    for (var i = 0; i < this.countryButtons.length; i++) {
        this.countryButtons[i].resize();
    }
};

CountrySelectMenuState.prototype.switchState = function (state, id, parent, fade) {
	Account.instance.switchState(state, id?id:this.id, parent?parent:this.parent.id, fade?fade:false, this.getGui("enhancedScene"));
};
/**
 *
 * @param min {number} some value to play sound with volume 0 (squared velocity, damage, etc.)
 * @param max {number} some value to play sound with volume 1 ((squared velocity, damage, etc.))
 * @param priority
 * @param loop
 * @constructor
 */
function VelocitySoundProfile(min, max, priority, loop) {
    this.min = min;
    this.max = max;
    this.priority = priority;
    this.loop = loop;
}

/**
 *
 * @param @param {VelocitySoundProfile} soundProfile
 * @param velocitySl
 */
FtSound = {
    /**
     *
     * @param id - {String} sound
     * @param soundProfile
     * @param velocitySl
     */
    playSoundProfile: function (id, soundProfile, velocitySl) {
        var volume = (velocitySl - soundProfile.min) / (soundProfile.max - soundProfile.min);
        if (volume < 0) {
            return;
        } else if (volume > 1) {
            volume = 1;
        }
        Sound.playWithVolume(id, volume, soundProfile.priority, soundProfile.loop)
    }
};var ANIMATION_SPEED = 700;
var FIRE_ANIMATION_OFFSET = 200;
var STD_BALLS_COUNT = 3;

/**
 * MAIN Player CLASS, represents Player entity with its
 * parts (such as player, grid and powerline),
 * actions and some handlers
 * @constructor
 */
function Player() {
    Player.parent.constructor.call(this);
    this.rotationCenter = {"x": 138, "y": 85};
};

Player.inheritsFrom(PhysicEntity);
Player.prototype.className = "Player";

Player.prototype.createInstance = function (params) {
    var entity = new Player();
    entity.init(params);
    return entity;
};

entityFactory.addClass(Player);

Player.prototype.init = function (params) {
    Player.parent.init.call(this, params);
    // .hack temporary to place cannon on the ground
    params["y"] -= 12;

    this.direction = new b2Vec2(1, 0);
    this.initialDirection = new b2Vec2(1, 0);
    this.powerRatio = 0;
    this.balls = params.balls ? params.balls : STD_BALLS_COUNT;
    this.scores = params.scores ? params.scores : [100, 200, 300];

    var ballsInfo = Account.instance.getEntity("GameState01").getGui("ballsInfo");
    ballsInfo.children.guiEntities[1].change(this.balls);
};

/**
 *  Create and register physics body
 */
Player.prototype.createPhysics = function () {
    var fixtureDefList = [];
    var bodyDefinition;
    var physicParams = this.params['physics']; // preloaded from json
    var logicPosition = {
        x: (this.params.x + physicParams.offsetX) / Physics.getB2dToGameRatio(),
        y: (this.params.y + physicParams.offsetY) / Physics.getB2dToGameRatio()
    };

    function setShapeParams(fixtureDefinition, physicParams) {
        fixtureDefinition.density = selectValue(physicParams['density'], 1);
        fixtureDefinition.restitution = selectValue(physicParams.restitution, 1);
        fixtureDefinition.friction = selectValue(physicParams.friction, 0);
        fixtureDefinition.isSensor = selectValue(physicParams.sensor, false);
        fixtureDefinition.userData = selectValue(physicParams.userData, false);
        if (physicParams.filter != null) {
            fixtureDefinition.filter.categoryBits = selectValue(physicParams.filter.categoryBits, 0x0001);
            fixtureDefinition.filter.groupIndex = selectValue(physicParams.filter.groupIndex, 0);
            fixtureDefinition.filter.maskBits = selectValue(physicParams.filter.maskBits, 0xFFFF);
        }
    }

    bodyDefinition = new b2BodyDef();
    bodyDefinition.type = physicParams['static'] ? b2Body.b2_staticBody : b2Body.b2_dynamicBody;
    bodyDefinition.userData = null;
    // Configuring shape params depends on "type" in json

    // Box
    var fixDef = new b2FixtureDef();
    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox(physicParams.width / (2 * Physics.getB2dToGameRatio()), physicParams.height /
        (2 * Physics.getB2dToGameRatio()));
    setShapeParams(fixDef, physicParams);
    fixtureDefList.push(fixDef);

    // Configuring and creating body (returning it)
    bodyDefinition.position.Set(0, 0);
    bodyDefinition.linearDamping = physicParams.linearDamping != null ? physicParams.linearDamping : 0;
    bodyDefinition.angularDamping = physicParams.angularDamping != null ? physicParams.angularDamping : 0;
    var physicWorld = Physics.getWorld();
    this.physics = physicWorld.CreateBody(bodyDefinition);
    var that = this;
    $.each(fixtureDefList, function (id, fixDef) {
        that.physics.CreateFixture(fixDef);
    });

    this.physics.SetPosition(logicPosition);
    this.destructable = physicParams["destructable"];
    if (this.destructable)
        this.health = physicParams["health"];
    else
        this.health = null;
    if (this.params.angle)
        this.rotate(this.params.angle * 2);
};

Player.prototype.createVisual = function () {
    var that = this;
    var description = Account.instance.descriptionsData[this.params.type];

    $.each(description.visuals, function (id, visualInfo) {
        var gui = guiFactory.createObject(visualInfo['class'], $.extend({
            'parent': (visualInfo['class'] === "GuiSprite" || visualInfo['class'] === "PlayerGuiSprite") ? that.guiParent : BattleScene.instance.canvasDiv,
            'style': "sprite",
            'x': that.params.x,
            'y': that.params.y
        }, visualInfo));
        gui.setZ(gui.params.z);
        if (!that.mainGui)
            that.mainGui = gui;
        if (visualInfo.visible == false)
            gui.hide();
        var resInfo = {};
        resInfo.visual = gui;
        that.addVisual(id, resInfo);
    });

    function waitAndPlayAnimation() {
        var pantsAnimations = that.getVisual("pants").animations;
        var shirtAnimations = that.getVisual("shirt").animations;
        if (pantsAnimations && pantsAnimations["getReady"] && shirtAnimations && shirtAnimations["getReady"]) {
            BattleScene.instance.sortEntities();
            that.playAnimation("getReady", 0, false, true);
        } else {
            setTimeout(waitAndPlayAnimation, 50);
        }
    }

    waitAndPlayAnimation();

    /*var pos = this.getVisual("line").getPosition();
     var offsetFromPlayer = Account.instance.configData.ball.offsetFromPlayer;
     pos.x += offsetFromPlayer.x;
     pos.y += offsetFromPlayer.y;
     this.ballSpawnPosition = pos;*/
    //this.ballSpawnPosition = {x:100, y:100}; //TODO: fix
    this.ballSpawnPosition = {x: 85, y: 444}; //TODO: fix
};

// Rotates barrel around local rotation point by angle in Deg
//Player.prototype.rotateGuiElement = function (angle) {
//    var powerLine = this.getVisual("powerLine");
//    var axisOffset = {
//        "x": this.rotationCenter.x + (powerLine.params["totalImageWidth"] - powerLine.width) * 0.5,
//        "y": this.rotationCenter.y
//    };
//    var localPoint = {
//        "x": (-powerLine.x + axisOffset.x) * Screen.widthRatio(),
//        "y": (-powerLine.y + axisOffset.y) * Screen.heightRatio()
//    };
//    var matTrans = new Transform();
//    var matRot = new Transform();
//    matTrans.translate(localPoint.x, localPoint.y);
//    matRot.rotateDegrees(angle);
//    matTrans.multiply(matRot);
//    matRot.translate(-localPoint.x, -localPoint.y);
//    matTrans.multiply(matRot);
//    powerLine.setTransform(matTrans.m, 0);
//};

Player.prototype.rotateGuiElement = function(gui, angle, axisOffset) {
    var localPoint = {
        "x" : (axisOffset.x) * Screen.widthRatio(),
        "y" : ( axisOffset.y) * Screen.heightRatio()
    };
    var matTrans = new Transform();
    var matRot = new Transform();
    matTrans.translate(localPoint.x, localPoint.y);
    matRot.rotateDegrees(angle);
    matTrans.multiply(matRot);
    matRot.translate(-localPoint.x, -localPoint.y);
    matTrans.multiply(matRot);
    // matTrans.translate(-gui.x * Screen.widthRatio(), -gui.y *
    // Screen.heightRatio());
    gui.setTransform(matTrans.m, 0);
};


// Sets powerLine length and powerRatio depends on
// target point
Player.prototype.navigate = function (point) {
    var that = this;

    var powerLine = this.getVisual("powerLine");
    if (point.x < that.mainGui.x + 72)
        return;

    this.powerRatio = Math.min((distance(this.ballSpawnPosition, point) - 60) / 300, 1);
    var minPowerRatio = Account.instance.configData.player.minPowerRatio;
    this.powerRatio = (this.powerRatio > minPowerRatio) ? this.powerRatio : 0;
    if ((!powerLine.visible) && (this.powerRatio > minPowerRatio)) {
        powerLine.show();
    }
    if ((powerLine.visible) && (this.powerRatio < minPowerRatio)) {
        powerLine.hide();
    }

    // powerLine.imageWidth = this.powerRatio * powerLine.params.width;
    // powerLine.frameSizeScale.x = this.powerRatio; // using in PowerLineGuiCSprite.js

    this.direction.x = Math.max(point.x, this.ballSpawnPosition.x) - this.ballSpawnPosition.x;
    this.direction.y = Math.min(point.y, this.ballSpawnPosition.y) - this.ballSpawnPosition.y;

    var powerLine = this.getVisual("powerLine");
//  powerLine.angle = -calculateAngle(that.direction, that.initialDirection);
    var angle = -calculateAngle(this.direction, that.initialDirection) / 2;
    //this.rotateGuiElement(angle);
    if (angle > - 45 && angle < 0) {
        powerLine.width = this.powerRatio * powerLine.params.width;
        this.rotateGuiElement(
            powerLine,
            angle,
            {
                "x": /*143 +*/ 40 + (powerLine.params["totalImageWidth"] - powerLine.width) * 0.5,
                "y": /*37*/ powerLine.height * 4 / 5 + that.mainGui.y
            });
    }
    powerLine.resize();
};

// Binds all visuals of the entity for one callback
Player.prototype.bind = function (event, callback) {
    $.each(this.visuals, function (id, visualInfo) {
        if (visualInfo.visual)
            visualInfo.visual.jObject['bind'](event, callback);
    });
};

Player.prototype.createBall = function () {
    var scene = this.parent;
    scene.initChildren({
        "children": {
            "Ball": {
                "class": "Ball",
                "type": "Ball",
                "parent": "Scene01",
                "x": this.ballSpawnPosition.x,
                "y": this.ballSpawnPosition.y
            }
        }
    });
    this.ball = Account.instance.getEntity("Ball");
    if (this.ball) {
        this.ball.attachToGui(scene.getVisual(), false);
    }
    this.ball.visual.show();
};

Player.prototype.applyImpulseToBall = function () {
    this.balls--;
    var centerPos = this.ball.physics.GetPosition();
    var impulse = new b2Vec2(this.direction.x, this.direction.y);
    impulse.Normalize();
    impulse.Multiply(this.powerRatio * Account.instance.configData.player.powerRating);
    this.ball.physics.SetAwake(true);
    this.ball.physics.ApplyImpulse(impulse, new b2Vec2(centerPos.x, centerPos.y));
};

// Complete fire action of this cannon
Player.prototype.fire = function () {
    this.fired = true;
    var that = this;
    var powerLine = this.getVisual("powerLine");

    powerLine.hide();
    this.setTimeout(function () {
            Sound.playWithVolume("shot");
            that.applyImpulseToBall();
            that.powerRatio = 0;
            var ballsInfo = Account.instance.getEntity("GameState01").getGui("ballsInfo");
            ballsInfo.children.guiEntities[1].change(that.balls);
            //that.visual.playAnimation("getReady", 0, false, true);
        }, FIRE_ANIMATION_OFFSET
    );

    that.playAnimation("fire", ANIMATION_SPEED, false, true);
};

Player.prototype.attachToGui = function (guiParent) {
    Player.parent.attachToGui.call(this, guiParent, false);
    this.createBall();
};

/**
 *
 * @param {string} animationName
 * @param {number} duration
 * @param {boolean} looped
 * @param {boolean} independentUpdate
 */
Player.prototype.playAnimation = function (animationName, duration, looped, independentUpdate) {
    var lineVisual = this.getVisual("line");
    var pantsVisual = this.getVisual("pants");
    var shirtVisual = this.getVisual("shirt");

    lineVisual.playAnimation(animationName, duration, looped, independentUpdate);
    pantsVisual.playAnimation(animationName, duration, looped, independentUpdate);
    shirtVisual.playAnimation(animationName, duration, looped, independentUpdate);
};/**
 * Ball represents cannonball entity with it`s pointcloud path
 * @constructor
 */
function Ball() {
    Ball.parent.constructor.call(this);
    this.leftScene = false;
};

Ball.inheritsFrom(PhysicEntity);
Ball.prototype.className = "Ball";

Ball.prototype.createInstance = function (params) {
    var entity = new Ball();
    entity.init(params);
    return entity;
};

entityFactory.addClass(Ball);

Ball.prototype.init = function (params) {
    Ball.parent.init.call(this, params);
    this.radius = this.params.physics.radius;
};

Ball.prototype.createVisual = function () {
    var that = this;
    this.description = Account.instance.descriptionsData[this.params.type];
    this.angle = 0;

    this.visual = guiFactory.createObject("GuiSprite", $['extend']({
        'parent': that.guiParent,
        'style': "sprite",
        'x': that.params.x - that.description.visuals.ball.width / 2,
        'y': that.params.y - that.description.visuals.ball.height / 2
    }, that.description.visuals.ball));
    if (this.visual.params.z) {
        this.visual.setZ(this.visual.params.z);
    }
    var visualInfo = {};
    visualInfo.visual = this.visual;
    this.addVisual("Ball", visualInfo);
    this.inMotion = false;
    this.path = [];
    this.trace = true;
    this.pathLength = 0;
    this.visual.hide();
};

//
// CREATES POINTCLOUD PATH (trace) FOR Ball
//
Ball.prototype.createPath = function () {
    //return;
    // var that = this;
    var scene = this.guiParent.visualEntity;
    if (!scene) {
        return;
    }

    var tracePoint = scene.pool.clouds.guis[this.pathLength];
    if (tracePoint) {
        var pos = this.getPosition();
        tracePoint.setPosition(pos.x - tracePoint.width / 2, pos.y - tracePoint.height / 2);
        tracePoint.show();
        this.path.push(tracePoint);
        this.pathLength += 1;
    }
};

//
// REMOVES POINTCLOUD PATH (trace) OF CANNONBALL
//
Ball.prototype.removePath = function () {
    delete this.path;
    this.path = [];
    var scene = this.guiParent.visualEntity;
    $.each(scene.pool.clouds.guis, function (id, gui) {
        if (gui.visible)
            gui.hide();
    });
    this.pathLength = 0;
};

Ball.prototype.destroy = function () {
    if (this.physics) {
        this.physics.SetLinearVelocity(new b2Vec2(0, 0));
    }
    this.removePath();

    Ball.parent.destroy.call(this);
};

// TODO: wtf? remove?
Ball.prototype.getPathLength = function () {
    return this.path.length;
};

// Update visual position from physics world
//Ball.prototype.updatePositionFromPhysics = function () {
//    var that = this;
//
//    if (that.physics == null)
//        return;
//
//    var pos = this.getPosition();
//    that.setPosition(pos.x - that.params.physics.x - that.params.physics.width / 2, pos.y - that.params.physics.y -
//        that.params.physics.height / 2);
//
//    $['each'](this.visuals, function (id, visualInfo) {
//        var angleInDeg = that.getPhysicsRotation().toFixed(3);
//        angleInDeg = MathUtils.toDeg(angleInDeg);
//        visualInfo.visual.rotate(angleInDeg);
//    });
//};
//
//// ball update callback (reads imp, vel, handles some effects etc)
//Ball.prototype.updatePhysics = function () {
//    Ball.parent.updatePhysics.call(this);
//    return;
//
//    if (!this.visual.visible)
//        return;
//
//    this.inMotion = this.physics.m_linearVelocity.Length() > Account.instance.configData.ball.minVelocityToTrace;
//
//    if (this.inMotion) {
//        var newPosition = {
//            "x": this.x,
//            "y": this.y
//        };
//        var oldPosition;
//        if (this.path.length > 0) {
//            oldPosition = {
//                "x": this.path[this.path.length - 1].x,
//                "y": this.path[this.path.length - 1].y
//            };
//        } else {
//            oldPosition = {
//                "x": 0,
//                "y": 0
//            };
//        }
//
//        if ((distance(newPosition, oldPosition) > TRACE_STEP) && (this.visual.visible == true) && (this.trace))
//            this.createPath();
//    }
//    //Ball.parent.update.call(this);
//};

Ball.prototype.bind = function (event, callback) {
    $.each(this.visuals, function (id, visualInfo) {
        if (visualInfo.visual)
            visualInfo.visual.jObject.bind(event, callback);
    });
};var DEFAULT_SCORE = 50;

/**
 * Block - destructible PhysicsEntity representing stone
 * block from which castles are built
 * @constructor
 */
function Block() {
    Block.parent.constructor.call(this);
};

Block.inheritsFrom(PhysicEntity);
Block.prototype.className = "Block";

Block.prototype.createInstance = function (params) {
    var entity = new Block();
    entity.init(params);
    return entity;
};

entityFactory.addClass(Block);

Block.prototype.createVisual = function () {
    var that = this;
    var description = Account.instance.descriptionsData[this.params.type];
    this.angle = 0;

    $.each(description.visuals, function (id, visualInfo) {
        var gui = guiFactory.createObject(visualInfo['class'], $.extend({
            'parent': (visualInfo['class'] === "GuiSprite" ||  visualInfo['class'] === "EnemyGuiSprite") ? that.guiParent : BattleScene.instance.canvasDiv,
            'style': "sprite",
            'x': that.params.x,
            'y': that.params.y
        }, visualInfo));
        gui.setZ(gui.params.z);

        var resInfo = {};
        resInfo.visual = gui;
        that.addVisual(id, resInfo);
    });
    this.updatePositionFromPhysics();
};

Block.prototype.onDamage = function (damage) {
    var that = this;
    var configData = Account.instance.configData;
    var healthBefore = this.health;
    Block.parent.onDamage.call(this, damage);
    var healthAfter = this.health;
    if (healthAfter < 0) {
        healthAfter = 0;
    }
    var score = healthBefore - healthAfter;
    this.parent.score += score * configData.score.blockDamageCoefficient;

    var scoreCell = Account.instance.getEntity("GameState01").getGui("score");
    scoreCell.children.guiEntities[1].change((that.parent.score * Account.instance.configData.score.rate).toFixed(0));
    if (this.health > 0) {
        switch (this.params.material) {
            case "metal":
                FtSound.playSoundProfile("metal_cube_hit_" + (Math.random() < 0.5 ? 1 : 2),  configData.sounds.metal, damage); // TODO: or 2
                break;
            case "brick":
                FtSound.playSoundProfile("brick_cube_damaged",  configData.sounds.brick, damage);
                break;
            case "wood":
                FtSound.playSoundProfile("wood_cube_damaged",  configData.sounds.wood, damage);
                break;
            case "glass":
                FtSound.playSoundProfile("glass_cube_damaged", configData.sounds.glass, damage);
                break;
            default:
                break;

        }
    } else {
        switch (this.params.material) {
            case "metal":
                FtSound.playSoundProfile("metal_cube_hit_" + (Math.random() < 0.5 ? 1 : 2), configData.sounds.metal, damage); // TODO: or 2
                break;
            case "brick":
                FtSound.playSoundProfile("brick_cube_destroyed",  configData.sounds.brick, damage);
                break;
            case "wood":
                FtSound.playSoundProfile("wood_cube_destroyed",  configData.sounds.wood, damage);
                break;
            case "glass":
                FtSound.playSoundProfile("glass_cube_destroyed", configData.sounds.glass, damage);
                break;
            default:
                break;
        }
    }
};

// Plays an animation from table, if such exists
Block.prototype.destroy = function () {
    /*var bigDestruction = Account.instance.getEntity("BigBlockDestruction");
    var smallDestruction = Account.instance.getEntity("SmallBlockDestruction");
    var effectPosition = {
        "x": this.x + 9,
        "y": this.y + 5
    };
    switch (this.params.type) {
        case "BigBlock_1":
            bigDestruction.play(effectPosition);
            break;
        case "BigBlock_2":
            bigDestruction.play(effectPosition);
            break;
        case "BigBlock_3":
            bigDestruction.play(effectPosition);
            break;
        case "SmallBlock_1":
            smallDestruction.play(effectPosition);
            break;
        case "SmallBlock_2":
            smallDestruction.play(effectPosition);
            break;
        case "SmallBlock_3":
            smallDestruction.play(effectPosition);
            break;
        case "WindowBlock":
            bigDestruction.play(effectPosition);
            break;
        default:
            break;

    }

    var center = effectPosition;

    var owner = this.parent;
    var score = this.params.score ? this.params.score : DEFAULT_SCORE;
    var scoreGroup;
    if (score >= 5000)
        scoreGroup = "5000"; else if (score >= 1000)
        scoreGroup = "1000"; else if (score >= 500)
        scoreGroup = "500"; else if (score >= 100)
        scoreGroup = "100"; else if (score >= 50)
        scoreGroup = "50"; else if (score >= 15)
        scoreGroup = "15";

    if (false && scoreGroup) {
        $.each(owner.pool.scores[scoreGroup].guis, function (idx, gui) {
            if (!gui.visible) {
                gui.setPosition(center.x + (0.5 - Math.random()) * 100, center.y + (0.5 - Math.random()) * 100);
                gui.show();
                IEffect.play(gui, {
                    "slide": {
                        "x": (gui.x > center.x) ? 10 : -10,
                        "y": -10
                    },
                    "iterations": 10
                }, 500);

                owner.setTimeout(function () {
                    gui.hide();
                }, 1000);
            }
        });
    }*/

    Block.parent.destroy.call(this);
};

Block.prototype.attachToGui = function (guiParent) {
    Block.parent.attachToGui.call(this, guiParent, false);
};/**
 * Effect represents visual, sound etc effects
 */

var IEffect = (function() {
	return {
		play : function(gui, params, duration) {
			var slide = false;
			if (params.slide) {
				slide = {
						"x" : params.slide.x,
						"y" : params.slide.y
				};
			}

			var rotate = false;
			if (params.rotate) {
				rotate = params.rotate;
			}
			
			var onEnd = false;
			if (params.onEnd)
				onEnd = params.onEnd;
			
			var scale = false;
			if (params.scale) {
				scale = params.scale;
			}
			
			var iterations = params.iterations ? params.iterations : 20;
			var iteration = 0;
			function process() {
				setTimeout(function(){
					if (slide) {
						gui.x += slide.x/iterations;
						gui.y += slide.y/iterations;
					};
					if (rotate) {
						gui.rotate(rotate/iterations);
					};
					gui.resize();
					if (iteration >= iterations-1) {
						if (onEnd) onEnd();
						return;
					}
					else { 
						iteration += 1;
						process();
					}

				}, duration/iterations);
			}
			process();
		}
	};
})();var DEATH_DELAY = 500;

/**
 * Enemy class represents an soldier (cap?)
 *  with it`s physics, animation and logic part
 *  (detecting GameOver, changing animation picture etc)
 * @constructor
 */
function Enemy() {
    Enemy.parent.constructor.call(this);
};

Enemy.inheritsFrom(Block);
Enemy.prototype.className = "Enemy";

Enemy.prototype.createInstance = function (params) {
    var entity = new Enemy();
    entity.init(params);
    return entity;
};

entityFactory.addClass(Enemy);

Enemy.prototype.init = function (params) {
    Enemy.parent.init.call(this, params);
    this.oldAngle = 0;
    this.dead = false;
};

Enemy.prototype.createVisual = function () {
    var that = this;
    var tmpPhysics = this.physics;
    this.physics = null; // disable updatePositionFromPhysics()
    Enemy.parent.createVisual.call(that);

    function waitAndPlayAnimation() {
        var pantsAnimations = that.getVisual("pants").animations;
        var shirtAnimations = that.getVisual("shirt").animations;
        if (pantsAnimations && pantsAnimations["normal"] && shirtAnimations && shirtAnimations["normal"]) {
            that.refreshFace("normal");
            that.physics = tmpPhysics;
            BattleScene.instance.sortEntities();
            that.updatePositionFromPhysics();
        } else {
            setTimeout(waitAndPlayAnimation, 50);
        }
    }

    waitAndPlayAnimation();
};

Enemy.prototype.refreshFace = function (state) {
    var that = this;
    if (this.state == state) {
        return;
    }
    this.state = state;
    switch (state) {
        case "surprised":
//            that.visuals["enemy"].visual.playAnimation("surprised", 50, false,true);
            that.playAnimation("surprised", 500, false, true);
            that.dead = false;
            break;
        case "dead":
//            that.visuals["enemy"].visual.playAnimation("dead", 50, false, true);
            this.getVisual("shirt").setAnimationEndCallback(function() {
                that.fadeTo(0, DEATH_DELAY, function () {
                    if (that.dead) {
                        //Sound.playWithVolume("bubble");
                        that.destroy();
                    }
                });
            });
            that.playAnimation("dead", 50, false, true);
            that.dead = true;

            break;
        case "normal":
//            that.visuals["enemy"].visual.playAnimation("normal", 50, false, true);
            that.playAnimation("normal", 50, false, true);
            that.dead = false;
            break;
        case "happy":
            that.playAnimation("happy", 50, false, true);
            that.dead = false;
//            that.visuals["enemy"].visual.playAnimation("happy", 50, false, true);
            break;
        default:
            break;
    }
};

Enemy.prototype.update = function () {
//    Enemy.parent.updatePhysics.call(this);

    if (this.DoNotUpdate)
        return;

    if (this.state == "happy") {
        this.y -= 1;
        return;
    }

    if (this.physics)
        this.angle = Math.abs(MathUtils.toDeg(this.physics.GetAngle()));
    var battleScene = Account.instance.getEntity("Scene01");

    if (battleScene == null)
        return;

    if (this.angle < 2) {
        if (!battleScene.finishLevel) {
            this.refreshFace("normal");
        }
    } else if (this.angle < 30) {
        this.refreshFace("surprised");
    } else {
        this.refreshFace("dead");
    }

    /*if (!this.dead && this.angle == this.oldAngle && battleScene.targeted && Physics.paused && this.state != "happy") {
     this.refreshFace("normal");
     }*/

    this.oldAngle = this.angle;
};

// Plays an animation from table, if such exists
Enemy.prototype.destroy = function () {
    //this.parent.playTeamAnimation("happy", 1000, 2000, 100, 200);
    this.parent.score += Account.instance.configData.score.enemy;
    var scoreCell = Account.instance.getEntity("GameState01").getGui("score");
    scoreCell.children.guiEntities[1].change((this.parent.score * Account.instance.configData.score.rate).toFixed(0));

    Enemy.parent.destroy.call(this);

    // TODO: why PhysicsEntity does not remove entity?
    Account.instance.removeScheduledEntity(this);
    Account.instance.removeChild(this);
};

Enemy.prototype.fadeTo = function (fadeValue, time, callback) {
    var lineVisual = this.getVisual("line");
    var pantsVisual = this.getVisual("pants");
    var shirtVisual = this.getVisual("shirt");

    lineVisual.fadeTo(fadeValue, time, callback);
    pantsVisual.fadeTo(fadeValue, time, null);
    shirtVisual.fadeTo(fadeValue, time, null);
};

Enemy.prototype.playAnimation = function (animationName, duration, looped, independentUpdate) {
    Player.prototype.playAnimation.call(this, animationName, duration, looped, independentUpdate);
};/**
 * Ground - static physics zone that acts like ground
 * @constructor
 */
function Ground() {
    Ground.parent.constructor.call(this);
};

Ground.inheritsFrom(PhysicEntity);
Ground.prototype.className = "Ground";

Ground.prototype.createInstance = function (params) {
    var entity = new Ground();
    entity.init(params);
    return entity;
};

entityFactory.addClass(Ground);

Ground.prototype.init = function (params) {
    Ground.parent.init.call(this, params);
};

var TRACE_STEP = 45;
var SELF_DESTR_MULT = 0.8;
var Z_INDEX = 0;

/**
 * BattleScene is the main battlefield scene, witch drives all ingame entities
 * and events
 * @constructor
 */

function BattleScene() {
    BattleScene.parent.constructor.call(this);
    BattleScene.instance = this;
};

BattleScene.inheritsFrom(PhysicScene);

BattleScene.prototype.className = "BattleScene";
BattleScene.prototype.createInstance = function (params) {
    var entity = new BattleScene();
    entity.init(params);
    return entity;
};

entityFactory.addClass(BattleScene);

BattleScene.prototype.init = function (params) {
    Z_INDEX = 0;
    this.starTimeouts = [];
    Physics.createWorld(new b2Vec2(0, 10), true, 30);
    BattleScene.parent.init.call(this, params);
    this.needToReleaseBarrel = false;
    this.targeted = false;
    this.fired = false;
    this.enemies = [];
    this.score = 0;
    this.pool = {
        "clouds": {
            "count": 0,
            "guis": []
        },
        "scores": {
            "15": {
                "count": 2,
                "guis": []
            },
            "50": {
                "count": 2,
                "guis": []
            },
            "100": {
                "count": 2,
                "guis": []
            },
            "500": {
                "count": 1,
                "guis": []
            },
            "1000": {
                "count": 1,
                "guis": []
            },
            "5000": {
                "count": 1,
                "guis": []
            }
        }
    };
};

BattleScene.prototype.addChild = function (child) {
    BattleScene.parent.addChild.call(this, child);
};

BattleScene.prototype.initBallPosition = function () {
    var ball = this.player.ball;
    var that = this;

    ball.visual.fadeTo(0, 500, function () {
        ball.physics.SetLinearVelocity(new b2Vec2(0, 0));
        ball.physics.SetAngularVelocity(0);
        ball.setPhysicsPosition(that.player.ballSpawnPosition);
        //ball.updatePositionFromPhysics();
        ball.inMotion = false;
        ball.visual.fadeTo(1, 500, function () {
            that.targeted = true;
            that.player.fired = false;
            ball.leftScene = false;
        });
    });
};

BattleScene.prototype.forceInitBallPosition = function () {
    var ball = this.player.ball;
    var that = this;

    if (this.player.balls !== 0 && this.needToReleaseBarrelTimeout) {
        this.clearTimeout(this.needToReleaseBarrelTimeout);
        this.needToReleaseBarrel = false;
    }

    ball.visual.fadeTo(0, 100, function () {
        ball.physics.SetLinearVelocity(new b2Vec2(0, 0));
        ball.physics.SetAngularVelocity(0);
        ball.setPhysicsPosition(that.player.ballSpawnPosition);
        //ball.updatePositionFromPhysics();
        ball.inMotion = false;
        ball.visual.fadeTo(1, 100, function () {
            that.player.fired = false;
            that.player.ball.leftScene = false;
        });
    });
};

BattleScene.prototype.createVisual = function () {
    /* var guiParent = this.guiParent;
     var pos = guiParent.getRealPosition();
     this.canvasOffset = {x: parseInt(pos.x), y: parseInt(pos.y)};
     this.createScene();*/
    BattleScene.parent.createVisual.call(this);
    var that = this;
    var visual = this.getVisual();

    function fillPool() {

        for (var i = 0; i < that.pool.clouds.count; i++) {
            var gui = guiFactory.createObject("GuiCSprite", {
                'parent': BattleScene.instance.canvasDiv,
                "style": "sprite",
                "width": (i % 2 == 0) ? 14 : 10,
                "height": (i % 2 == 0) ? 14 : 10,
                "totalImage": (i % 2 == 0) ? "FinalArt/Ball/PointCloud002.png" : "FinalArt/Ball/PointCloud001.png",
                "totalImageWidth": (i % 2 == 0) ? 14 : 10,
                "totalImageHeight": (i % 2 == 0) ? 14 : 10,
                "totalTile": 1,
                "x": 0,
                "y": 0
            });
            gui.setZ(5);
            gui.hide();
            that.guiParent.addGui(gui);
            gui.clampByParentViewport(false);
            that.pool.clouds.guis.push(gui);
        }
    }

    fillPool();

    $.each(this.children, function (id, child) {
        if (child.params.type == "Enemy") {
            that.enemies.push(child);
        }
    });

    var sc = document.getElementById(visual.id);
    sc.style.border = '0px solid black';

    this.setBackgrounds({
        "background": {
            "src": "images/FinalArt/Backgrounds/BackGround_001.jpg",
            "backX": 0,
            "backY": 0,
            "backWidth": 1138,
            "backHeight": 640
        }
    }, Account.instance.getEntity("GameState01").getGui("enhancedScene"));

    // Create ground
    var groundParams = {
        "id": "Ground01",
        "class": "Ground",
        "parent": "Scene01",
        "type": "Ground",
        "x": 600,
        "y": 484,
        "angle": 0
    };
    this.ground = entityFactory.createObject(groundParams["class"], groundParams);
    Account.instance.addEntity(this.ground);

    new FootballContactListener();

    // Searching for a player in the scene. Choosing the first found.
    var player = null;
    this.teamPlayers = [];
    $.each(this.children, function (id, child) {
        if (child.params['class'] == "Player") {
            player = child;
            that.player = child;
            //return false;
        } else if (child.params['class'] == "TeamPlayer") {
            that.teamPlayers.push(child);
        }
    });
    if (player == null) {
        alert("There is no Cannon in Scene! It can`t be so, if you have added one. Please add it!");
    }

    if (that.params["balls"]) {
        player.balls = that.params.balls;
    }
    this.goal = Account.instance.getEntity("Goal");
    this.referee = Account.instance.getEntity("Referee");
    //
    // CURSOR EVENTS HANDLERS
    //
    var onDownHandler = function (e) {
        if (that.finishLevel) { // level has been finished (success or fail)
            return;
        }
        var pos = Device.getLogicPositionFromEvent(e);
        var distanceSquared = b2Math.DistanceSquared(pos, that.player.ballSpawnPosition);
        if (distanceSquared > Account.instance.configData.world.touchDistanceSquaredToTargeting) {
            return;
        }

        if (!that.player.fired || that.needToReleaseBarrel) {
            that.targeting = true;
        }

        if (that.player.fired && that.needToReleaseBarrel) {
            that.needToReleaseBarrel = false;
            if (that.player.balls === 0) {
                that.playTeamAnimation("facepalm", 1000, 2000, 100, 200);
                that.failShow();
            } else {
                that.forceInitBallPosition();
            }
        }
    };

    var onUpHandler = function (e) {
        if (that.targeting) {
            that.player.ball.removePath();
            if (that.player.powerRatio > 0.1) {
                that.player.fire();
                that.needToReleaseBarrelTimeout = that.setTimeout(function () {
                    that.needToReleaseBarrel = true;
                }, 1000); //.hack
            } else {
                that.player.fired = false;
            }
        }
        that.targeting = false;
    };

    // Cursor Move handler (rotating barrel, computing force etc)
    var onMoveHandler = function (e) {
        if (that.player.fired)
            return;

        if (!that.player.balls)
            return;

        var pos = Device.getLogicPositionFromEvent(e);
        if (that.targeting) {
            //Physics.pause(true);
            player.navigate(pos);
//            player.setTarget(pos);
        }
    };

    // Binding events
    visual.jObject['bind'](Device.event("cursorMove"), onMoveHandler);
    visual.jObject['bind'](Device.event("cursorUp"), onUpHandler);
    visual.jObject['bind'](Device.event("cursorDown"), onDownHandler);

    Account.instance.getEntity("GameState01").getGui("enhancedScene").jObject['bind'](Device.event("cursorUp"), onUpHandler);

    this.sortEntities();

    function reinitBall() {
        that.isStoppedTimeout = null;
        that.needToReleaseBarrel = false;
        if (that.player.balls === 0) {
            that.playTeamAnimation("facepalm", 1000, 2000, 100, 200);
            that.failShow();
        } else {
            that.initBallPosition();
        }
        //that.checkForResult(player.balls);
    }

    // Scene update callback
    this.update = function () {
        if (that.finishLevel) {
            return;
        }

        if (!Physics.paused()) {
            that.checkBallLeftScene();
        }

        if (that.player.fired) {
            that.targeted = false;
        }

        if (!that.player.balls) {
            that.targeted = false;
        }

        if (that.needToReleaseBarrel) {
            if (that.player.ball.leftScene) {
                reinitBall();
            } else if (!that.isStoppedTimeout) {
                that.checkObjectsStop(reinitBall);
            }
        }
    };
    this.initBallPosition();

//    Physics.setDebugModeEnabled(true);
//    Physics.debugDrawing(true);
    this.setEnable(true);
    Physics.pause(false);

    /* RENDER_TIME = 0;
     RENDER_COUNT = 0;
     RENDER_END_TIME = 0;
     RENDER_BETWEEN_UPDATES_TIME = 0;
     SPRITE_RENDER_TIME = 0;
     SPRITE_RENDER_COUNT = 0;

     setTimeout(function() {
     alert("render time: " + RENDER_TIME / RENDER_COUNT + "; \n" + "sprite render time: " + SPRITE_RENDER_TIME / SPRITE_RENDER_COUNT + "; \n Between render: " +
     RENDER_BETWEEN_UPDATES_TIME / RENDER_COUNT);

     }, 10000);*/
};

BattleScene.prototype.checkObjectsStop = function (callback) {
    var that = this;

    function isStopped(stopSpeed) {
        var maxSpeed = that.getBallMaxSpeed();
        that.maxSpeed = Math.max(maxSpeed.linear, maxSpeed.angular - 0.003);
        return that.maxSpeed < stopSpeed;
    }

    // near goal (double check)
    if (this.goal.x - this.player.ball.x < 40) {
        if (isStopped(Account.instance.configData.world.stopSpeedNearGoal)) {
            this.isStoppedTimeout = this.setTimeout(function () {
                if (isStopped(Account.instance.configData.world.stopSpeedNearGoal)) {
                    that.isStoppedTimeout = null;
                    callback();
                }
            }, 1000);
        }
    } else {
        if (isStopped(Account.instance.configData.world.stopSpeed)) {
            this.isStoppedTimeout = this.setTimeout(function () {
                if (isStopped(Account.instance.configData.world.stopSpeed)) {
                    that.isStoppedTimeout = null;
                    callback();
                }
            }, 1000);
        }
    }
};

BattleScene.prototype.getBallMaxSpeed = function () {
    var ballBody = this.player.ball.physics;

    var maxSpeed = {
        linear: ballBody.GetLinearVelocity().Length(),
        angular: ballBody.GetAngularVelocity()
    };

    return maxSpeed;
};

// var SORT_TIME = 0;
BattleScene.prototype.sortEntities = function () {
    // var time = new Date().getTime();
    function compare(a, b) {
        if (a.z != null && b.z != null) {
            if (a.z > b.z) {
                return 1;
            } else {
                return -1;
            }
        }

        return 0;
    }

    /*var renderEntities = BattleScene.instance.canvasDiv.canvas.children.guiEntities;
     renderEntities.sort(compare);*/
    /*var sortTime = new Date().getTime() - time;
     console.dir("sortTime:" + sortTime);*/
    // SORT_TIME += sortTime;
};

BattleScene.prototype.checkBallLeftScene = function () {
    var ballPosition = this.player.ball.getPosition();
    var visual = this.getVisual();
    if (!this.player.ball.leftScene && (ballPosition.x < visual.x - 100 || ballPosition.x > visual.width + 150)) {
        this.needToReleaseBarrel = true;
        this.player.ball.leftScene = true;
        //this.playTeamAnimation("facepalm", 1000, 2000, 100, 200);
    }
};

BattleScene.prototype.failShow = function () {
    var flag = Math.floor(LVL_INDEX > 19 ? LVL_INDEX / 2 - 5 : LVL_INDEX / 4);
    if (Account.instance.currentFlag == 17 && Account.instance.usedFlags[flag] == 16) {
        Sound.playWithVolume("ukraine_wins");
    } else {
        Sound.playWithVolume("loss_crowd", 0.7);
    }

    this.finishLevel = true;
    var that = this;
    var playerGui = Account.instance.getEntity("PlayerVisual");
    var state = that.parent;
    state.getGui("star.0").hide();
    state.getGui("star.1").hide();
    state.getGui("star.2").hide();

    this.setTimeout(function () {
        var levelInfo = state.getGui("endGameMenu");
        levelInfo.getGui("resultMessage").changeLabel("oops_you_failed");
        Account.instance.getEntity("PlayerVisual").show();
        that.setTimeout(function () {
            Physics.pause(true);
            if ((LVL_INDEX == LAST_LEVEL)) {
                levelInfo.getGui("resultMessage").changeLabel("great_victory");
            }
            state.getGui("endGameMenu").show();
            // TODO: check it
            if (SCORE['level_' + LVL_INDEX] > 0 && (LVL_INDEX !== LAST_LEVEL)) {
                state.getGui("endNextBtn").show();
            } else {
                state.getGui("endNextBtn").hide();
            }
            playerGui.show();
            playerGui.playAnimation("facepalm", 0, false, false)
        }, 800);
    });

};

BattleScene.prototype.successShow = function () {
    Account.instance.getEntity("PlayerVisual").hide();

    var flag = Math.floor(LVL_INDEX > 19 ? LVL_INDEX / 2 - 5 : LVL_INDEX / 4);
    if ((Account.instance.currentFlag == 16 && Account.instance.usedFlags[flag] == 17)) {
        Sound.playWithVolume("ukraine_wins");
    } else {
        Sound.playWithVolume("win_crowd_v2", 0.7);
    }

    var that = this;
    var state = that.parent;
    var nextBtn = state.getGui("endNextBtn");
    state.getGui("star.0").show();
    state.getGui("star.1").show();
    state.getGui("star.2").show();

    this.setTimeout(function () {
        nextBtn.show();
        var oldScore = SCORE['level_' + (LVL_INDEX)];
        if (!oldScore || that.score > oldScore) {
            SCORE['level_' + LVL_INDEX] = Math.floor(that.score);
            Device.setStorageItem("scores", JSON.stringify(SCORE));
        }
        var levelInfo = state.getGui("endGameMenu");
        var resultMessage = levelInfo.getGui("resultMessage");
        resultMessage.changeLabel("congratulations");
        if ((LVL_INDEX == LAST_LEVEL)) {
            resultMessage.changeLabel("great_victory");
        }
        that.setTimeout(function () {
            Physics.pause(true);
            //Sound.playWithVolume(state.finalSound);
//            state.getGui("pauseMenuContainer").show();
            levelInfo.show();
            that.starAnimations();
        }, 800);

        return true;
    }, 800);
};

BattleScene.prototype.starAnimations = function () {
    var that = this;
    var state = this.parent;
    var time = 400;
    var scores = this.player.scores;
    var stars = 0;
    if (scores == null) {
        console.error("player.scores is empty in the current level!");
        return;
    }
    for (var i = scores.length - 1; i >= 0; i--) {
        if (this.score >= scores[i]) {
            stars = i + 1;
            break;
        }
    }

    SCORE['level_' + LVL_INDEX + "Stars"] = stars;
    Device.setStorageItem("scores", JSON.stringify(SCORE));
    // bullshit code // TODO: fix it
    if (stars > 0) {
        var timeout = that.setTimeout(function () {
            var star = state.getGui("star.0");
            if (star) {
                Sound.playWithVolume("first_star");
                star.applyBackground({
                    "image": "FinalArt/Menu/endGameMenu/WinStarFull.png"
                });
            }
            if (stars > 1) {
                var timeout1 = that.setTimeout(function () {
                    var star = state.getGui("star.1");
                    if (star) {
                        Sound.playWithVolume("second_star");
                        star.applyBackground({
                            "image": "FinalArt/Menu/endGameMenu/WinStarFull.png"
                        });
                    }
                    if (stars > 2) {
                        var timeout2 = that.setTimeout(function () {
                            var star = state.getGui("star.2");
                            if (star) {
                                Sound.playWithVolume("third_star");
                                star.applyBackground({
                                    "image": "FinalArt/Menu/endGameMenu/WinStarFull.png"
                                });
                            }
                        }, time);
                        that.starTimeouts.push(timeout2);
                    }
                }, time);
                that.starTimeouts.push(timeout1);
            }
        }, time);
        that.starTimeouts.push(timeout);
    }
    var label = '';
    if (LVL_INDEX === 19) {
        label = 'groupStage';
    } else if (LVL_INDEX === 25) {
        label = 'play-offRound';
    } else if (LVL_INDEX === 31) {
        label = 'final';
    }
    if (label !== '') {
        this.setTimeout(function () {
            state.getGui("star.0").hide();
            state.getGui("star.1").hide();
            state.getGui("star.2").hide();
            var stageMessage = state.getGui("stageMessage");
            stageMessage.change(label);
            state.getGui("stageMessage").show();
        }, time * stars + 800);
    }

};

BattleScene.prototype.clearStarTimeouts = function () {
    for (var i = 0; i < this.starTimeouts.length; i++) {
        this.clearTimeout(this.starTimeouts[i]);
    }
};

// Checks max speed of worlds bodies
BattleScene.prototype.checkMaxSpeed = function () {
    var world = this.physicWorld;
    var body = world.m_bodyList;
    var maxSpeed = {
        "linear": body.GetLinearVelocity()['Length'](),
        "angular": body.GetAngularVelocity()
    };
    for (; body != null; body = body['m_next']) {
        var curV = {
            "linear": body.GetLinearVelocity()['Length'](),
            "angular": body.GetAngularVelocity()
        };
        if (curV.linear > maxSpeed.linear)
            maxSpeed.linear = curV.linear;
        if (curV.angular > maxSpeed.angular)
            maxSpeed.angular = curV.angular;
    }
    return maxSpeed;
};

BattleScene.prototype.scoreGoal = function () {
    if (this.finishLevel) {
        return;
    }
    var that = this;
    this.finishLevel = true;
    this.score += Account.instance.configData.score.goal;
    this.score += this.player.balls * Account.instance.configData.score.ball;
    var scoreCell = Account.instance.getEntity("GameState01").getGui("score");
    scoreCell.children.guiEntities[1].change((this.score * Account.instance.configData.score.rate).toFixed(0));
    this.playTeamAnimation("happy", 3000, 4500, 100, 600);
    this.setTimeout(function () {
        that.successShow();
    }, 500);
};

/**
 *
 * @param animation {string} happy or facepalm
 */
BattleScene.prototype.playTeamAnimation = function (animation, minDuration, maxDuration, minStartAnimationOffset, maxStartAnimationOffset) {
    var emptyDuration = false;
    var emptyAnimationOffset = false;
    if (minDuration == null || maxDuration == null) {
        var emptyDuration = true;
    }
    if (minStartAnimationOffset == null || maxStartAnimationOffset == null) {
        var emptyAnimationOffset = true;
    }

    $.each(this.teamPlayers, function (key, teamPlayer) {
        if (teamPlayer.params.enemy) {
            teamPlayer.setTimeout(
                function () {
                    teamPlayer.playAnimation(animation === "happy" ? "facepalm" : (animation === "facepalm" ? "happy" : animation),
                        emptyDuration ? 0 : b2Math.RandomRange(minDuration, maxDuration), false, true);
                }, emptyAnimationOffset ? 0 : b2Math.RandomRange(minStartAnimationOffset, maxStartAnimationOffset)
            );
            return;
        }
        teamPlayer.setTimeout(
            function () {
                teamPlayer.playAnimation(animation, emptyDuration ? 0 : b2Math.RandomRange(minDuration, maxDuration), false, true);
            }, emptyAnimationOffset ? 0 : b2Math.RandomRange(minStartAnimationOffset, maxStartAnimationOffset)
        );
    });
    this.player.playAnimation(animation, emptyDuration ? 0 : minDuration, false, true);
};

/*GuiCSprite.prototype.render = function (ctx) {
 if (!this.visible) {
 return;
 }

 var x = this.x * Screen.widthRatio() + BattleScene.instance.canvasOffset.x;
 var y = this.y * Screen.heightRatio() + BattleScene.instance.canvasOffset.y;
 var w = this.width * Screen.widthRatio();
 var h = this.height * Screen.heightRatio();
 var rot = MathUtils.toRad(Math.round(this.angle));
 rot = rot.toFixed(3) * 1;
 // move to the middle of where we want to draw our image
 ctx.translate(x + w * this.transformOrigin.x, y + h * this.transformOrigin.y);
 // rotate around that point, converting our
 // angle from degrees to radians
 ctx.rotate(rot);

 ctx.globalAlpha = this.opacity;

 // this.backgroundPosition integers: {0,0}, {0,1}, etc
 var frameX = Math.ceil(this.backgroundPosition.x * this.imageWidth);
 var frameY = Math.ceil(this.backgroundPosition.y * this.imageHeight);

 if (this.flipped) {
 ctx.scale(-1, 1);
 }
 // draw it up and to the left by half the width
 // and height of the image
 if (frameX + this.imageWidth * this.frameSizeScale.x <= this.img.width && frameY +
 this.imageHeight * this.frameSizeScale.y <= this.img.height) {
 ctx.drawImage(this.img, frameX, frameY, this.imageWidth * this.frameSizeScale.x,
 this.imageHeight * this.frameSizeScale.y, -w * this.transformOrigin.x, -h * this.transformOrigin.y, w, h);
 } else {
 console.warn('Shit is happening. Again. Source rect is out of image bounds');
 }

 };*/
/*GuiCSprite.prototype.render = function (ctx) {
 if (!this.visible)
 return;
 var scrnRatio = {
 x: Screen.widthRatio(),
 y: Screen.heightRatio()
 };

 var x = Math.round((this.x + BattleScene.instance.canvasOffset.x *//*+ this.offsetX*//*) * scrnRatio.x);
 var y = Math.round((this.y + BattleScene.instance.canvasOffset.y *//*+ this.offsetY*//*) * scrnRatio.y);
 var w = Math.ceil(this.width * scrnRatio.x);// this.imageWidth;//
 var h = Math.ceil(this.height * scrnRatio.y);// this.imageHeight;//
 var bx = Math.ceil(this.backgroundPosition.x * this.imageWidth);
 var by = Math.ceil(this.backgroundPosition.y * this.imageHeight);

 var ratio = {
 x: this.transformOrigin.x,
 y: this.transformOrigin.y
 };

 var translate = {
 x: Math.round((x + w * ratio.x)),
 y: Math.round((y + h * ratio.y))
 };
 var rot = MathUtils.toRad(Math.round(this.angle));
 rot = rot.toFixed(3) * 1;
 ctx.translate(translate.x, translate.y);
 ctx.rotate(rot);
 ctx.globalAlpha = this.opacity;

 // ctx.scale(this.scale.x, this.scale.y);

 var sizeX = Math.ceil(this.imageWidth);
 var sizeY = Math.ceil(this.imageHeight);
 var offsetX = -Math.ceil(w * ratio.x);
 var offsetY = -Math.ceil(h * ratio.y);

 if (bx + sizeX <= this.img.width && by + sizeY <= this.img.height)
 ctx.drawImage(this.img,
 bx, by,
 sizeX, sizeY,
 offsetX, offsetY,
 w, h);
 else
 console.warn('Shit is happining. Again. Source rect is out of image bounds');

 };*/

GuiCanvas.prototype.setPosition = function (x, y, noResize) {
    /*this.x = x;
     this.y = y;*/

    if (!noResize)
        this.resize();
};

/*BattleScene.prototype.createScene = function (noChildAttach) {
 var that = this;
 var params = this.params;
 var visual = guiFactory.createObject("GuiScene", {
 parent: this.guiParent,
 style: "scene",
 x: params['x'],
 y: params['y'],
 width: params['width'],
 height: params['height'],
 background: params['background'],
 canvas: params['canvas']
 });

 // TODO: temporary
 if (params.canvasDiv) {
 var gui = guiFactory.createObject('GuiDiv',
 {
 "parent": visual,
 "style": params.canvasDiv.style,
 "enhancedScene": params.canvasDiv.enhancedScene,
 "canvas": {
 },
 "z": params.canvasDiv.z
 });
 this.canvasDiv = gui;
 visual.addGui(gui);
 }

 var visualInfo = {};
 visualInfo.visual = visual;
 this.addVisual(null, visualInfo);

 this.children = this.children ? this.children : new Array();
 if (!noChildAttach) {
 $['each'](this.children, function (id, val) {
 that.attachChildVisual(val);
 });
 }

 //PhysicsEntity.prototype.createVisual
 function updateWorld() {
 Physics.updateWorld();
 that.setTimeout(updateWorld, 15);
 }

 updateWorld();
 };*/

/*GuiCSprite.prototype.initialize = function (params) {
 var that = this;

 this.params = params;

 this.x = params.x || 0;
 this.y = params.y || 0;

 if (params.z) {
 this.z = params.z;
 } else {
 Z_INDEX++;
 this.z = Z_INDEX;
 }

 this.flipped = params['flipped'] != null ? params['flipped'] : false;

 this.opacity = params.opacity ? params.opacity : 1;
 this.width = params.width;
 this.height = params.height;

 this.parent = params.parent.canvas ? params.parent.canvas : params.parent;
 this.id = this.parent.generateId.call(this);

 this.total = {
 image: params.totalImage,
 width: params.totalImageWidth,
 height: params.totalImageHeight,
 tile: params.totalTile
 };

 this.offsetX = params.offsetX || 0;
 this.offsetY = params.offsetY || 0;

 this.transformOrigin = params.transformOrigin || {x: 0.5, y: 0.5};
 this.frameSizeScale = params.frameSizeScale || {x: 1, y: 1};

 this.img = Resources.getAsset(this.total.image);

 var oldFunc = this.img.onload;
 this.img.onload = function () {
 that.imageHeight = Math.round(Math.round(that.img.height / Math.round(that.total.height / that.height)));
 that.imageWidth = Math.round(Math.round(that.img.width / Math.round(that.total.width / that.width)));
 //		that.img.setAttribute("height", that.height);
 //		that.img.setAttribute("width", that.width);
 that.scale = {
 x: Math.round((that.width / that.imageWidth) * 100) / 100,
 y: Math.round((that.height / that.imageHeight) * 100) / 100
 };
 if (oldFunc)
 oldFunc();
 };
 //	this.imageHeight = Math.round(this.img.height / Math.round(this.total.height / this.height));
 //	this.imageWidth = Math.round(this.img.width / Math.round(this.total.width / this.width));
 that.imageHeight = Math.round(Math.round(that.img.height / Math.round(that.total.height / that.height)));
 that.imageWidth = Math.round(Math.round(that.img.width / Math.round(that.total.width / that.width)));
 that.scale = {
 x: Math.round((that.width / that.imageWidth) * 100) / 100,
 y: Math.round((that.height / that.imageHeight) * 100) / 100
 };

 this.backgroundPosition = {
 x: 0,
 y: 0
 };

 this.backgroundSize = {
 w: this.total.width,
 h: this.total.height
 };

 this.rotate(0);

 this.resizeBackground();

 this.currentAnimation = null;
 this.spatialAnimation = null;
 this.animations = new Object();

 if (params['spriteAnimations']) {
 $['each'](params['spriteAnimations'], function (name, value) {
 // console.log("Adding sprite animation " + name);
 that.addSpriteAnimation(name, value);
 });
 }

 this.frames = {};
 if (params['frames']) {
 this.frames = params['frames'];
 }

 if (this.parent.canvas) {
 this.parent.canvas.addGui(this);
 } else {
 this.parent.addGui(this);
 }

 this.show();
 this.setEnabled(true);
 Account.instance.addScheduledEntity(this);
 };*/


var GAME_GUI_JSON = "resources/ui/GameState.json";
var OBJECTS_DESCRIPTION = "resources/objectsDescription.json";
var EVERY_LEVEL_OBJECTS = "resources/everyLevelObjects.json";
var CONFIG = "resources/config.json";

/**
 * Game State. Main state of the game, represents nothing
 * but initializing and creating scene
 * @constructor
 */
function GameState() {
    this.preloadJson(GAME_GUI_JSON);
    this.preloadJson(LEVEL_DESCRIPTION);
    this.preloadJson(OBJECTS_DESCRIPTION);
    this.preloadJson(EVERY_LEVEL_OBJECTS);
    this.preloadJson(CONFIG);
    GameState.parent.constructor.call(this);
};

GameState.inheritsFrom(BaseState);

GameState.prototype.className = "GameState";
GameState.prototype.createInstance = function (params) {
    var entity = new GameState();
    entity.activate(params);
    return entity;
};
entityFactory.addClass(GameState);

GameState.prototype.jsonPreloadComplete = function () {
    GameState.parent.jsonPreloadComplete.call(this);
};

GameState.prototype.init = function (params) {
    var that = this;
    REPLY = false;
    Physics.setDebugModeEnabled(false);

    GameState.parent.init.call(this, params);
    Account.instance.descriptionsData = this.resources.json[OBJECTS_DESCRIPTION];
    Account.instance.configData = this.resources.json[CONFIG];

    // Loading level objects from selected level, loadin descriptions, etc
    guiFactory.createGuiFromJson(this.resources.json[GAME_GUI_JSON], this);

    var levelObjects = this.resources.json[EVERY_LEVEL_OBJECTS];
    $.extend(levelObjects, this.resources.json[LEVEL_DESCRIPTION]);
    var stateParams = Account.instance.getEntity("GameState01").params;
    stateParams.children = levelObjects;
    // Initializing and creating scene content
    this.initChildren(stateParams);
    //TODO: sort
    var battleField = Account.instance.getEntity("Scene01");
    var guiParent = this.getGui("sceneContainer");
    battleField.attachToGui(guiParent, false);
    this.battleField = battleField;

    // this.getGui("pauseMenuContainer").clampByParentViewport();
//    this.getGui("pauseMenuContainer").hide();
    this.getGui("endGameMenu").hide();

    that.getGui("levelInfo").children.guiEntities[1].change(LVL_INDEX + 1);

    if (Sound.isOn()) {
        this.getGui("soundOff").hide();
    } else {
        this.getGui("soundOn").hide();
    }

    function showMenu() {
        var gui = that.getGui("pauseMenu");
        that.physicsBeforePause = Physics.paused();
        Physics.pause(true);
        gui.show();
        gui.playJqueryAnimation("open", function () {

        });
    }

    function hideMenu() {
        var gui = that.getGui("pauseMenu");
        gui.playJqueryAnimation("close", function () {
            Physics.pause(that.physicsBeforePause);
            gui.hide();
        });
    }

    function showStartMenu() {
        var flag = Math.floor(LVL_INDEX > 19 ? LVL_INDEX / 2 - 5 : LVL_INDEX / 4);
        var countriesSheet = Account.instance.countriesSheet;
        var country = Account.instance.countries[Account.instance.currentFlag];
        var frame = countriesSheet.frames[country.name + ".png"].frame;
        var enemyCountry = Account.instance.countries[Account.instance.usedFlags[flag]];
        var enemyFrame = countriesSheet.frames[enemyCountry.name + ".png"].frame;
        var parent = that.getGui("startMenu");
        var yourCountryFlagDiv = guiFactory.createObject(
            "GuiDiv",
            {
                "parent": parent,
                "background": {
                    "image": "FinalArt/" + countriesSheet.meta.image,
                    "width": countriesSheet.meta.size.w,
                    "height": countriesSheet.meta.size.h,
                    //css background-position
                    "frameX": -frame.x,
                    "frameY": -frame.y
                },
                "style": "gameButton",
                "width": frame.w,
                "height": frame.h,
                "x": 70,
                "y": 130,
                "z": 9998
            }
        );
        yourCountryFlagDiv.resizeBackground();
        parent.addGui(yourCountryFlagDiv);

        /*that.getGui("yourTeam").setBackground("images/FinalArt/countries/" +
         Account.instance.countries[Account.instance.currentFlag].name + ".png");*/
        var enemyFlagDiv = guiFactory.createObject(
            "GuiDiv",
            {
                "parent": parent,
                "background": {
                    "image": "FinalArt/" + countriesSheet.meta.image,
                    "width": countriesSheet.meta.size.w,
                    "height": countriesSheet.meta.size.h,
                    //css background-position
                    "frameX": -enemyFrame.x,
                    "frameY": -enemyFrame.y
                },
                "style": "gameButton",
                "width": enemyFrame.w,
                "height": enemyFrame.h,
                "x": 315,
                "y": 130,
                "z": 9998
            }
        );
        enemyFlagDiv.resizeBackground();
        parent.addGui(enemyFlagDiv);

        /*that.getGui("enemyTeam").setBackground("images/FinalArt/countries/" +
         Account.instance.countries[Account.instance.usedFlags[flag]].name + ".png");*/

        that.getGui("yourTeamLabel").changeLabel(country.name);
        that.getGui("enemyTeamLabel").changeLabel(enemyCountry.name);
        // Qualification
        var text = '';
        if (LVL_INDEX < 20) {
            var time = LVL_INDEX % 4 + 1; // 1, 2, 3, 4
            text += Resources.getString(((time === 1 || time === 2) ? 'firstMatch' : 'secondMatch')) + ', ';
        }
        var half = LVL_INDEX % 2 + 1;
        var startMenuLabel = parent.getGui("startMenuLabel");
        text += Resources.getString(((half) === 1 ? "firstHalf" : "secondHalf"));

        startMenuLabel.change(text);
//        if (half === 1) {
//            startMenuLabel.x = 117;
//            startMenuLabel.resize();
//        }
        parent.show();
        Physics.pause(true);
    }

    that.getGui("tutorialMenu").hide();

    function hideStartMenu() {
        that.getGui("startMenu").hide();
        if ((LVL_INDEX == 0)) {
            var btn = that.getGui("tutorialMenu");
            btn.show();
            var tutLabel = that.getGui("tutorialMenuLabel");

            tutLabel.change("take_a_shot");
            var btn = that.getGui("tutorialFrame_0");

            btn.show();
            btn.playAnimation("tutorial", 3000, true, true);

            // that.getGui("tutorialNext").hide();
            var btn = that.getGui("tutorialEnd");
            btn.bind(function (e) {
//                Sound.play("click");
                that.getGui("tutorialMenu").hide();
                Physics.pause(false);
                var scene = Account.instance.getEntity("Scene01");
                scene.setTimeout(function () {
                    scene.referee.whistle();
                }, 500);
            });
        }
        else {
            Physics.pause(false);
        }
    }

    var btn = this.getGui("pauseBtn");
    btn.bind(function (e) {
        Sound.playWithVolume("click");
        showMenu();
    });

    var btn = this.getGui("resume");
    btn.bind(function (e) {
        Sound.playWithVolume("click");
        hideMenu();
    });

    var btn = this.getGui("restart");
    btn.bind(function (e) {
        REPLY = true;
        Sound.playWithVolume("click");
        BattleScene.instance.clearStarTimeouts();
        that.switchState("LevelMenuState01", that.id,
            that.parent.id, true);
    });

    var btn = this.getGui("menu");
    btn.bind(function (e) {
//        Sound.playWithVolume("change");
        Sound.playWithVolume("click");
        BattleScene.instance.clearStarTimeouts();
        that.switchState("LevelMenuState01", that.id,
            that.parent.id);
    });

    var btn = this.getGui("endMenuBtn");
    btn.bind(function (e) {
        LVL_INDEX += 1;
//        Sound.playWithVolume("change");
        Sound.playWithVolume("click");
        BattleScene.instance.clearStarTimeouts();
        that.switchState("LevelMenuState01", that.id,
            that.parent.id);
        console.log(SCORE);
    });

    var btn = this.getGui("endReplyBtn");
    btn.bind(function (e) {
        REPLY = true;
//        Sound.playWithVolume("change");
        Sound.playWithVolume("click");
        BattleScene.instance.clearStarTimeouts();
        that.switchState("LevelMenuState01", that.id,
            that.parent.id, true);
    });

    var btn = this.getGui("endNextBtn");
    btn.bind(function (e) {
        Sound.playWithVolume("click");

//        Sound.playWithVolume("change");
        Sound.playWithVolume("click");
        var half = LVL_INDEX % 2 + 1;
        if (half === 1) {
            REPLY = true;
        }
        LVL_INDEX += 1;
        LEVEL_DESCRIPTION = "resources/levels/" + Account.instance.levelOrder[LVL_INDEX + 1];
        //LEVEL_DESCRIPTION = "resources/levels/" + LVL_INDEX + ".json";
        BattleScene.instance.clearStarTimeouts();
        that.switchState("LevelMenuState01", that.id, that.parent.id, half === 1 ? true : false);
    });

    var btn = this.getGui("soundOn");
    btn.bind(function (e) {
        Sound.turnOn(false);
        that.getGui("soundOn").hide();
        that.getGui("soundOff").show();
    });

    var btn = this.getGui("soundOff");
    btn.bind(function (e) {
        Sound.turnOn(true);
        that.getGui("soundOff").hide();
        that.getGui("soundOn").show();
        Sound.playWithVolume("click");
    });

    var btn = this.getGui("startOK");
    btn.bind(function (e) {
        Sound.playWithVolume("click");
        hideStartMenu();
        var scene = Account.instance.getEntity("Scene01");
        if (LVL_INDEX !== 0) {
            scene.setTimeout(function () {
                scene.referee.whistle();
            }, 500);
        }
    });

    if (Loader['loadingMessageShowed']()) {
        Account.instance.backgroundState.fadeIn(
            REPLY ? 0 : LEVEL_FADE_TIME, "#0d5600", function () {
        		that.getGui("enhancedScene").jObject['css']("opacity", "0");
            	that.getGui("enhancedScene").fadeTo(1, LEVEL_FADE_TIME);
                Account.instance.backgroundState.fadeOut(LEVEL_FADE_TIME);
                Loader['hideLoadingMessage']();
                $(window)['trigger']("resize");
            });
    } else {
    	// Timeout for smooth animation
    	setTimeout(function(){
    		that.getGui("enhancedScene").jObject['css']("opacity", "0");
        	that.getGui("enhancedScene").fadeTo(1, LEVEL_FADE_TIME);
            Account.instance.backgroundState.fadeOut(LEVEL_FADE_TIME, function () {
                Account.instance.resize();
            });
    	},100);
    }

    showStartMenu();
};

GameState.prototype.destroy = function () {
//	GameState.parent.destroy.call(this);

    var scene = Account.instance.getEntity("Scene01");
//	$['each'](scene.children, function(idx, child) {
//		if (child)
//		child.destroy();
//		if (child.physics) Physics.getWorld().DestroyBody(child.physics);
//		Account.instance.removeEntity(child.id);
//		delete Account.instance.allEntities[child.id];
//		delete child;
//	});	
//	scene.destroy();

    GameState.parent.destroy.call(this);
    PlayerGuiCSprite.enemyPantsImage = null;
    PlayerGuiCSprite.enemyShirtImage = null;
    EnemyGuiCSprite.shirtImage = null;
    EnemyGuiCSprite.pantsImage = null;
    delete Account.instance.allEntities["Scene01"];
    delete Account.instance.allEntities[this.id];

    Account.instance.removeEntity("BallExplosion", true);
    Account.instance.removeEntity("BigBlockDestruction", true);
    Account.instance.removeEntity("SmallBlockDestruction", true);

    Physics.destroyWorld();
};

GameState.prototype.resize = function () {
    GameState.parent.resize.call(this);
    var scene = BattleScene.instance;
    scene.resize();

    var pos = scene.guiParent.getRealPosition();
    scene.canvasOffset = {x: parseInt(pos.x), y: parseInt(pos.y)};
};

GameState.prototype.switchState = function (state, id, parent, fade) {
	Account.instance.switchState(state, id?id:this.id, parent?parent:this.parent.id, fade?fade:false, this.getGui("enhancedScene"));
};/**
 * @constructor
 */
function Goal() {
    Goal.parent.constructor.call(this);
};

Goal.inheritsFrom(PhysicEntity);
Goal.prototype.className = "Goal";

Goal.prototype.createInstance = function (params) {
    var entity = new Goal();
    entity.init(params);
    Goal._instance = entity;
    return entity;
};

entityFactory.addClass(Goal);

Goal.prototype.init = function (params) {
    Goal.parent.init.call(this, params);
};

Goal.prototype.createVisual = function () {
    var that = this;
    var description = Account.instance.descriptionsData[this.params.type];
    this.angle = 0;

    $.each(description.visuals, function (id, visualInfo) {
        var gui = guiFactory.createObject(visualInfo['class'], $.extend({
            'parent': visualInfo['class'] === "GuiCSprite" ? BattleScene.instance.canvasDiv : that.guiParent,
            'style': "sprite",
            'x': that.params.x,
            'y': that.params.y
        }, visualInfo));
        if (gui.params.z) {
            gui.setZ(gui.params.z);
        }
        var offsetX = visualInfo.offsetX != null ? visualInfo.offsetX : 0;
        var offsetY = visualInfo.offsetY != null ? visualInfo.offsetY : 0;
        var visualInfo = {};
        visualInfo.offsetX = offsetX;
        visualInfo.offsetY = offsetY;
        visualInfo.visual = gui;
        that.addVisual(id, visualInfo);
    });
    this.updatePositionFromPhysics();
};

Goal.prototype.createPhysics = function () {
    Goal.parent.createPhysics.call(this);
};

Goal.prototype.attachToGui = function (guiParent) {
    Goal.parent.attachToGui.call(this, guiParent, false);
};

Goal.prototype.updatePhysics = function () {
    Goal.parent.updatePhysics.call(this);
};FootballContactListener.prototype.constructor = FootballContactListener;

function FootballContactListener() {
    var b2Listener = Box2D.Dynamics.b2ContactListener;
    //Add listeners for contact
    var listener = new b2Listener();

    /**
     * @returns {boolean} true if pair found
     */
    function checkPairByTypes(contact, bodyTypeA, bodyTypeB, callback) {
        if (bodyTypeA === null || bodyTypeB === null ||
            contact.m_fixtureA.m_body.m_userData.params.type === bodyTypeA && contact.m_fixtureB.m_body.m_userData.params.type ===
            bodyTypeB || contact.m_fixtureA.m_body.m_userData.params.type ===
            bodyTypeB && contact.m_fixtureB.m_body.m_userData.params.type === bodyTypeA) {
            callback(contact);
            return true;
        }
        return false;
    }

    function checkPairByClasses(contact, bodyClassA, bodyClassB, callback) {
        if (bodyClassA === null || bodyClassB === null ||
            contact.m_fixtureA.m_body.m_userData.params.class === bodyClassA && contact.m_fixtureB.m_body.m_userData.params.class ===
            bodyClassB || contact.m_fixtureA.m_body.m_userData.params.class ===
            bodyClassB && contact.m_fixtureB.m_body.m_userData.params.class === bodyClassA) {
            callback(contact);
            return true;
        }
        return false;
    }

    function onBallGoalBeginContact(contact) {
        var ballBody;
        var goalShape;
        if (contact.m_fixtureA.m_body.m_userData.params.type === "Ball") {
            ballBody = contact.m_fixtureA.m_body;
            goalShape = contact.m_fixtureB;
        } else {
            ballBody = contact.m_fixtureB.m_body;
            goalShape = contact.m_fixtureA;
        }
        if (goalShape.m_userData === "net") {
            //console.dir("net");
            var velocity = ballBody.GetLinearVelocity();
            var longthSquared = velocity.LengthSquared();
            //console.dir(longthSquared);
            FtSound.playSoundProfile("net", Account.instance.configData.sounds.net, longthSquared);

            velocity.Multiply(0.1);
            ballBody.SetLinearVelocity(velocity);
        } else if (goalShape.m_userData === "crossbar") {
            var longthSquared = ballBody.GetLinearVelocity().LengthSquared();
            FtSound.playSoundProfile("crossbar", Account.instance.configData.sounds.crossbar, longthSquared);
        } else if (goalShape.m_userData === "body") {
            var scene = Account.instance.getEntity("Scene01");
            scene.scoreGoal();
        }
    }

    function onDefaultContactBeginContact(contact) {
        var body1 = contact.m_fixtureA.m_body;
        var body2 = contact.m_fixtureB.m_body;

        var impulse1 = body1.m_mass * Math.pow(body1.m_linearVelocity.Length(), 2);
        var impulse2 = body2.m_mass * Math.pow(body2.m_linearVelocity.Length(), 2);

        if (body1.m_userData.params.type === "Ground") {
            impulse1 = impulse2 * 10;
        }

        var damage1 = impulse2 * SELF_DESTR_MULT;
        var damage2 = impulse1 * SELF_DESTR_MULT;

        var damage = damage1 + damage2;
        /*if (damage / 2 > 0.01 && !((body1.m_userData.params.type === "Ground" && body2.m_userData.params.type === "Ball") ||
         (body1.m_userData.params.type === "Ball" && body2.m_userData.params.type === "Ground"))) {
         console.dir("Contact: " + body1.m_userData.params.type + " && " + body2.m_userData.params.type + " Damage: " + damage / 2);
         }*/
        if (body1.m_userData && body1.m_userData.onDamage) {
            body1.m_userData.onDamage(damage / 2);
        }

        if (body2.m_userData && body2.m_userData.onDamage) {
            body2.m_userData.onDamage(damage / 2);
        }
    }

    function onBallStarBeginContact(contact) {
        if (contact.m_fixtureA.m_body.m_userData.params.type === "Star") {
            contact.m_fixtureA.m_body.m_userData.destroyAndPlayAnimation();
        } else {
            contact.m_fixtureB.m_body.m_userData.destroyAndPlayAnimation();
        }
        Sound.playWithVolume("star");
    }

    function onBallTeamPlayerBeginContact(contact) {
        var ballBody;
        var teamPlayer;
        if (contact.m_fixtureA.m_body.m_userData.params.type === "Ball") {
            ballBody = contact.m_fixtureA.m_body;
            teamPlayer = contact.m_fixtureB.m_body.m_userData;
        } else {
            ballBody = contact.m_fixtureB.m_body;
            teamPlayer = contact.m_fixtureA.m_body.m_userData;
        }
        teamPlayer.kickBall(ballBody);
    }

    function onBallGroundBeginContact(contact) {
        var ballBody;
        if (contact.m_fixtureA.m_body.m_userData.params.type === "Ball") {
            ballBody = contact.m_fixtureA.m_body;
        } else {
            ballBody = contact.m_fixtureB.m_body;
        }
        var velocity = ballBody.GetLinearVelocity();
        var lengthSquared = velocity.LengthSquared();
        //console.dir(lengthSquared);
        FtSound.playSoundProfile("ball_jump_" + (Math.random() < 0.5 ? 1 : 2), Account.instance.configData.sounds.ground, lengthSquared);
    }

    function onBallPlayerBeginContact(contact) {
        console.log("onBallPlayerBeginContact");
        BattleScene.instance.forceInitBallPosition();
    }

    function onBallEnemyBeginContact(contact) {
        var ballBody;
        var enemy;
        if (contact.m_fixtureA.m_body.m_userData.params.type === "Ball") {
            ballBody = contact.m_fixtureA.m_body;
            enemy = contact.m_fixtureB.m_body.m_userData;
        } else {
            ballBody = contact.m_fixtureB.m_body;
            enemy = contact.m_fixtureA.m_body.m_userData
        }
        var velocity = ballBody.GetLinearVelocity();
        var lengthSquared = velocity.LengthSquared();
        //console.dir("lengthSquared: " + lengthSquared);
        if (lengthSquared > Account.instance.configData.sounds.minBallSqVelocityToPlayEnemy) {
            var value = Math.random();
            var index = (value < 0.33 ? 1 : (value < 0.66 ? 2 : 3));
            Sound.playWithVolume("enemy_" + index);
            enemy.DoNotUpdate = true;
            var lineVisual = enemy.getVisual("line");
            lineVisual.setAnimationEndCallback(function() {
                enemy.DoNotUpdate = false;
            });
            enemy.playAnimation("surprised", 500, false,true);
        }
    }

    listener.BeginContact = function (contact) {
        if (checkPairByTypes(contact, "Ball", "Goal", onBallGoalBeginContact) ||
            checkPairByTypes(contact, "Ball", "Star", onBallStarBeginContact) ||
            checkPairByClasses(contact, "Ball", "TeamPlayer", onBallTeamPlayerBeginContact) ||
            checkPairByClasses(contact, "Ball", "Ground", onBallGroundBeginContact) ||
            checkPairByClasses(contact, "Ball", "Player", onBallPlayerBeginContact) ||
            checkPairByClasses(contact, "Ball", "Enemy", onBallEnemyBeginContact) ||
            checkPairByTypes(contact, null, null, onDefaultContactBeginContact)) {
            return;
        }
    };

    listener.EndContact = function (contact) {
        //console.dir(contact);
    };

    listener.PostSolve = function (contact, impulse) {
    };

    listener.PreSolve = function (contact, oldManifold) {
    };

    Physics.getWorld().SetContactListener(listener);
}

/**
 * @constructor
 */
function Referee() {
    Referee.parent.constructor.call(this);
};

Referee.inheritsFrom(PhysicEntity);
Referee.prototype.className = "Referee";

Referee.prototype.createInstance = function (params) {
    var entity = new Referee();
    entity.init(params);
    return entity;
};

entityFactory.addClass(Referee);

Referee.prototype.createVisual = function () {
    var that = this;
    var description = Account.instance.descriptionsData[this.params.type];

    $['each'](description.visuals, function (id, visualInfo) {
        var gui = guiFactory.createObject(visualInfo['class'], $.extend({
            'parent': visualInfo['class'] === "GuiSprite" ? that.guiParent : BattleScene.instance.canvasDiv,
            'style': "sprite",
            'x': that.params.x,
            'y': that.params.y
        }, visualInfo));
        if (gui.params.z) {
            gui.setZ(gui.params.z);
        }

        var resInfo = {};
        resInfo.visual = gui;
        that.addVisual(id, resInfo);
    });
    this.getVisual("referee").fadeTo(0, 0);
};

Referee.prototype.attachToGui = function (guiParent) {
    Referee.parent.attachToGui.call(this, guiParent, false);
};

Referee.prototype.whistle = function () {
    var visual = this.getVisual("referee");
    this.setTimeout(function(){
        visual.fadeTo(0, 700);
    }, 1400);
    visual.fadeTo(1, 500, function() {
        Sound.playWithVolume("referee");
    });
};/**
 * @constructor
 */
function Star() {
    Star.parent.constructor.call(this);
};

Star.inheritsFrom(PhysicEntity);
Star.prototype.className = "Star";

Star.prototype.createInstance = function (params) {
    var entity = new Star();
    entity.init(params);
    return entity;
};

entityFactory.addClass(Star);

Star.prototype.destroyAndPlayAnimation = function () {
    var that = this;
    this.visual.setAnimationEndCallback(function () {
        that.parent.score += Account.instance.configData.score.star;
        var gameState = Account.instance.getEntity("GameState01");
        var scoreCell = gameState.getGui("score");
        scoreCell.children.guiEntities[1].change((that.parent.score * Account.instance.configData.score.rate).toFixed(0));

        Star.parent.destroy.call(that);
    });
    this.visual.playAnimation("dest", 600, false, true);
};

Star.prototype.init = function (params) {
    Star.parent.init.call(this, params);
};

Star.prototype.createVisual = function () {
    var that = this;
    this.description = Account.instance.descriptionsData[this.params.type];
    this.angle = 0;
    var visualInfo = this.description.visuals.star;
    this.visual = guiFactory.createObject(visualInfo['class'], $['extend']({
        'parent': visualInfo['class'] === "GuiCSprite" ? BattleScene.instance.canvasDiv : that.guiParent,
        'style': "sprite",
        'x': that.params.x - that.description.visuals.star.width / 2,
        'y': that.params.y - that.description.visuals.star.height / 2
    }, that.description.visuals.star));
    if (this.visual.params.z) {
        this.visual.setZ(this.visual.params.z);
    }
    var visualInfo = {};
    visualInfo.visual = this.visual;
    this.addVisual("star", visualInfo);
};

Star.prototype.attachToGui = function (guiParent) {
    Star.parent.attachToGui.call(this, guiParent, false);
};

Star.prototype.getPosition = function () {
    return {
        "x": this.params.x,
        "y": this.params.y
    };
};

// use Circle rotation
Star.prototype.updatePositionFromPhysics = function () {
    var that = this;

    if (that.physics == null)
        return;
    var pos = this.getPosition();
    that.setPosition(pos.x - that.params.physics.x - that.params.physics.width / 2, pos.y - that.params.physics.y -
        that.params.physics.height / 2);

    $.each(this.visuals, function (id, visualInfo) {
        var angleInDeg = that.getPhysicsRotation().toFixed(3);
        angleInDeg = MathUtils.toDeg(angleInDeg);
        visualInfo.visual.rotate(angleInDeg);
    });
};/**
 * @constructor
 */
function TeamPlayer() {
    TeamPlayer.parent.constructor.call(this);
    this.direction = new b2Vec2(1, 0);
    this.powerRatio = 1;
    this.canKick = true;
};

TeamPlayer.inheritsFrom(PhysicEntity);
TeamPlayer.prototype.className = "TeamPlayer";

TeamPlayer.prototype.createInstance = function (params) {
    var entity = new TeamPlayer();
    entity.init(params);
    return entity;
};

entityFactory.addClass(TeamPlayer);

TeamPlayer.prototype.init = function (params) {
    TeamPlayer.parent.init.call(this, params);
    if (this.params.flipped) {
        this.direction = new b2Vec2(-1, 0);
    }
};

TeamPlayer.prototype.createVisual = function () {
    var that = this;
    var description = Account.instance.descriptionsData[this.params.type];

    $.each(description.visuals, function (id, visualInfo) {
        var gui = guiFactory.createObject(visualInfo['class'], $.extend({
            'parent': (visualInfo['class'] === "GuiSprite" || visualInfo['class'] === "PlayerGuiSprite") ? that.guiParent : BattleScene.instance.canvasDiv,
            'style': "sprite",
            'x': that.params.x,
            'y': that.params.y,
            'flipped': description.flipped != null ? description.flipped : false,
            'enemy': that.params.enemy ? that.params.enemy : false
        }, visualInfo));
        gui.setZ(gui.params.z);
        if (visualInfo.visible == false)
            gui.hide();
        var resInfo = {};
        resInfo.visual = gui;
        that.addVisual(id, resInfo);
    });
    function waitAndPlayAnimation() {
        var pantsAnimations = that.getVisual("pants").animations;
        var shirtAnimations = that.getVisual("shirt").animations;
        if (pantsAnimations && pantsAnimations["getReady"] && shirtAnimations && shirtAnimations["getReady"]) {
            that.playAnimation("getReady", 0, false, true);
            BattleScene.instance.sortEntities();
            that.updatePositionFromPhysics();
        } else {
            setTimeout(waitAndPlayAnimation, 50);
        }
    }

    waitAndPlayAnimation();
};

TeamPlayer.prototype.kickBall = function (ballBody) {
    var that = this;
    if (!this.canKick) {
        return;
    }
    this.canKick = false;

    this.setTimeout(function () {
            Sound.playWithVolume("shot");
            that.applyImpulseToBall(ballBody);
            that.canKick = true;
        }, FIRE_ANIMATION_OFFSET
    );

    that.playAnimation("fire", ANIMATION_SPEED, false, true);
};

TeamPlayer.prototype.applyImpulseToBall = function (ballBody) {
    var centerPos = ballBody.GetPosition();
    var impulse = new b2Vec2(this.direction.x, this.direction.y);
    impulse.Normalize();
    impulse.Multiply(this.powerRatio * Account.instance.configData.player.teamPlayerPowerRating);
    ballBody.SetAwake(true);
    ballBody.ApplyImpulse(impulse, new b2Vec2(centerPos.x, centerPos.y));
};

TeamPlayer.prototype.attachToGui = function (guiParent) {
    TeamPlayer.parent.attachToGui.call(this, guiParent, false);
};

TeamPlayer.prototype.playAnimation = Player.prototype.playAnimation;/**
 * @constructor
 */
function PlayerGuiSprite() {
    PlayerGuiSprite.parent.constructor.call(this);
};

PlayerGuiSprite.inheritsFrom(GuiSprite);
PlayerGuiSprite.prototype.className = "PlayerGuiSprite";

PlayerGuiSprite.prototype.createInstance = function (params) {
    var entity = new PlayerGuiSprite();
    entity.initialize(params);
    return entity;
};

guiFactory.addClass(PlayerGuiSprite);

PlayerGuiSprite.prototype.initialize = function (params) {
    if (!Device.isSupportsToDataURL()) {
        PlayerGuiSprite.parent.initialize.call(this, params);
        return;
    }
    GuiSprite.parent.initialize.call(this, params);
    if (params.enemy) {
        if (params.type === "shirt") {
            if (PlayerGuiSprite.enemyShirtImage == null) {
                var flag = Math.floor(LVL_INDEX > 19 ? LVL_INDEX / 2 - 5 : LVL_INDEX / 4);
                var enemyCountry = Account.instance.countries[Account.instance.usedFlags[flag]];
                var newColor = enemyCountry.shirtColor;
                if (newColor === Account.instance.countries[Account.instance.currentFlag].shirtColor &&
                    enemyCountry.pantsColor === Account.instance.countries[Account.instance.currentFlag].pantsColor) {
                    newColor = ColorRgb.Colors.GRAY;
                }
                var pair = new ColorRgbChangingPair(new ColorRgb(params.color[0], params.color[1], params.color[2]), newColor);
                var image = Resources.getAsset(params.totalImage);
                var url = recolorFullImage(image, pair);
                PlayerGuiSprite.enemyShirtImage = url;
            }
            this.totalSrc = PlayerGuiSprite.enemyShirtImage;
        } else if (params.type === "pants") {
            if (PlayerGuiSprite.enemyPantsImage == null) {
                var flag = Math.floor(LVL_INDEX > 19 ? LVL_INDEX / 2 - 5 : LVL_INDEX / 4);
                var enemyCountry = Account.instance.countries[Account.instance.usedFlags[flag]];
                var newColor = enemyCountry.pantsColor;
                if (newColor === Account.instance.countries[Account.instance.currentFlag].pantsColor &&
                    enemyCountry.shirtColor === Account.instance.countries[Account.instance.currentFlag].shirtColor) {
                    newColor = ColorRgb.Colors.GRAY;
                }
                var pair = new ColorRgbChangingPair(new ColorRgb(params.color[0], params.color[1], params.color[2]), newColor);
                var image = Resources.getAsset(params.totalImage);
                var url = recolorFullImage(image, pair);
                PlayerGuiSprite.enemyPantsImage = url;
            }
            this.totalSrc = PlayerGuiSprite.enemyPantsImage;
        }
    } else {
        if (params.type === "shirt") {
            if (PlayerGuiSprite.shirtImage == null) {
                var newColor = Account.instance.countries[Account.instance.currentFlag].shirtColor;
                var pair = new ColorRgbChangingPair(new ColorRgb(params.color[0], params.color[1], params.color[2]), newColor);
                var image = Resources.getAsset(params.totalImage);
                var url = recolorFullImage(image, pair);
                PlayerGuiSprite.shirtImage = url;
            }
            this.totalSrc = PlayerGuiSprite.shirtImage;
        } else if (params.type === "pants") {
            if (PlayerGuiSprite.pantsImage == null) {
                var newColor = Account.instance.countries[Account.instance.currentFlag].pantsColor;
                var pair = new ColorRgbChangingPair(new ColorRgb(params.color[0], params.color[1], params.color[2]), newColor);
                var image = Resources.getAsset(params.totalImage);
                var url = recolorFullImage(image, pair);
                PlayerGuiSprite.pantsImage = url;
            }
            this.totalSrc = PlayerGuiSprite.pantsImage;
        }
    }

    // .hack temporary disable viewport for sprites at all
    this.clampByViewport = this.clampByViewportSimple;
    this.totalWidth = params['totalImageWidth'];
    this.totalHeight = params['totalImageHeight'];
    this.frameCallback = null;
    this.offsetY1 = 0;
    this.offsetX1 = 0;

    if (params['totalTile'] == null) {
        this.totalTile = {
            x: 0,
            y: 0
        };
    } else {
        this.totalTile = params['totalTile'];
    }
    this.flipped = params['flipped'] != null ? params['flipped'] : false;

    this.setBackground(this.totalSrc);

    this.currentAnimation = null;
    this.spatialAnimation = null;
    this.animations = new Object();

    var that = this;
    if (params['spriteAnimations']) {
        $['each'](params['spriteAnimations'], function (name, value) {
            // console.log("Adding sprite animation " + name);
            that.addSpriteAnimation(name, value);
        });
    }

    this.jObject['css']("background-position", Math.floor(Screen.widthRatio()
        * this.totalTile.x * this.width)
        + "px "
        + Math.floor(Screen.heightRatio() * this.height * this.totalTile.y)
        + "px");

    this.resize();

    if (params['startAnimation']) {
        this.playAnimation(params['startAnimation']['name'],
            params['startAnimation']['duration'],
            params['startAnimation']['loop']);
        this.setStaticUpdate(true);
    }

    this.frames = {};
    if (params['frames']) {
        this.frames = params['frames'];
    }
};

PlayerGuiSprite.pantsImage = null;
PlayerGuiSprite.shirtImage = null;

PlayerGuiSprite.enemyPantsImage = null;
PlayerGuiSprite.enemyShirtImage = null;/**
 * @constructor
 */
function PlayerGuiCSprite() {
    PlayerGuiCSprite.parent.constructor.call(this);
};

PlayerGuiCSprite.inheritsFrom(GuiCSprite);
PlayerGuiCSprite.prototype.className = "PlayerGuiCSprite";

PlayerGuiCSprite.prototype.createInstance = function (params) {
    var entity = new PlayerGuiCSprite();
    entity.initialize(params);
    return entity;
};

guiFactory.addClass(PlayerGuiCSprite);

PlayerGuiCSprite.prototype.initialize = function (params) {
    if (!Device.isSupportsToDataURL()) {
        PlayerGuiCSprite.parent.initialize.call(this, params);
        return;
    }
    var that = this;
    this.params = params;

    if (params.enemy) {
        if (params.type === "shirt") {
            if (PlayerGuiCSprite.enemyShirtImage == null) {
                var flag = Math.floor(LVL_INDEX > 19 ? LVL_INDEX / 2 - 5 : LVL_INDEX / 4);
                var enemyCountry = Account.instance.countries[Account.instance.usedFlags[flag]];
                var newColor = enemyCountry.shirtColor;
                var pair = new ColorRgbChangingPair(new ColorRgb(params.color[0], params.color[1], params.color[2]), newColor);
                var image = Resources.getAsset(params.totalImage);
                var url = recolorFullImage(image, pair);
                PlayerGuiCSprite.enemyShirtImage = new Image();
                PlayerGuiCSprite.enemyShirtImage.onload = function () {
                    that.img = PlayerGuiCSprite.enemyShirtImage;
                    that.init();
                };
                PlayerGuiCSprite.enemyShirtImage.src = url;
            } else if (!isImageOk(PlayerGuiCSprite.enemyShirtImage)) {
                var oldOnload = PlayerGuiCSprite.enemyShirtImage.onload;
                PlayerGuiCSprite.enemyShirtImage.onload = function () {
                    if (oldOnload) {
                        oldOnload();
                    }
                    that.img = PlayerGuiCSprite.enemyShirtImage;
                    that.init();
                };
            } else {
                this.img = PlayerGuiCSprite.enemyShirtImage;
                that.init();
            }
        } else if (params.type === "pants") {
            if (PlayerGuiCSprite.enemyPantsImage == null) {
                var flag = Math.floor(LVL_INDEX > 19 ? LVL_INDEX / 2 - 5 : LVL_INDEX / 4);
                var enemyCountry = Account.instance.countries[Account.instance.usedFlags[flag]];
                var newColor = enemyCountry.pantsColor;
                var pair = new ColorRgbChangingPair(new ColorRgb(params.color[0], params.color[1], params.color[2]), newColor);
                var image = Resources.getAsset(params.totalImage);
                var url = recolorFullImage(image, pair);
                PlayerGuiCSprite.enemyPantsImage = new Image();
                PlayerGuiCSprite.enemyPantsImage.onload = function () {
                    that.img = PlayerGuiCSprite.enemyPantsImage;
                    that.init();
                };
                PlayerGuiCSprite.enemyPantsImage.src = url;
            } else if (!isImageOk(PlayerGuiCSprite.enemyPantsImage)) {
                var oldOnload = PlayerGuiCSprite.enemyPantsImage.onload;
                PlayerGuiCSprite.enemyPantsImage.onload = function () {
                    if (oldOnload) {
                        oldOnload();
                    }
                    that.img = PlayerGuiCSprite.enemyPantsImage;
                    that.init();
                };
            } else {
                this.img = PlayerGuiCSprite.enemyPantsImage;
                that.init();
            }
        }
    } else {
        if (params.type === "shirt") {
            if (PlayerGuiCSprite.shirtImage == null) {
                var newColor = Account.instance.countries[Account.instance.currentFlag].shirtColor;
                var pair = new ColorRgbChangingPair(new ColorRgb(params.color[0], params.color[1], params.color[2]), newColor);
                var image = Resources.getAsset(params.totalImage);
                var url = recolorFullImage(image, pair);
                PlayerGuiCSprite.shirtImage = new Image();
                PlayerGuiCSprite.shirtImage.onload = function () {
                    that.img = PlayerGuiCSprite.shirtImage;
                    that.init();
                };
                PlayerGuiCSprite.shirtImage.src = url;
            } else if (!isImageOk(PlayerGuiCSprite.shirtImage)) {
                var oldOnload = PlayerGuiCSprite.shirtImage.onload;
                PlayerGuiCSprite.shirtImage.onload = function () {
                    if (oldOnload) {
                        oldOnload();
                    }
                    that.img = PlayerGuiCSprite.shirtImage;
                    that.init();
                };
            } else {
                this.img = PlayerGuiCSprite.shirtImage;
                that.init();
            }
        } else if (params.type === "pants") {
            if (PlayerGuiCSprite.pantsImage == null) {
                var newColor = Account.instance.countries[Account.instance.currentFlag].pantsColor;
                var pair = new ColorRgbChangingPair(new ColorRgb(params.color[0], params.color[1], params.color[2]), newColor);
                var image = Resources.getAsset(params.totalImage);
                var url = recolorFullImage(image, pair);
                PlayerGuiCSprite.pantsImage = new Image();
                PlayerGuiCSprite.pantsImage.onload = function () {
                    that.img = PlayerGuiCSprite.pantsImage;
                    that.init();
                };
                PlayerGuiCSprite.pantsImage.src = url;
            } else if (!isImageOk(PlayerGuiCSprite.pantsImage)) {
                var oldOnload = PlayerGuiCSprite.pantsImage.onload;
                PlayerGuiCSprite.pantsImage.onload = function () {
                    if (oldOnload) {
                        oldOnload();
                    }
                    that.img = PlayerGuiCSprite.pantsImage;
                    that.init();
                };
            } else {
                this.img = PlayerGuiCSprite.pantsImage;
                that.init();
            }
        }
    }
};

PlayerGuiCSprite.prototype.init = function () {
    var that = this;
    var params = this.params;
    this.x = params.x || 0;
    this.y = params.y || 0;
    this.z = params.z || 0;

    this.flipped = params['flipped'] != null ? params['flipped'] : false;

    this.transformOrigin = params.transformOrigin || {x: 0.5, y: 0.5};
    this.frameSizeScale = params.frameSizeScale || {x: 1, y: 1};

    this.opacity = params.opacity ? params.opacity : 1;
    this.width = params.width;
    this.height = params.height;

    this.parent = params.parent.canvas ? params.parent.canvas : params.parent;
    this.id = this.parent.generateId.call(this);

    this.total = {
        image: params.totalImage,
        width: params.totalImageWidth,
        height: params.totalImageHeight,
        tile: params.totalTile
    };

    this.offsetX = params.offsetX || 0;
    this.offsetY = params.offsetY || 0;

    that.imageHeight = Math.round(Math.round(that.img.height / Math.round(that.total.height / that.height)));
    that.imageWidth = Math.round(Math.round(that.img.width / Math.round(that.total.width / that.width)));
    that.scale = {
        x: Math.round((that.width / that.imageWidth) * 100) / 100,
        y: Math.round((that.height / that.imageHeight) * 100) / 100
    };

    this.backgroundPosition = {
        x: 0,
        y: 0
    };

    this.backgroundSize = {
        w: this.total.width,
        h: this.total.height
    };

    this.rotate(0);

    this.resizeBackground();

    this.currentAnimation = null;
    this.spatialAnimation = null;
    this.animations = new Object();

    if (params['spriteAnimations']) {
        $['each'](params['spriteAnimations'], function (name, value) {
            that.addSpriteAnimation(name, value);
        });
    }

    this.frames = {};
    if (params['frames']) {
        this.frames = params['frames'];
    }

    if (this.parent.canvas) {
        this.parent.canvas.addGui(this);
    } else {
        this.parent.addGui(this);
    }

    this.show();
    this.setEnabled(true);
    Account.instance.addScheduledEntity(this);
};

PlayerGuiCSprite.pantsImage = null;
PlayerGuiCSprite.shirtImage = null;

PlayerGuiCSprite.enemyPantsImage = null;
PlayerGuiCSprite.enemyShirtImage = null;/**
 * @constructor
 */
function EnemyGuiSprite() {
    EnemyGuiSprite.parent.constructor.call(this);
};

EnemyGuiSprite.inheritsFrom(GuiSprite);
EnemyGuiSprite.prototype.className = "EnemyGuiSprite";

EnemyGuiSprite.prototype.createInstance = function(params) {
    var entity = new EnemyGuiSprite();
    entity.initialize(params);
    return entity;
};

guiFactory.addClass(EnemyGuiSprite);

EnemyGuiSprite.prototype.initialize = function (params) {
    if (!Device.isSupportsToDataURL()) {
        EnemyGuiSprite.parent.initialize.call(this, params);
        return;
    }
    GuiSprite.parent.initialize.call(this, params);
    if (params.type === "shirt") {
        if (EnemyGuiSprite.shirtImage == null) {
            var flag = Math.floor(LVL_INDEX > 19 ? LVL_INDEX / 2 - 5 : LVL_INDEX / 4);
            var enemyCountry = Account.instance.countries[Account.instance.usedFlags[flag]];
            var newColor = enemyCountry.shirtColor;
            if (newColor === Account.instance.countries[Account.instance.currentFlag].shirtColor &&
                enemyCountry.pantsColor === Account.instance.countries[Account.instance.currentFlag].pantsColor) {
                newColor = ColorRgb.Colors.GRAY;
            }
            var pair = new ColorRgbChangingPair(new ColorRgb(params.color[0], params.color[1], params.color[2]), newColor);
            var image = Resources.getAsset(params.totalImage);
            var url = recolorFullImage(image, pair);
            EnemyGuiSprite.shirtImage = url;
        }
        this.totalSrc = EnemyGuiSprite.shirtImage;
    } else if (params.type === "pants") {
        if (EnemyGuiSprite.pantsImage == null) {
            var flag = Math.floor(LVL_INDEX > 19 ? LVL_INDEX / 2 - 5 : LVL_INDEX / 4);
            var enemyCountry = Account.instance.countries[Account.instance.usedFlags[flag]];
            var newColor = enemyCountry.pantsColor;
            if (newColor === Account.instance.countries[Account.instance.currentFlag].pantsColor &&
                enemyCountry.shirtColor === Account.instance.countries[Account.instance.currentFlag].shirtColor) {
                newColor = ColorRgb.Colors.GRAY;
            }
            var pair = new ColorRgbChangingPair(new ColorRgb(params.color[0], params.color[1], params.color[2]), newColor);
            var image = Resources.getAsset(params.totalImage);
            var url = recolorFullImage(image, pair);
            EnemyGuiSprite.pantsImage = url;
        }
        this.totalSrc = EnemyGuiSprite.pantsImage;
    }

    // .hack temporary disable viewport for sprites at all
    this.clampByViewport = this.clampByViewportSimple;
    this.totalWidth = params['totalImageWidth'];
    this.totalHeight = params['totalImageHeight'];
    this.frameCallback = null;
    this.offsetY1 = 0;
    this.offsetX1 = 0;

    if (params['totalTile'] == null) {
        this.totalTile = {
            x: 0,
            y: 0
        };
    } else {
        this.totalTile = params['totalTile'];
    }
    this.flipped = params['flipped'] != null ? params['flipped'] : false;

    this.setBackground(this.totalSrc);

    this.currentAnimation = null;
    this.spatialAnimation = null;
    this.animations = new Object();

    var that = this;
    if (params['spriteAnimations']) {
        $['each'](params['spriteAnimations'], function (name, value) {
            // console.log("Adding sprite animation " + name);
            that.addSpriteAnimation(name, value);
        });
    }

    this.jObject['css']("background-position", Math.floor(Screen.widthRatio()
        * this.totalTile.x * this.width)
        + "px "
        + Math.floor(Screen.heightRatio() * this.height * this.totalTile.y)
        + "px");

    this.resize();

    if (params['startAnimation']) {
        this.playAnimation(params['startAnimation']['name'],
            params['startAnimation']['duration'],
            params['startAnimation']['loop']);
        this.setStaticUpdate(true);
    }

    this.frames = {};
    if (params['frames']) {
        this.frames = params['frames'];
    }
};

EnemyGuiSprite.pantsImage = null;
EnemyGuiSprite.shirtImage = null;function PlayerVisualGui() {
    VisualEntity.parent.constructor.call(this);
};

PlayerVisualGui.inheritsFrom(VisualEntity);
PlayerVisualGui.prototype.className = "PlayerVisualGui";

PlayerVisualGui.prototype.createInstance = function (params) {
    var entity = new PlayerVisualGui();
    entity.init(params);
    return entity;
};

entityFactory.addClass(PlayerVisualGui);

PlayerVisualGui.prototype.createVisual = function () {
    var that = this;
    var description = Account.instance.descriptionsData[this.params.type];

    $.each(description.visuals, function (id, visualInfo) {
        var gui = guiFactory.createObject(visualInfo['class'], $.extend({
            'parent': Account.instance.allEntities.GameState01.getGui("endGameMenu"),//that.guiParent,//"endGameMenu",
            'style': "sprite",
            'x': that.params.x,
            'y': that.params.y
        }, visualInfo));
        gui.setZ(gui.params.z);
        var resInfo = {};
        resInfo.visual = gui;
        that.addVisual(id, resInfo);
    });
    this.playAnimation("getReady", 0, false, true);
    this.hide();
};

PlayerVisualGui.prototype.playAnimation = function (animationName, duration, looped, independentUpdate) {
    Player.prototype.playAnimation.call(this, animationName, duration, looped, independentUpdate);
};

PlayerVisualGui.prototype.attachToGui = function (guiParent) {
    PlayerVisualGui.parent.attachToGui.call(this, guiParent, false);
};/**
 * @constructor
 */
function EnemyGuiCSprite() {
    EnemyGuiCSprite.parent.constructor.call(this);
};

EnemyGuiCSprite.inheritsFrom(GuiCSprite);
EnemyGuiCSprite.prototype.className = "EnemyGuiCSprite";

EnemyGuiCSprite.prototype.createInstance = function (params) {
    var entity = new EnemyGuiCSprite();
    entity.initialize(params);
    return entity;
};

guiFactory.addClass(EnemyGuiCSprite);

EnemyGuiCSprite.prototype.initialize = function (params) {
    if (!Device.isSupportsToDataURL()) {
        EnemyGuiCSprite.parent.initialize.call(this, params);
        return;
    }
    var that = this;
    this.params = params;

    if (params.type === "shirt") {
        if (EnemyGuiCSprite.shirtImage == null) {
            var flag = Math.floor(LVL_INDEX > 19 ? LVL_INDEX / 2 - 5 : LVL_INDEX / 4);
            var enemyCountry = Account.instance.countries[Account.instance.usedFlags[flag]];
            var newColor = enemyCountry.shirtColor;
            var pair = new ColorRgbChangingPair(new ColorRgb(params.color[0], params.color[1], params.color[2]), newColor);
            var image = Resources.getAsset(params.totalImage);
            var url = recolorFullImage(image, pair);
            EnemyGuiCSprite.shirtImage = new Image();
            EnemyGuiCSprite.shirtImage.onload = function () {
                that.img = EnemyGuiCSprite.shirtImage;
                that.init();
            };
            EnemyGuiCSprite.shirtImage.src = url;
        } else if (!isImageOk(EnemyGuiCSprite.shirtImage)) {
            var oldOnload = EnemyGuiCSprite.shirtImage.onload;
            EnemyGuiCSprite.shirtImage.onload = function () {
                if (oldOnload) {
                    oldOnload();
                }
                that.img = EnemyGuiCSprite.shirtImage;
                that.init();
            };
        } else {
            this.img = EnemyGuiCSprite.shirtImage;
            that.init();
        }
    } else if (params.type === "pants") {
        if (EnemyGuiCSprite.pantsImage == null) {
            var flag = Math.floor(LVL_INDEX > 19 ? LVL_INDEX / 2 - 5 : LVL_INDEX / 4);
            var enemyCountry = Account.instance.countries[Account.instance.usedFlags[flag]];
            var newColor = enemyCountry.pantsColor;
            var pair = new ColorRgbChangingPair(new ColorRgb(params.color[0], params.color[1], params.color[2]), newColor);
            var image = Resources.getAsset(params.totalImage);
            var url = recolorFullImage(image, pair);

            EnemyGuiCSprite.pantsImage = new Image();
            EnemyGuiCSprite.pantsImage.onload = function () {
                that.img = EnemyGuiCSprite.pantsImage;
                that.init();
            };
            EnemyGuiCSprite.pantsImage.src = url;
        } else if (!isImageOk(EnemyGuiCSprite.pantsImage)) {
            var oldOnload = EnemyGuiCSprite.pantsImage.onload;
            EnemyGuiCSprite.pantsImage.onload = function () {
                if (oldOnload) {
                    oldOnload();
                }
                that.img = EnemyGuiCSprite.pantsImage;
                that.init();
            };
        } else {
            this.img = EnemyGuiCSprite.pantsImage;
            that.init();
        }
    }
};

EnemyGuiCSprite.prototype.init = function () {
    var that = this;
    var params = this.params;

    this.x = params.x || 0;
    this.y = params.y || 0;
    this.z = params.z || 0;

    this.opacity = params.opacity ? params.opacity : 1;
    this.width = params.width;
    this.height = params.height;

    this.parent = params.parent.canvas ? params.parent.canvas : params.parent;
    this.id = this.parent.generateId.call(this);

    this.total = {
        image: params.totalImage,
        width: params.totalImageWidth,
        height: params.totalImageHeight,
        tile: params.totalTile
    };

    this.offsetX = params.offsetX || 0;
    this.offsetY = params.offsetY || 0;

    this.transformOrigin = params.transformOrigin || {x: 0.5, y: 0.5};
    this.frameSizeScale = params.frameSizeScale || {x: 1, y: 1};

    that.imageHeight = Math.round(Math.round(that.img.height / Math.round(that.total.height / that.height)));
    that.imageWidth = Math.round(Math.round(that.img.width / Math.round(that.total.width / that.width)));
    that.scale = {
        x: Math.round((that.width / that.imageWidth) * 100) / 100,
        y: Math.round((that.height / that.imageHeight) * 100) / 100
    };

    this.backgroundPosition = {
        x: 0,
        y: 0
    };

    this.backgroundSize = {
        w: this.total.width,
        h: this.total.height
    };

    this.rotate(0);

    this.resizeBackground();

    this.currentAnimation = null;
    this.spatialAnimation = null;
    this.animations = new Object();

    if (params['spriteAnimations']) {
        $['each'](params['spriteAnimations'], function (name, value) {
            that.addSpriteAnimation(name, value);
        });
    }

    this.frames = {};
    if (params['frames']) {
        this.frames = params['frames'];
    }

    if (this.parent.canvas) {
        this.parent.canvas.addGui(this);
    } else {
        this.parent.addGui(this);
    }

    this.show();
    this.setEnabled(true);
    Account.instance.addScheduledEntity(this);
};

EnemyGuiCSprite.pantsImage = null;
EnemyGuiCSprite.shirtImage = null;function PowerLineGuiCSprite() {
    PowerLineGuiCSprite.parent.constructor.call(this);
}

PowerLineGuiCSprite.inheritsFrom(GuiCSprite);
PowerLineGuiCSprite.prototype.className = "PowerLineGuiCSprite";

PowerLineGuiCSprite.prototype.createInstance = function (params) {
    var entity = new PowerLineGuiCSprite();
    entity.initialize(params);
    return entity;
};

guiFactory.addClass(PowerLineGuiCSprite);

PowerLineGuiCSprite.prototype.render = function (ctx) {
    if (!this.visible) {
        return;
    }

    var x = this.x * Screen.widthRatio() + BattleScene.instance.canvasOffset.x;
    var y = this.y * Screen.heightRatio() + BattleScene.instance.canvasOffset.y;
    var w = this.width * Screen.widthRatio();
    var h = this.height * Screen.heightRatio();

    // for rotation
    var width = this.params.width * Screen.widthRatio();
    var height = this.params.height * Screen.heightRatio();

    var translateWidth = width * this.transformOrigin.x;
    var translateHeight = height * this.transformOrigin.y;
    ctx.translate(x + translateWidth, y + translateHeight);
    // rotate around that point, converting our
    // angle from degrees to radians
    ctx.rotate(MathUtils.toRad(this.angle));

    ctx.globalAlpha = this.opacity;

    // this.backgroundPosition integers: {0,0}, {0,1}, etc
    var frameX = Math.ceil(this.backgroundPosition.x * this.imageWidth);
    var frameY = Math.ceil(this.backgroundPosition.y * this.imageHeight);

    // draw it up and to the left by half the width
    // and height of the image
    ctx.drawImage(this.img, frameX, frameY, this.imageWidth * this.frameSizeScale.x,
            this.imageHeight * this.frameSizeScale.y, -translateWidth, -translateHeight, w, h);
};