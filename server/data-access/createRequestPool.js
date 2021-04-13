const Pool = require('./Pool');
const { FLUSH_DELTA_TIME } = require('./config');
const callCoreAccessApi = require('./callCoreAccessApi');

let timer = null;

function createRequestPool ({ visitor, method, maxSize }) {
  let requestPool = new Pool({ maxSize });

  requestPool.on(Pool.events.ADD, function () {
    if (timer === null) {
      timer = setTimeout(requestPool.flush.bind(requestPool), FLUSH_DELTA_TIME);
    }
  });

  requestPool.on(Pool.events.FULL, function () {
    requestPool.flush();
  });

  requestPool.on(Pool.events.FLUSH, function (requestItems) {
    callCoreAccessApi({ visitor, method, requestItems });
    timer = null;
  });

  return requestPool;
}

export default createRequestPool;
