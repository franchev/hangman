import { stdSerializers } from 'bunyan';
import { EventEmitter } from 'events';

import createLoggingMiddleware from '../../src/middleware/logging';

describe('middleware/logging', () => {
  let logger;
  let requestLogger;
  let req;
  let res;
  let next;
  let id;
  let requestIdHeader;
  let uuid;

  beforeEach(() => {
    logger = {
      child: sinon.stub(),
      info: sinon.spy(),
    };
    uuid = {
      v4: sinon.stub(),
    };

    id = generateRandomString('request-id');
    requestIdHeader = generateRandomString('request-id-header');
    req = {
      get: sinon.stub(),
    };
    res = {
      set: sinon.spy(),
      on: sinon.spy(),
    };
    next = sinon.spy();

    requestLogger = createLoggingMiddleware({
      logger,
      uuid,
      serializers: stdSerializers,
    });
  });

  it('returns a middleware function', () => {
    expect(requestLogger).to.be.a('function');
  });

  describe('managing request IDs', () => {
    it('gets an ID off the request from an existing "X-Request-ID" header for logging', () => {
      req.get.withArgs('x-request-id').returns(id);

      requestLogger(req, res, next);

      expect(logger.child).to.have.been.calledOnce.and.deep.calledWith({
        id,
        type: 'request',
        serializers: stdSerializers,
      });
    });

    it('looks up the request ID in a custom header value if specified', () => {
      req.get.withArgs(requestIdHeader).returns(id);

      requestLogger = createLoggingMiddleware({
        logger,
        requestIdHeader,
        uuid,
        serializers: stdSerializers,
      });
      requestLogger(req, res, next);

      expect(logger.child).to.have.been.calledOnce.and.deep.calledWith({
        id,
        type: 'request',
        serializers: stdSerializers,
      });
    });

    it('generates a new ID if one is not in the request headers', () => {
      uuid.v4.returns(id);

      requestLogger(req, res, next);

      expect(logger.child).to.have.been.calledOnce.and.deep.calledWith({
        id,
        type: 'request',
        serializers: stdSerializers,
      });
    });

    it('adds the request ID to the response', () => {
      req.get.withArgs('x-request-id').returns(id);

      requestLogger(req, res, next);

      expect(res.set).to.have.been.calledOnce.and.calledWith('x-request-id', id);
    });
  });

  it('adds a "log" property onto the request as a logging utility', () => {
    const childLogger = {};
    logger.child.returns(childLogger);

    requestLogger(req, res, next);

    expect(req.log).to.equal(childLogger);
  });

  describe('when calculating request duration', () => {
    it('adds a callback function on the response "finish" event', () => {
      requestLogger(req, res, next);

      expect(res.on).to.have.been.calledOnce.and.calledWith('finish', sinon.match.func);
    });

    it('adds the latency onto the log output', () => {
      res = new EventEmitter();
      res.set = sinon.spy();
      logger.child.returns(logger);

      requestLogger(req, res, next);

      res.emit('finish');

      expect(req.log.info).to.have.been.calledOnce.and.deep.calledWith({
        req,
        res,
        latency: sinon.match.number,
      });
    });
  });

  it('calls next when finished processing a request', () => {
    requestLogger(req, res, next);

    expect(next).to.have.been.calledOnce;
  });
});
