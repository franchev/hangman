describe('/status', () => {
  let requestAgent;

  beforeEach(() => {
    requestAgent = request(app);
  });

  describe('GET', () => {
    it('responds with a JSON object containing the server status', () =>
      requestAgent
        .get('/status')
        .then((res) => {
          expect(res.status).to.equal(200);

          expect(res.body).to.have.property('instanceId').that.is.a('string');
          expect(res.body).to.have.property('freemem').that.is.a('number');
          expect(res.body).to.have.property('loadavg').that.is.an('array');
          expect(res.body).to.have.property('totalmem').that.is.a('number');
          expect(res.body).to.have.property('uptime').that.is.a('number');
        }));
  });
});
