const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const routers = require('./routers/index');

const app = new Koa();
const router = new Router();

// 使用ctx.body解析中间件
app.use(bodyParser());

app.use(routers.routes()).use(router.allowedMethods());
app.listen(3000, () => {
  console.log(`服务器启动成功: http://localhost:3000`);
});
