export default function indexReplace(lettersMatched, word, letter) {
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
