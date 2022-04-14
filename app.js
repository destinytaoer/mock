const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const {createServer} = require("http");
const {WebSocketServer} = require('ws');
const pty = require("node-pty");
const os = require("os");

const routers = require('./routers/index');

const app = new Koa();
const router = new Router();
// 使用ctx.body解析中间件
// app.use(bodyParser());

// 跨域
app.use(cors({
  origin: function (ctx) { //设置允许来自指定域名请求
    if (ctx.url === '/test') {
      return '*'; // 允许来自所有域名请求
    }
    return 'http://localhost:3000'; //只允许http://localhost:8080这个域名的请求
  },
  maxAge: 5, //指定本次预检请求的有效期，单位为秒。
  credentials: true, //是否允许发送Cookie
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
}));
app.use(routers.routes()).use(router.allowedMethods());

const httpServer = createServer(app.callback());

const ws = new WebSocketServer({server: httpServer});
httpServer.listen(3001);

const shell = os.platform() === "win32" ? "powershell.exe" : "zsh";

const term = pty.spawn(shell, [], {
  name: "xterm-color",
  cols: 80,
  rows: 24,
  cwd: process.env.HOME,
  env: process.env,
});

ws.on("connection", (socket) => {

  term.on("data", function (data) {
    socket.send(data);
  });
  // socket.on 表示服务器接收一个客户端message 事件
  socket.on("message", (data) => {
    term.write(data);
  });
  // 客户端断开，自带事件
  socket.on("disconnect", function () {
    socket.send('leave')
    term.kill();
  });
});

const processMessage = (socket) => (str) => {
  if (str.toString() !== "b") {
    socket.send(str.toString());
  } else {
    socket.send("\u001b[K")
  }
}
