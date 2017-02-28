import Promise from 'bluebird';

export default function createWordService({ wordList }) {
  return {
    getRandomWord() {
      return Promise.try(() => {
        const index = Math.ceil(Math.random() * wordList.length);
        return wordList[index];
      });
    },
  };
}
