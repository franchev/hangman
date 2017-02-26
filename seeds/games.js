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
].map((game) => ({
  id: game.id,
  word: game.word,
  wordLength: game.word.length,
  lettersGuessed: game.lettersGuessed || '',
  remainingGuesses: game.remainingGuesses || 6,
  state: game.state || 'started',
  createdOn: now,
  updatedOn: now,
}));

exports.seed = (knex) => Promise.all([
  // Deletes ALL existing entries
  knex('games').del(),
  knex('games').insert(exports.games),
]);
