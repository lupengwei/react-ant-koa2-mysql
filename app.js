const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('kcors')
var db      = require('./models/index');
var routes  = require('./server/routes');

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))
// cors
app.use(cors())

// app.use( async (ctx,next)=> {
//   console.log(ctx.url);
//   if(process.env.NODE_ENV == 'production'){
//     oneapm.setTransactionName(ctx.url);
//   }
//   if(ctx.url.indexOf('/api/') >= 0) {
//     console.log(ctx.headers['authorization']);
//     var wxid = ctx.request.headers['authorization'];
//     console.log(wxid);
//     if(wxid) {
//       try{
//         var user = await db.User.findOne({
//           where: {
//             wxid: wxid
//           }
//         });
//         console.log(user);
//         ctx.user = user;
//         await next;
//       }catch (e) {
//         console.log(e);
//         ctx.status = 401;
//         ctx.body = {
//           msg: '身份验证失败'
//         };
//       };
//     }else {
//       ctx.status = 401;
//       ctx.body = {
//         msg: '身份验证失败'
//       };
//     }
//   }else {
//     if(ctx.url.indexOf('/no-auth-api/') >= 0 || ctx.url.indexOf('/dingtalk/') >= 0 || ctx.url.indexOf('/auth/') >= 0 || !/\/(js|css|img|fonts)\/\S/.test(ctx.url)) {
//       await next;
//     }else {

//       ctx.status = 404;
//       ctx.body = {
//         msg: '找不到页面'
//       };
//     }
//   }
// });



// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

/**
 * router
 */
const router = require('koa-router')();
app.use(router.routes());
routes(router);
// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
