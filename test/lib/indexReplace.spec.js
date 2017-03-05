import { indexReplace } from '../../src/lib';

describe('lib/indexReplace', () => {
  const word = 'apple';

  it('returns the same lettersMatched string if the letter is not in the word', () => {
    const lettersMatched = 'foo';
    const actual = indexReplace(lettersMatched, word, 'x');

    expect(actual).to.equal(lettersMatched);
  });

  it('returns an updated string with a single letter changed', () => {
    const lettersMatched = '_pple';
    const actual = indexReplace(lettersMatched, word, 'a');

    expect(actual).to.equal(word);
  });

  it('returns an updated string with multiple letters changed', () => {
    const lettersMatched = 'a__le';
    const actual = indexReplace(lettersMatched, word, 'p');

    expect(actual).to.equal(word);
  });
});
