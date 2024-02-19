var http = require('http')
var https = require('https')
const { parse } = require('parse-open-graph')
const cheerio = require('cheerio')
const axios = require('axios')
const moment = require('moment')

const axiosClient = axios.create({
    timeout: 10000,
    withCredentials: false,
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
})

function parseMeta(html) {
    const $ = cheerio.load(html)

    const meta = $('meta[property]').map((i, el) => ({
        property: $(el).attr('property'),
        content: $(el).attr('content')
    })).get()

    return parse(meta)
}

function currentDateTime() {
    return moment().format('YYYY-MM-DD HH:mm:ss')
}

http.createServer(async function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*")

    // handle preflight request
    if (req.method.toUpperCase() === "OPTIONS") {
        res.statusCode = 204
        res.end()
        return
    }

    if (req.url == '/') {
        res.statusCode = 200
        res.end('ok')
        return
    }

    if (false == req.url.startsWith('/fetch/')) {
        res.statusCode = 400
        res.end("Invalid request.")
        return
    }

    const urlToFetch = req.url.substring('/fetch/'.length)

    if (urlToFetch.length == 0) {
        res.statusCode = 400
        res.end("Invalid request.")
        return
    }

    try {
        const response = await axiosClient.get(urlToFetch)

        res.statusCode = 200
        res.end(JSON.stringify(parseMeta(response.data)))
        return
    } catch (e) {
        console.log(`[${currentDateTime()}] Proxy failed for url: ${urlToFetch}`)
        console.log(e.message)

        res.statusCode = 500
        res.end()
        return
    }
}).listen(7000)
