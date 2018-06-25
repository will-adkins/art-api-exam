require('dotenv').config()
const { merge, map, prop, propOr } = require('ramda')
const pkGen = require('./lib/pkGen')

const PouchDB = require('pouchdb-core')
PouchDB.plugin(require('pouchdb-adapter-http'))
PouchDB.plugin(require('pouchdb-find'))

const db = new PouchDB(
  `${process.env.COUCH_HOSTNAME}${process.env.COUCH_DBNAME}`
)

// Post Route
const postPainting = painting => {
  const modifiedPainting = merge({ _id: pkGen(painting) }, painting)

  return db.put(modifiedPainting)
}

// Get Single Painting Route
const getPainting = id => db.get(id)

// Put Route
const updatePainting = painting => db.put(painting)

// Delete Route
const deletePainting = id => db.get(id).then(painting => db.remove(painting))

const listPaintings = (limit, lastItem, filterQuery) => {
  return db
    .allDocs({
      include_docs: true,
      limit: limit,
      startkey: `${lastItem}/ufff0`
    })
    .then(paintings => map(prop('doc'), propOr([], 'rows', paintings)))
  }

module.exports = {
  postPainting,
  getPainting,
  updatePainting,
  deletePainting,
  listPaintings
}
