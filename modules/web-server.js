const http = require('node:http')
const { URL } = require('node:url')
const fs = require('node:fs')
const path = require('node:path')
const port = 9000

const map = {
	'.ico': 'image/x-icon',
	'.html': 'text/html',
	'.js': 'text/javascript',
	'.json': 'application/json',
	'.css': 'text/css',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.webp': 'image/webp',
	'.wav': 'audio/wav',
	'.mp3': 'audio/mpeg',
	'.svg': 'image/svg+xml',
	'.mp4': 'video/mp4',
	'.webm': 'video/webm',
	'.pdf': 'application/pdf',
	'.zip': 'application/zip'
}

let webServer

exports.createWebServer = (root) => {
	console.log(`Creating web server at root ${root}`)

	if (webServer) {
		webServer.close()
	}

	webServer = http.createServer(function (req, res) {
		// console.log(req)
		console.log(`${req.method} ${req.url}`)

		// parse URL
		// const parsedUrl = url.parse(req.url)
		// console.log(parsedUrl)
		const newUrl = new URL(req.url.substring(1), `file:///${root}/`)
		// console.log(newUrl)
		// console.log(newUrl.pathname.substring(root.length + 1))
		// extract URL path
		let pathname = `${root}${newUrl.pathname.substring(root.length + 1)}`
		// based on the URL path, extract the file extension. e.g. .js, .doc, ...
		let ext = path.parse(pathname).ext
		// maps file extension to MIME typere

		if (fs.existsSync(pathname)) {
			// if is a directory search for index file matching the extension
			if (fs.statSync(pathname).isDirectory()) {
				pathname += '/index.html'
				ext = '.html'
			}
			// read file from file system
			try {
				const file = fs.readFileSync(pathname)
				res.setHeader('Content-type', map[ext] || 'text/plain')
				res.end(file)
			} catch (error) {
				console.log(error)
				res.statusCode = 500
				res.end(`Error getting the file: ${error.message}.`)
			}
		} else {
			res.statusCode = 404
			res.end(`File ${pathname} not found!`)
		}
	})

	webServer.listen(parseInt(port))

	console.log(`Server listening on port ${port}`)
}
