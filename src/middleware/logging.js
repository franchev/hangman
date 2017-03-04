export default function createLoggingMiddleware({
  logger,
  requestIdHeader = 'x-request-id',
  serializers,
  uuid,
}) {
  return function logRequest(req, res, next) {
    const id = req.get(requestIdHeader) || uuid.v4();

    req.log = logger.child({
      id,
      serializers,
      type: 'request',
    });
    res.set(requestIdHeader, id);

    const start = process.hrtime();
    res.on('finish', () => {
      const end = process.hrtime(start);
      const latency = (end[0] * 1e3) + (end[1] * 1e-6);
      req.log.info({ req, res, latency }, 'request');
    });

    next();
  };
}
