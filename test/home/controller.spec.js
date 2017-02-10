import controller from '../../src/home/controller';

describe('home/controller', () => {
  let req;
  let res;
  beforeEach(() => {
    req = {};
    res = {
      render: sinon.spy(),
    };
  });

  describe('#getHome', () => {
    it('renders the index page', () => {
      controller.getHome(req, res);

      expect(res.render).to.be.calledOnce.and.calledWith('index');
    });
  });
});
