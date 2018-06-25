const { difference, keys } = require('ramda')

module.exports = (reqKeys, obj) => difference(reqKeys, keys(obj))
