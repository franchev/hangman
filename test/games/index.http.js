describe('/api/v1/games', () => {
  const gameId = '827094e8-e38e-47db-b8da-cf167e16d3be';
  const randomGameId = generateRandomString('game-id');
  let requestAgent;

  beforeEach(() => {
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

  describe('GET /{id}', () => {
    it('returns a 200 with a corresponding game for a valid game ID', () =>
      requestAgent
        .get(`/api/v1/games/${gameId}`)
        .accept('json')
        .then((res) => {
          expect(res.ok).to.be.ok;
          expect(res.type).to.equal('application/json');
        }));

    it('returns a 404 for a game that does not exist', () =>
      requestAgent
        .get(`/api/v1/games/${randomGameId}`)
        .accept('json')
        .then((res) => {
          // expect(res.notFound).to.be.ok;
          expect(res.status).to.equal(404);
          expect(res.type).to.equal('application/json');

          const { statusCode, message } = res.body;
          expect(statusCode).to.equal(404);
          expect(message).to.contain(`No game with ID ${randomGameId} exists.`);
        }));
  });
});
