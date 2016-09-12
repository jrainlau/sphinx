# SphinxJS
Encrypt / decrypt the information to / from the image.

## Usage
Install SphinxJS from npm
```
npm install sphinx.js
```

Use `<script></script>` tags

```
<script src="sphinx.js"></script>
```

> `SphinxJS` also supports `AMD`, `CommonJS` and `ES6 Modules`

## Encrypt
Defined a string as `Hello Sphinx!`, and we're going to encrypt it.

```
let base64URL = new Sphinx().encrypt('Hello Sphinx!')
```

Then the `base64URL` is equal to `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAADCAYAAABWKLW/AAAAJklEQVQYV2P0SM35r8K1heE5owcDY2Zexf8dezYxcDIwMDAyIAEA7EYIq6UNAkYAAAAASUVORK5CYII=`, the string information has encrypted to an image successfully.

As you see, the `encrypt()` function returns a base64 url of an image.

## Decrypt
Defined an image url

```
let url = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAADCAYAAABWKLW/AAAAJklEQVQYV2P0SM35r8K1heE5owcDY2Zexf8dezYxcDIwMDAyIAEA7EYIq6UNAkYAAAAASUVORK5CYII=`
```

Now decrypt it!
```
new Sphinx().decrypt(url)
	.then((info) => {
		console.log(info) // Hello Sphinx!
	})
```

The `decrypt()` function returns a `Promise`, which includes the string information descrypted from the image.

## Config
The `new Sphinx()` could recieve a config object to select the type of the image it created.
- config {Object} `optional` `default: {img: 'png'}`

```
new Sphinx({img: 'bmp'})
```

## License
MIT

