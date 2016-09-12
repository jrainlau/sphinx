/**
 * Author: Jrain Lau
 * E-mail: jrainlau@163.com
 * Version: 0.0.1
 */
;(function (window, document, undefined) {
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var encodeUTF8 = Symbol('encodeUTF8');

var Sphinx = function () {
	function Sphinx() {
		var config = arguments.length <= 0 || arguments[0] === undefined ? { img: 'png' } : arguments[0];

		_classCallCheck(this, Sphinx);

		this.config = config;
	}

	_createClass(Sphinx, [{
		key: encodeUTF8,
		value: function value(str) {
			return str.replace(/[\u0080-\u07ff]/g, function (s) {
				var _s = s.charCodeAt(0);
				return String.fromCharCode(0xc0 | _s >> 6, 0x80 | _s & 0x3f);
			}).replace(/[\u0800-\uffff]/g, function (s) {
				var _s = s.charCodeAt(0);
				return String.fromCharCode(0xe0 | _s >> 12, 0x80 | _s >> 6 & 0x3f, 0x80 | _s & 0x3f);
			});
		}
	}, {
		key: 'encrypt',
		value: function encrypt(str) {
			if (str.length < 6) {
				str += '******';
			}
			var text = this[encodeUTF8](str);
			var pixel = Math.ceil((text.length + 2) / 3);
			var size = Math.ceil(Math.sqrt(pixel));
			var canvas = document.createElement('canvas');
			canvas.width = canvas.height = size;
			var context = canvas.getContext("2d"),
			    imageData = context.getImageData(0, 0, canvas.width, canvas.height),
			    pixels = imageData.data;
			for (var i = 0, j = 0, l = pixels.length; i < l; i++) {
				if (i % 4 == 3) {
					pixels[i] = 255;
					continue;
				}
				var code = text.charCodeAt(j++);
				if (isNaN(code)) break;
				pixels[i] = code;
			}
			context.putImageData(imageData, 0, 0);
			return canvas.toDataURL('image/' + this.config.img);
		}
	}, {
		key: 'decrypt',
		value: function decrypt(url) {
			var img = document.createElement('img');

			img.crossOrigin = "anonymous";
			img.src = url;

			return new Promise(function (resolve, reject) {
				img.onload = function () {
					var canvas = document.createElement('canvas');
					canvas.width = img.width;
					canvas.height = img.height;

					var context = canvas.getContext("2d");
					context.drawImage(img, 0, 0);
					var imageData = context.getImageData(0, 0, canvas.width, canvas.height),
					    pixels = imageData.data;

					var buffer = [];
					for (var i = 0, l = pixels.length + 2; i < l; i++) {
						if (i % 4 == 3) continue;
						if (!pixels[i]) break;
						buffer.push(String.fromCharCode(pixels[i]));
					}
					resolve(encodeURIComponent(buffer.join('')).replace(/(\*+$)/g, ''));
				};
			});
		}
	}]);

	if (typeof module === 'object' && typeof module.exports === 'object') {
    // CommonJS
    module.exports = exports = Sphinx

	} else if (typeof define === 'function' && define.amd) {
    // AMD support
    define(function () {
        return Sphinx
    })

	} else if (typeof window === 'object') {
    // Normal way
    window.Sphinx = Sphinx
	}

}();
})(window, document)