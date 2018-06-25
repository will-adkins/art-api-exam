require('dotenv').config()
const { merge } = require('ramda')
const pkGen = require('./lib/pkGen')

const PouchDB = require('pouchdb-core')
PouchDB.plugin(require('pouchdb-adapter-http'))
PouchDB.plugin(require('pouchdb-find'))

const db = new PouchDB(
  `${process.env.COUCH_HOSTNAME}${process.env.COUCH_DBNAME}`
)

const postPainting = painting => {
  const modifiedPainting = merge({ _id: pkGen(painting) }, painting)

  return db.put(modifiedPainting)
}

module.exports = { postPainting }
