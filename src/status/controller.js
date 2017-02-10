import os from 'os';
import uuid from 'uuid';

const instanceId = uuid.v4();

export default {
  getStatus(req, res) {
    const freemem = os.freemem();
    const totalmem = os.totalmem();
    const usedmem = totalmem - freemem;
    const freemempercent = ((freemem / totalmem) * 100);

    return res.json({
      freemem,
      freemempercent,
      instanceId,
      totalmem,
      usedmem,

      loadavg: os.loadavg(),
      uptime: os.uptime(),
    });
  },
};
