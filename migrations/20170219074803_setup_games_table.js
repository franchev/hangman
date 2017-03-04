const values = require('lodash/values');
const GAME_STATE = require('../src/services/gameService').GAME_STATE;

exports.up = (knex) => Promise.all([
  knex.schema.createTable('games', (t) => {
    t.uuid('id').primary().unique().notNull();
    t.string('wordLength').notNull();
    t.string('lettersGuessed').notNull();
    t.string('lettersMatched').notNull();
    t.integer('remainingGuesses').notNull();
    t.enu('state', values(GAME_STATE)).notNull();
    t.string('word').notNull();
    t.timestamp('createdOn').notNull().defaultTo(knex.fn.now());
    t.timestamp('updatedOn').notNull().defaultTo(knex.fn.now());
  }),
]);

exports.down = (knex) => Promise.all([
  knex.schema.dropTable('games'),
]);
