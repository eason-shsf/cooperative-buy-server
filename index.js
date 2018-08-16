const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const route = require('koa-route');
const http = require('http')
const https = require('https');
const fs = require('fs');
const enforceHttps = require('koa-sslify');

const app = new Koa();
app.use(bodyParser());
const BillController = require('./Bill');

let controller = new BillController();

const main = ctx => {
    ctx.response.body = 'Hello World234';
    const path = ctx.request.path;
    const method = ctx.request.method;
};

let currentCount = 22;
const getCount = ctx => {
    ctx.response.body = currentCount;
    const path = ctx.request.path;
    const method = ctx.request.method;
}
const postCount = ctx => {
    currentCount = currentCount + 1;
    ctx.response.body = currentCount;
    const path = ctx.request.path;
    const method = ctx.request.method;
}
const createBill = ctx => controller.createBill(ctx);
const joinBill = ctx => controller.joinBill(ctx);
const leaveBill = ctx => controller.leaveBill(ctx);
const getBill = ctx => controller.getBill(ctx);
const inBill = ctx => controller.inBill(ctx);
const uploadImg = ctx => controller.uploadImg(ctx);

app.use(route.get('/', main));
app.use(route.post('/create', createBill));
app.use(route.post('/join', joinBill));
app.use(route.post('/leave', leaveBill));
app.use(route.post('/getBill', getBill));
app.use(route.post('/inBill', inBill));
app.use(route.post('/uploadImg', uploadImg))

app.use(route.get('/getcount', getCount));
app.use(route.post('/postcount', postCount));

// Force HTTPS on all page
app.use(enforceHttps());
// SSL options
var options = {
    key: fs.readFileSync('./certification/yujunhua.top.key'),  //ssl文件路径
    cert: fs.readFileSync('./certification/yujunhua.top.m.cer')  //ssl文件路径
};

// start the server
http.createServer(app.callback()).listen(3000);
// https.createServer(options, app.callback()).listen(443);