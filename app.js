require('dotenv').config()
const port = process.env.PORT || 5000
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const NodeHTTPError = require('node-http-error')
const {} = require('ramda')
const {} = require('./dal')

app.use(bodyParser.json())

app.get('/', function(req, res, next) {
  res.send('Welcome to the Art API. Manage all the paintings.')
})

app.use(function(err, req, res, next) {
  console.log(
    `Error! \n\nMethod ${req.method} \nPath ${req.path} \n${JSON.stringify(
      err,
      null,
      2
    )}`
  )
})

app.listen(port, () => console.log(`Success! Port: ${port}`))
