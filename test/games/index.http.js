describe('/api/v1/games', () => {
  const gameId = '827094e8-e38e-47db-b8da-cf167e16d3be';
  let randomGameId;
  let requestAgent;

  beforeEach(() => {
    randomGameId = generateRandomString('game-id');

    requestAgent = request(app);

    return knex.migrate.rollback()
      .then(() => knex.migrate.latest()
      .then(() => knex.seed.run()));
  });

  afterEach(() => knex.migrate.rollback());

  describe('GET /', () => {
    it('returns a 200 with an array of game objects', () =>
      requestAgent
        .get('/api/v1/games/')
        .accept('json')
        .then((res) => {
          expect(res.ok).to.be.ok;

          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length(2);
          expect(res.body[0].id).to.be.a('string');
        }));
  });

  describe('GET /:id', () => {
    it('returns a 200 with a corresponding game for a valid game ID', () =>
      requestAgent
        .get(`/api/v1/games/${gameId}`)
        .accept('json')
        .then((res) => {
          expect(res.ok).to.be.ok;

          expect(res.body.id).to.equal(gameId);
        }));

    it('returns a 404 for a game that does not exist', () =>
      requestAgent
        .get(`/api/v1/games/${randomGameId}`)
        .accept('json')
        .then((res) => {
          // expect(res.notFound).to.be.ok;
          expect(res.status).to.equal(404);

          const { statusCode, message } = res.body;
          expect(statusCode).to.equal(404);
          expect(message).to.contain(`No game with ID ${randomGameId} exists.`);
        }));
  });

  describe('POST /', () => {
    it('returns a 201 with a new game', () =>
      requestAgent
        .post('/api/v1/games')
        .accept('json')
        .then((res) => {
          expect(res.status).to.equal(201);

          expect(res.body.id).to.be.ok;
        }));
  });

  describe('DELETE /:id', () => {
    it('returns a 204 to indicate a game was successfully removed', () =>
      requestAgent
        .post('/api/v1/games')
        .accept('json')
        .then((res) => res.body.id)
        .then((id) =>
          requestAgent
            .delete(`/api/v1/games/${id}`))
        .then((res) => {
          expect(res.status).to.equal(204);
        }));

    it('returns a 204 even if removing a game that does not exist', () =>
      requestAgent
        .delete(`/api/v1/games/${randomGameId}`)
        .then((res) => {
          expect(res.status).to.equal(204);
        }));
  });
});
