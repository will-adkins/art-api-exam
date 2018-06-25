require('dotenv').config()
const port = process.env.PORT || 5000
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const NodeHTTPError = require('node-http-error')

const { not, propOr, isEmpty, pick, pathOr, prop } = require('ramda')

const checkMissingKeys = require('./lib/check-missing-keys')
const missingKeysMsg = require('./lib/missing-keys-msg')
const missingMuseumKeysMsg = require('./lib/missing-museum-keys-msg')

const {
  postPainting,
  getPainting,
  updatePainting,
  deletePainting,
  listPaintings,
  listPaintingsFind
} = require('./dal')

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
  const requiredMuseumKeys = ['name', 'location']

  if (not(isEmpty(checkMissingKeys(requiredKeys, newPainting)))) {
    next(
      new NodeHTTPError(
        400,
        missingKeysMsg(checkMissingKeys(requiredKeys, newPainting))
      )
    )
  }

  if (
    not(
      isEmpty(checkMissingKeys(requiredMuseumKeys, prop('museum', newPainting)))
    )
  ) {
    next(
      new NodeHTTPError(
        400,
        missingMuseumKeysMsg(
          checkMissingKeys(requiredMuseumKeys, prop('museum', newPainting))
        )
      )
    )
  }

  const cleanedPainting = pick(requiredKeys, newPainting)

  postPainting(cleanedPainting)
    .then(postResult => res.status(201).send(postResult))
    .catch(err => next(new NodeHTTPError(err.status, err.message, err)))
})

// Retrieve a painting

app.get('/paintings/:id', function(req, res, next) {
  const paintingID = pathOr('', ['params', 'id'], req)

  getPainting(paintingID)
    .then(painting => res.status(200).send(painting))
    .catch(err => next(new NodeHTTPError(err.status, err.message, err)))
})

// Update a painting

app.put('/paintings/:id', function(req, res, next) {
  const newPainting = propOr({}, 'body', req)

  if (isEmpty(newPainting)) {
    next(
      new NodeHTTPError(
        400,
        `You forgot to add a painting to the request body. Remember to use Content-Type: application/json, as that is the only format this api currently supports.`
      )
    )
  }

  const requiredKeys = [
    '_id',
    '_rev',
    'name',
    'movement',
    'artist',
    'yearCreated',
    'museum'
  ]

  if (not(isEmpty(checkMissingKeys(requiredKeys, newPainting)))) {
    next(
      new NodeHTTPError(
        400,
        missingKeysMsg(checkMissingKeys(requiredKeys, newPainting))
      )
    )
  }

  const requiredMuseumKeys = ['name', 'location']

  if (
    not(
      isEmpty(checkMissingKeys(requiredMuseumKeys, prop('museum', newPainting)))
    )
  ) {
    next(
      new NodeHTTPError(
        400,
        missingMuseumKeysMsg(
          checkMissingKeys(requiredMuseumKeys, prop('museum', newPainting))
        )
      )
    )
  }

  const cleanedPainting = pick(requiredKeys, newPainting)

  updatePainting(cleanedPainting)
    .then(putResult => res.status(201).send(putResult))
    .catch(err => next(new NodeHTTPError(err.status, err.message, err)))
})

// Delete a painting

app.delete('/paintings/:id', function(req, res, next) {
  const paintingID = pathOr('', ['params', 'id'], req)

  deletePainting(paintingID)
    .then(deleteResult => res.status(200).send(deleteResult))
    .catch(err => next(new NodeHTTPError(err.status, err.message, err)))
})

// List Paintings

app.get('/paintings', function(req, res, next) {
  const limit = Number(pathOr(5, ['query', 'limit'], req))
  const lastItem = pathOr(null, ['query', 'lastItem'], req)
  const filterQuery = pathOr(null, ['query', 'filter'], req)

  // db.alldocs Route
  listPaintings(limit, lastItem, filterQuery)
    .then(paintings => res.status(200).send(paintings))
    .catch(err => next(new NodeHTTPError(err.status, err.message, err)))
  // db.find Route
  // listPaintingsFind(limit, lastItem, filterQuery)
  //   .then(paintings => res.status(200).send(paintings))
  //   .catch(err => next(new NodeHTTPError(err.status, err.message, err)))
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
