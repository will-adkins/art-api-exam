const { join, concat, compose } = require('ramda')

module.exports = missingKeys =>
  compose(
    concat(`You are missing the following keys in your painting object: `),
    join(',')
  )(missingKeys)
