import controller from '../../src/status/controller';

describe('status/controller', () => {
  let req;
  let res;
  beforeEach(() => {
    req = {};
    res = {
      json: sinon.spy(),
    };
  });

  describe('#getStatus', () => {
    it('responds with an object indicating the current server status', () => {
      controller.getStatus(req, res);

      expect(res.json).to.be.calledOnce;

      const actual = res.json.getCall(0).args[0];

      expect(actual).to.have.property('instanceId').that.is.a('string');
      expect(actual).to.have.property('freemem').that.is.a('number');
      expect(actual).to.have.property('loadavg').that.is.an('array');
      expect(actual).to.have.property('totalmem').that.is.a('number');
      expect(actual).to.have.property('uptime').that.is.a('number');
    });
  });
});
