require('dotenv').config()
const port = process.env.PORT || 5000
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const NodeHTTPError = require('node-http-error')

const { not, propOr, isEmpty, pick } = require('ramda')

const checkMissingKeys = require('./lib/check-missing-keys')
const missingKeysMsg = require('./lib/missing-keys-msg')

const { postPainting } = require('./dal')

app.use(bodyParser.json())

app.get('/', function(req, res, next) {
  res.send('Welcome to the Art API. Manage all the paintings.')
})

// Step 2: Create a Painting
// name, movement, artist, yearCreated, and museum fields.
app.post('/paintings', function(req, res, next) {
  const newPainting = propOr({}, 'body', req)

  if (isEmpty(newPainting)) {
    next(
      new NodeHTTPError(
        400,
        `You forgot to add a painting to the request body. Remember to use Content-Type: application/json, as that is the only format this api currently supports.`
      )
    )
  }

  const requiredKeys = ['name', 'movement', 'artist', 'yearCreated', 'museum']

  if (not(isEmpty(checkMissingKeys(requiredKeys, newPainting)))) {
    next(
      new NodeHTTPError(
        400,
        missingKeysMsg(checkMissingKeys(requiredKeys, newPainting))
      )
    )
  }

  const cleanedPainting = pick(requiredKeys, newPainting)

  postPainting(cleanedPainting)
    .then(postResult => res.status(201).send(postResult))
    .catch(err => next(new NodeHTTPError(err.status, err.message, err)))
})

app.use(function(err, req, res, next) {
  console.log(
    `Error! \n\nMethod ${req.method} \nPath ${req.path} \n${JSON.stringify(
      err,
      null,
      2
    )}`
  )
  res.status(err.status || 500).send(err.message)
})

app.listen(port, () => console.log(`Success! Port: ${port}`))
