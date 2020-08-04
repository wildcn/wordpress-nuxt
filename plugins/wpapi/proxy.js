import { _fields } from './constants';

const proxy = (ctx, type) => {
  if (_fields[type]) {
    return function () {
      return ctx.apply(this, Array.from(arguments)).param('_fields', _fields[type].join(','));
    }
  }
  return ctx;
}

export default proxy;