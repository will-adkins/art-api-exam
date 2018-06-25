require('dotenv').config()
const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-find'))
const db = new PouchDB(
  `${process.env.COUCH_HOSTNAME}${process.env.COUCH_DBNAME}`
)

db.createIndex({ index: { fields: ['name'] } }, function(err, result) {
  if (err) console.log('ERROR! ', JSON.stringify(err, null, 2))
  else console.log('SUCCESS! ', JSON.stringify(result, null, 2))
})

db.createIndex({ index: { fields: ['movement'] } }, function(err, result) {
  if (err) console.log('ERROR! ', JSON.stringify(err, null, 2))
  else console.log('SUCCESS! ', JSON.stringify(result, null, 2))
})

db.createIndex({ index: { fields: ['artist'] } }, function(err, result) {
  if (err) console.log('ERROR! ', JSON.stringify(err, null, 2))
  else console.log('SUCCESS! ', JSON.stringify(result, null, 2))
})

db.createIndex({ index: { fields: ['year'] } }, function(err, result) {
  if (err) console.log('ERROR! ', JSON.stringify(err, null, 2))
  else console.log('SUCCESS! ', JSON.stringify(result, null, 2))
})
