/**
 * Author: Jrain Lau
 * E-mail: jrainlau@163.com
 * Version: 0.0.1
 */
;(() => {
const encodeUTF8 = Symbol('encodeUTF8')
/**
 * Construct a new Sphinx instance by passing the configuration object
 *
 * @param {Object}	config    define the type of the image
 */
class Sphinx {
	constructor (config = {img: 'png'}) {
		this.config = config
	}

	[encodeUTF8] (str) {
		return str
			.replace(/[\u0080-\u07ff]/g, (s) => {
				let _s = s.charCodeAt(0)
				return String.fromCharCode(0xc0 | _s >> 6, 0x80 | _s & 0x3f)
			})
			.replace(/[\u0800-\uffff]/g, (s) => {
				let _s = s.charCodeAt(0)
				return String.fromCharCode(0xe0 | _s >> 12, 0x80 | _s >> 6 & 0x3f, 0x80 | _s & 0x3f)
			})
	}

	encrypt (str) {
		str += '******'
		let text = this[encodeUTF8](str)
		let pixel = Math.ceil((text.length + 2) / 3)
		let size = Math.ceil(Math.sqrt(pixel))
		let canvas = document.createElement('canvas')
	  canvas.width = canvas.height = size  
	  let context = canvas.getContext("2d"),  
      	imageData = context.getImageData(0, 0, canvas.width, canvas.height),  
      	pixels = imageData.data
	  for(let i = 0, j = 0, l = pixels.length; i < l; i++){  
      if (i % 4 == 3) {
          pixels[i] = 255
          continue
      }  
      let code = text.charCodeAt(j++)
      if (isNaN(code)) break
      pixels[i] = code
	  }  
	  context.putImageData(imageData, 0, 0)
	  return canvas.toDataURL(`image/${this.config.img}`)
	}

	decrypt (url) {
		let img = document.createElement('img')
		
		img.crossOrigin = "anonymous"
		img.src = url

		return new Promise ((resolve, reject) => {
			img.onload = () => {
				let canvas = document.createElement('canvas')
				canvas.width = img.width
	      canvas.height = img.height

	      let context = canvas.getContext("2d")
	      context.drawImage(img, 0, 0)
	      let imageData = context.getImageData(0, 0, canvas.width, canvas.height),  
	          pixels = imageData.data

	      let buffer = []
	      for (let i = 0, l = pixels.length + 2; i < l; i++) {  
	        if (i % 4 == 3) continue
	        if (!pixels[i]) break
	        buffer.push(String.fromCharCode(pixels[i]))
	      }
	      resolve(encodeURIComponent(buffer.join('')).replace(/(\*+$)/g, '').replace(/(%20)/g, ' '))
			}
		})
	}
}

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
})()