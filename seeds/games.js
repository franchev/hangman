exports.seed = (knex) => Promise.all([
  // Deletes ALL existing entries
  knex('games').del(),
  knex('games').insert([
    {
      id: '827094e8-e38e-47db-b8da-cf167e16d3be',
      word: 'pineapple',
      wordLength: 10,
      lettersGuessed: '',
      remainingIncorrectGuesses: 6,
      isGameOver: false,
      isWinner: false,
    },
    {
      id: 'e20692e1-8646-4a72-9fa0-dab623ff8c9a',
      word: 'anagram',
      wordLength: 7,
      lettersGuessed: '',
      remainingIncorrectGuesses: 6,
      isGameOver: false,
      isWinner: false,
    },
  ]),
]);
