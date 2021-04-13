const REQUEST_POOL_SZIE = 25;
const FETCH_REQUEST_POOL_SZIE = 35; // 针对 fetch 场景给出优化的 size
const FLUSH_DELTA_TIME = 50; // 单位：毫秒

module.exports = { REQUEST_POOL_SZIE, FETCH_REQUEST_POOL_SZIE, FLUSH_DELTA_TIME };
