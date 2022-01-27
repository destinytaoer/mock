const { people } = require('../models/list');

const getList = (ctx) => {
  const { page = 1, size = 10 } = ctx.request.query;
  ctx.body = {
    code: 10000,
    message: 'success',
    data: {
      page: Number(page),
      size: Number(size),
      total: people.peoples.length,
      list: people.peoples.slice((page - 1) * size, page * size),
    },
  };
};

module.exports = {
  getList,
};
