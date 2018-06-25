require('dotenv').config()
const {
  merge,
  map,
  prop,
  propOr,
  split,
  filter,
  compose,
  propEq,
  not,
  reduce,
  head,
  last,
  tail,
  curry,
  isNil
} = require('ramda')
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

////////////////////////
// Helper Functions
///////////////////////
// greater than comparator predicate
const gt = curry((key, value, painting) => {
  return prop(key, painting) > value
})
// greater than or equal to comparator predicate
const gte = curry((key, value, painting) => {
  return prop(key, painting) >= value
})
// less than or equal to comparator predicate
const lte = curry((key, value, painting) => {
  return prop(key, painting) <= value
})
// less than or equal to comparator predicate
const lt = curry((key, value, painting) => {
  return prop(key, painting) < value
})

// Get list of paintings route
const listPaintings = (limit, startkey, filterQuery) => {
  if (not(isNil(filterQuery))) {
    const filterArray = split(':', filterQuery)
    const key = head(filterArray)
    const value = not(Number.isNaN(Number(value)))
      ? Number(last(filterArray))
      : last(filterArray)

    const comparator = head(tail(filterArray))

    const comparatorFn =
      comparator === 'gt'
        ? gt(key, value)
        : comparator === 'gte'
          ? gte(key, value)
          : comparator === 'lt'
            ? lt(key, value)
            : comparator === 'lte'
              ? lte(key, value)
              : propEq(key, value)

    return db
      .allDocs({
        include_docs: true
      })
      .then(paintings =>
        compose(
          reduce((acc, painting) => {
            if (acc.length < limit) {
              acc.push(painting)
              return acc
            } else return acc
          }, []),
          filter(comparatorFn),
          map(prop('doc'))
        )(propOr([], 'rows', paintings))
      )
  } else
    return db
      .allDocs(
        startkey
          ? {
              include_docs: true,
              limit: limit,
              startkey: `${startkey}\ufff0`
            }
          : {
              include_docs: true,
              limit: limit,
              startkey: 'painting_',
              endkey: 'painting_\ufff0'
            }
      )
      .then(paintings => map(prop('doc'), propOr([], 'rows', paintings)))
}

const listPaintingsFind = (limit, startkey, filterQuery) => {
  //if (filterQuery) {
  const [key, value] = split(':', filterQuery)

  return db
    .find({
      selector: { type: 'painting' }
    })
    .then(bookmark => console.log(bookmark))
    .catch(err => console.log(err))
  //  } else return listPaintings(limit, startkey)
}

module.exports = {
  postPainting,
  getPainting,
  updatePainting,
  deletePainting,
  listPaintings,
  listPaintingsFind
}
