const router = require('@koa/router')();
const apiController = require('../controllers/api');

const routers = router.get('/list', apiController.getList);

module.exports = routers;
