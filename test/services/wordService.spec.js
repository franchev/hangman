import createWordService from '../../src/services/wordService';

describe('services/wordService', () => {
  const wordList = [
    'apple',
    'banana',
    'cranberry',
    'pineapple',
    'watermelon',
  ];

  let wordService;

  beforeEach(() => {
    wordService = createWordService({ wordList });
  });

  describe('#getRandomWord', () => {
    let oldRandom;

    beforeEach(() => {
      oldRandom = Math.random;

      Math.random = sinon.stub();
    });

    afterEach(() => {
      Math.random = oldRandom;
    });

    /*
     * Testing Math.random is a pain. Instead, pretend that Math.random() returns 1 for this test.
     * Using the logic of the method, we can then assume that returning a 1 will give us the last
     * value in the wordList.
     */
    it('returns a resolved Promise with a randomly-selected word', () => {
      const expectedWord = wordList[wordList.length];

      Math.random.returns(1);

      const response = wordService.getRandomWord();

      return expect(response).to.be.eventually.fulfilled.then((word) => {
        expect(word).to.equal(expectedWord);
      });
    });
  });
});
