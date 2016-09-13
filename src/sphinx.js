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
		str += '      '
		let text = this[encodeUTF8](str)
		let pixelNum = Math.ceil((text.length) / 3) // One pixel could store 3 bytes by its RGB
		let canvas = document.createElement('canvas')
	  canvas.width = canvas.height = Math.ceil(Math.sqrt(pixelNum))

	  let ctx = canvas.getContext('2d'),
	  		imgData = ctx.createImageData(canvas.width, canvas.height)

	  for(let i = 0, j = 0, l = imgData.data.length; i < l; i++){
      if (i % 4 == 3) {
        imgData.data[i] = 255
        continue
      }  
      let code = text.charCodeAt(j++)
      if (isNaN(code)) break
      imgData.data[i] = code
	  } 

	  ctx.putImageData(imgData, 0, 0)
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

	      let ctx = canvas.getContext("2d")
	      ctx.drawImage(img, 0, 0)
	      let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)

	      let decodeArr = []
	      for (let i = 0, l = imgData.data.length; i < l; i++) {  
	        if (i % 4 == 3) continue
	        if (!imgData.data[i]) break
	        decodeArr.push(String.fromCharCode(imgData.data[i]))
	      }
	      resolve(decodeURIComponent(decodeArr.join('')))
			}
		})
	}
}

if (typeof module === 'object' && typeof module.exports === 'object') {
  // CommonJS
  module.exports = exports = Sphinx

} else if (typeof define === 'function' && define.amd) {
  // AMD support
  define(() => Sphinx)

} else if (typeof window === 'object') {
  // Normal way
  window.Sphinx = Sphinx
}

})()