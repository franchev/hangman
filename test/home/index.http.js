describe('/', () => {
  let requestAgent;

  beforeEach(() => {
    requestAgent = request(app);
  });

  describe('GET', () => {
    it('responds with the home page', () =>
      requestAgent
        .get('/')
        .then((res) => {
          expect(res.status).to.equal(200);

          const $ = cheerio.load(res.text);
          expect($('title').text()).to.equal('Hello, world!');
        }));
  });
});
