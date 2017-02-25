exports.up = (knex) => Promise.all([
  knex.schema.createTable('games', (t) => {
    t.uuid('id').primary().unique().notNull();
    t.string('wordLength').notNull();
    t.string('lettersGuessed').notNull();
    t.integer('remainingGuesses').notNull();
    t.boolean('isGameOver').notNull();
    t.boolean('isWinner').notNull();
    t.string('word').notNull();
    t.timestamp('createdOn').notNull().defaultTo(knex.fn.now());
    t.timestamp('updatedOn').notNull().defaultTo(knex.fn.now());
  }),
]);

exports.down = (knex) => Promise.all([
  knex.schema.dropTable('games'),
]);
