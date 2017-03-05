export default function indexReplace(lettersMatched, word, letter) {
  if (lettersMatched.length !== word.length) {
    throw new Error('lettersMatched length is different than word\'s, cannot replace indices');
  }

  if (word.indexOf(letter) === -1) {
    return lettersMatched;
  }

  let updated = lettersMatched;
  let index = word.indexOf(letter);
  while (index > -1) {
    updated = `${updated.substr(0, index)}${letter}${updated.substr(index + 1)}`;
    index = word.indexOf(letter, index + 1);
  }
  return updated;
}
