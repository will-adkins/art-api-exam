const {
  head,
  tail,
  concat,
  join,
  split,
  toLower,
  prop,
  compose
} = require('ramda')

const articleRemover = array => {
  //head(array) === 'the' || head(array) === 'a' || head(array) === 'an' ? tail(array) : array

  if (head(array) === 'the' || head(array) === 'a' || head(array) === 'an') {
    return tail(array)
  } else {
    return array
  }
}

module.exports = painting =>
  compose(
    concat('painting_'),
    join('_'),
    articleRemover,
    split(' '),
    toLower
  )(prop('name', painting))
