import guessLetterValidator from '../../src/games/validator';

describe('games/validator', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {
        letter: 'a',
      },
    };
    res = {
      status: sinon.stub(),
      json: sinon.spy(),
    };
    next = sinon.spy();
  });

  it('responds with a 400 if the guess is not a single character', () => {
    req.body.letter = 'ab';

    res.status.withArgs(400).returns(res);

    guessLetterValidator(req, res, next);

    expect(res.status).to.be.calledOnce;
    expect(res.json).to.be.calledOnce.and.deep.calledWith({
      message: 'A guess must be a single letter',
    });
  });

  it('responds with a 400 if the guess is not a letter in the English alphabet', () => {
    req.body.letter = '1';

    res.status.withArgs(400).returns(res);

    guessLetterValidator(req, res, next);

    expect(res.status).to.be.calledOnce;
    expect(res.json).to.be.calledOnce.and.deep.calledWith({
      message: 'A guess must be a letter in the English alphabet',
    });
  });

  it('calls next if validation is successful', () => {
    guessLetterValidator(req, res, next);

    expect(next).to.be.calledOnce.and.calledWith();
  });
});
