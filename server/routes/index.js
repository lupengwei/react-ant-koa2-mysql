'use strict';
var home       = require('../controllers/home');
var user       = require('../controllers/user');
var auth       = require('../controllers/auth');
var feedback = require('../controllers/feedback');
var update = require('../controllers/update');
var question = require('../controllers/question');
var questionType = require('../controllers/questionType');
var online = require('../controllers/online');
var onlineType = require('../controllers/onlineType');

module.exports = function routes(app) {
app.get('/', async (ctx, next) => { ctx.body = '后台已经在3002启动'});
app.get('/auth/login', auth.login);
app.post('/auth/get-user-info', auth.getuserinfo);
app.get('/api/users/get-user-info', user.getUserInfo);
app.get('/auth/login-by-wx', home.loginByWx);
app.get('/auth/login-by-wx-from-mobile', home.loginByWxFromMobile);
app.get('/auth/wx-auth/:type', home.wxAuth);
app.get('/api/users', user.all);
app.put('/api/users/update', user.update);
app.post('/auth/get-jsapi-ticket', home.wxJsapiTicket);
  

app.get('/api/update', update.index);
app.get('/api/update/:id', update.filter);
app.post('/api/update', update.create);
app.delete('/api/update/:id', update.destroy);


app.put('/api/feedbacks/:id', feedback.update);
app.get('/api/feedbacks', feedback.index);
app.post('/api/feedbacks', feedback.create);

app.get('/api/question', question.index);
app.post('/api/question', question.create);
app.delete('/api/question/:id', question.destroy);
app.get('/api/question/item/:id', question.filteritem);
app.put('/api/question/:id', question.update);
app.get('/api/question/:id', question.filter);
app.get('/api/question/title/:flag', question.searctTitle);
app.get('/api/questions', question.qusetionItem);

app.get('/api/questionType', questionType.index);
app.get('/api/questionType/:id', questionType.filter);
app.post('/api/questionType', questionType.create);
app.delete('/api/questionType/:id', questionType.destroy);
app.put('/api/questionType/:id', questionType.update);

app.get('/api/online', online.index);
app.post('/api/online', online.create);
app.put('/api/online/:id', online.update);
app.get('/api/online/:id', online.filter);
app.get('/api/online/file/:id', online.showFile);
app.delete('/api/online/:id', online.destroy);
app.get('/api/onlines', online.onlineItem);

app.get('/api/onlineType', onlineType.index);
app.get('/api/onlineType/:id', onlineType.filter);
app.post('/api/onlineType', onlineType.create);
app.delete('/api/onlineType/:id', onlineType.destroy);
app.put('/api/onlineType/:id', onlineType.update);


}
