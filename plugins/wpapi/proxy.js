import { _fields } from './constants';
import { isPlainObject } from 'lodash';

const proxy = (ctx, type) => {
  if (_fields[type]) {
    return function () {
      var arg = arguments[0];
      if (isPlainObject(arg) && arg._fields) {
        console.log("proxy -> arg", arg._fields)
        return ctx.apply(this, Array.from(arguments)).param('_fields', arg._fields)
      }
      return ctx.apply(this, Array.from(arguments)).param('_fields', _fields[type].join(','));
    }
  }
  return ctx;
}

export default proxy;