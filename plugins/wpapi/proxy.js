import { _fields } from './constants';
import { isPlainObject } from 'lodash';
const POOL_MAX_LIMIT = 30;
const POOL_TIME_LIMIT = 500;

const poolCacheFn = {};
var timer;

export const proxyId = (wp, type, method) => {
  return function () {
    const id = arguments[0];
    poolCacheFn[type] = poolCacheFn[type] || {};
    return new Promise((resolve, reject) => {
      poolCacheFn[type][id] = { resolve, reject };
      
      if (!timer) {
        timer = setTimeout(() => {
          clearTimeout(timer);
          var ids = Object.keys(poolCacheFn[type]);
          console.log("timer -> ids", ids)
          wp[type]()[method](ids).then(datas => {
          
            const map = datas.reduce((pre, next) => {
              pre[next.post] = pre[next.post] || [];
              pre[next.post].push(next);
              return pre;
            }, {});
            ids.forEach(cid => {
              if (map[cid]) {
                poolCacheFn[type][cid].resolve(map[cid]);
              } else {
                poolCacheFn[type][cid].resolve([])
              }
            })
            delete poolCacheFn[type];
          })
        }, POOL_TIME_LIMIT);;
      }


    })
  }
}

const proxy = (ctx, type, getId) => {
  if (_fields[type]) {
    const response = function () {
      var arg = arguments[0];
      if (isPlainObject(arg) && arg._fields) {
        return ctx.apply(this, Array.from(arguments)).param('_fields', arg._fields)
      }
      return ctx.apply(this, Array.from(arguments)).param('_fields', _fields[type].join(','));
    }
    return response
  }
  return ctx;
}

export default proxy;