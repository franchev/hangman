exports.up = (knex) => Promise.all([
  knex.schema.createTable('games', (t) => {
    t.uuid('id').primary().unique();
    t.string('wordLength');
    t.string('lettersGuessed');
    t.integer('remainingIncorrectGuesses');
    t.boolean('isGameOver');
    t.boolean('isWinner');
    t.string('word');
    t.timestamp('createdOn').defaultTo(knex.fn.now());
    t.timestamp('updatedOn').defaultTo(knex.fn.now());
  }),
]);

exports.down = (knex) => Promise.all([
  knex.schema.dropTable('games'),
]);
