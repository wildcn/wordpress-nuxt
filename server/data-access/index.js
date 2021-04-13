import createRequestPool from './createRequestPool';

let requestPoolMap = new Map();

function getRequestPool ({ visitor, method, maxSize }) {
  let requestPool = null;
  let key = `${JSON.stringify(visitor)}_${method}_${maxSize}`;

  if (requestPoolMap.has(key)) {
    requestPool = requestPoolMap.get(key);
  } else {
    requestPool = createRequestPool({ visitor, method, maxSize });
    requestPoolMap.set(key, requestPool);
  }

  return requestPool;
}

export default getRequestPool;
