const { join, concat, compose } = require('ramda')

module.exports = missingKeys =>
  compose(
    concat(
      `You are missing the following keys in the 'museum' key of your painting object: `
    ),
    join(',')
  )(missingKeys)
