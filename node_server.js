'use strict'
const fs = require('fs')
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let buffer = ''

    req.on('data', (data) => {
      buffer += data
    })

    req.on('end', () => {
      let jsonWithData = JSON.parse(buffer)
      let examples = fs.readFileSync('examples.json', 'utf-8')
      if (jsonWithData['addOrDelete'] === 'deleteElem') {
        examples.splice(jsonWithData['jsonData'], 1)
      }
      if (jsonWithData[addOrDelete] === 'addElem') {
        examplses.push(jsonWithData['jsonData'])
      }
      let stringified = JSON.stringify(examples)
      fs.writeFileSync('examples.json', stringified)
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(stringified)
    })
  } else if (req.method === 'GET' && req.url.match(/examples/)) {
    let examples = fs.readFileSync('examples.json', 'utf-8')
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(examples)
  } else {
    res.end('ok')
  }

})

server.listen(3000, '127.0.0.1')
