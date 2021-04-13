const searializeQuery = query => {
  if (!query) {
    return {
      limit: 10,
      offset: 0,
    };
  }
  const limit = query.limit ? +query.limit : 10;

  const offset = query.offset ? +query.offset : 0;

  return {
    limit,
    offset,
  }
}
module.exports = {
  searializeQuery
};