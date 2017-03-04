const moment = require('moment');

const now = moment().format();

exports.games = [
  {
    id: '827094e8-e38e-47db-b8da-cf167e16d3be',
    word: 'pineapple',
  },
  {
    id: 'e20692e1-8646-4a72-9fa0-dab623ff8c9a',
    word: 'anagram',
  },
].map((game) => {
  const wordLength = game.word.length;

  return {
    id: game.id,
    word: game.word,
    wordLength,
    lettersGuessed: game.lettersGuessed || '',
    lettersMatched: Array(wordLength).fill('_').join(''),
    remainingGuesses: game.remainingGuesses || 6,
    state: game.state || 'started',
    createdOn: now,
    updatedOn: now,
  };
});

exports.seed = (knex) => Promise.all([
  // Deletes ALL existing entries
  knex('games').del(),
  knex('games').insert(exports.games),
]);
