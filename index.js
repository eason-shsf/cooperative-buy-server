const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const route = require('koa-route');
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
    // if (path == '/create' && method == "POST") {
    //     return controller.createBill(ctx);
    // } else if (path == '/join' && method == "POST") {

    // } else if (path == '/leave' && method == "POST") {

    // } else if (path == '/getBill' && method == "GET") {
    //     controller.getBill(ctx);
    // } else if (path == '/inBill' && method == "POST") {

    // } else if (path == '/uploadImg' && method == "POST") {

    // } else if (path == '/getImg') {
    //     return send_from_directory('./imgs', __filename);
    // }
};
const createBill = ctx => controller.createBill(ctx);
const joinBill = ctx => controller.joinBill(ctx);
const leaveBill = ctx => controller.leaveBill(ctx);
const getBill = ctx => controller.getBill(ctx);
const inBill = ctx => controller.inBill(ctx);

app.use(route.get('/', main));
app.use(route.post('/create', createBill));
app.use(route.post('/join', joinBill));
app.use(route.post('/leave', leaveBill));
app.use(route.post('/getBill', getBill));
app.use(route.post('/inBill', inBill));

// Force HTTPS on all page
app.use(enforceHttps());
// SSL options
var options = {
    key: fs.readFileSync('./certification/yujunhua.top.key'),  //ssl文件路径
    cert: fs.readFileSync('./certification/yujunhua.top.cer')  //ssl文件路径
};

// start the server
// http.createServer(app.callback()).listen(3000);
https.createServer(options, app.callback()).listen(443);